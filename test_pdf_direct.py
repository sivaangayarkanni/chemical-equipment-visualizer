import os
import django
import sys

# Add the backend directory to Python path
sys.path.append('c:\\chemical_equipment_visualizer\\backend')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'equipment_api.settings')
django.setup()

from equipment.models import Dataset
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Test PDF generation
try:
    dataset = Dataset.objects.first()
    if dataset:
        print(f"Found dataset: {dataset.name}")
        
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
        
        p.save()
        
        # Save to file
        with open('test_report.pdf', 'wb') as f:
            f.write(buffer.getvalue())
        
        print("PDF generated successfully: test_report.pdf")
    else:
        print("No datasets found")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()