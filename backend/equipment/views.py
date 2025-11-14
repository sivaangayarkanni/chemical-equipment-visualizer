from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.db.models import Avg, Count
from io import BytesIO
import pandas as pd
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from .models import Dataset, Equipment
from .serializers import DatasetSerializer, FileUploadSerializer

class DatasetViewSet(viewsets.ModelViewSet):
    serializer_class = DatasetSerializer
    permission_classes = []
    
    def get_queryset(self):
        return Dataset.objects.all()[:5]
    
    @action(detail=False, methods=['post'])
    def upload_csv(self, request):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']
            name = serializer.validated_data.get('name', file.name)
            
            try:
                df = pd.read_csv(file)
                required_columns = ['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature']
                if not all(col in df.columns for col in required_columns):
                    return Response({'error': 'Invalid CSV format'}, status=status.HTTP_400_BAD_REQUEST)
                
                from django.contrib.auth.models import User
                admin_user = User.objects.first()
                dataset = Dataset.objects.create(name=name, uploaded_by=admin_user, file_path=file.name)
                
                equipment_list = []
                for _, row in df.iterrows():
                    equipment_list.append(Equipment(
                        dataset=dataset, name=row['Equipment Name'], type=row['Type'],
                        flowrate=float(row['Flowrate']), pressure=float(row['Pressure']), 
                        temperature=float(row['Temperature'])
                    ))
                Equipment.objects.bulk_create(equipment_list)
                
                stats = self.calculate_summary_stats(dataset)
                dataset.set_summary_stats(stats)
                dataset.save()
                
                old_datasets = Dataset.objects.all()[5:]
                for old_dataset in old_datasets:
                    old_dataset.delete()
                
                return Response(DatasetSerializer(dataset).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        dataset = self.get_object()
        stats = dataset.get_summary_stats()
        return Response(stats)
    
    @action(detail=True, methods=['get'])
    def generate_pdf(self, request, pk=None):
        try:
            dataset = self.get_object()
            buffer = BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            width, height = letter
            
            p.setFont("Helvetica-Bold", 16)
            p.drawString(50, height - 50, f"Equipment Report: {dataset.name}")
            
            stats = dataset.get_summary_stats()
            y = height - 100
            p.setFont("Helvetica", 12)
            p.drawString(50, y, f"Total Equipment: {stats.get('total_count', 0)}")
            y -= 20
            p.drawString(50, y, f"Average Flowrate: {stats.get('avg_flowrate', 0):.2f}")
            y -= 20
            p.drawString(50, y, f"Average Pressure: {stats.get('avg_pressure', 0):.2f}")
            y -= 20
            p.drawString(50, y, f"Average Temperature: {stats.get('avg_temperature', 0):.2f}")
            y -= 40
            p.drawString(50, y, "Equipment Types:")
            y -= 20
            
            for eq_type, count in stats.get('type_distribution', {}).items():
                p.drawString(70, y, f"- {eq_type}: {count}")
                y -= 15
            
            p.save()
            response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{dataset.name}_report.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def calculate_summary_stats(self, dataset):
        equipment = dataset.equipment.all()
        if not equipment.exists():
            return {}
        
        stats = equipment.aggregate(
            avg_flowrate=Avg('flowrate'), avg_pressure=Avg('pressure'), avg_temperature=Avg('temperature')
        )
        type_dist = equipment.values('type').annotate(count=Count('type'))
        type_distribution = {item['type']: item['count'] for item in type_dist}
        
        return {
            'total_count': equipment.count(),
            'avg_flowrate': round(stats['avg_flowrate'], 2),
            'avg_pressure': round(stats['avg_pressure'], 2),
            'avg_temperature': round(stats['avg_temperature'], 2),
            'type_distribution': type_distribution
        }