import os
import sys
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'equipment_api.settings')

import django
django.setup()

from equipment.models import Dataset
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO

# Test PDF generation directly
datasets = Dataset.objects.all()
if datasets:
    dataset = datasets.first()
    print(f"Testing PDF for dataset: {dataset.name}")
    
    # Create PDF in memory
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Title
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, f"Equipment Report: {dataset.name}")
    
    # Get stats
    stats = dataset.get_summary_stats()
    print(f"Stats: {stats}")
    
    y_position = height - 100
    p.setFont("Helvetica", 12)
    p.drawString(50, y_position, f"Total Equipment: {stats.get('total_count', 0)}")
    
    p.save()
    
    # Save to file
    with open('test_direct.pdf', 'wb') as f:
        f.write(buffer.getvalue())
    
    print("PDF generated successfully: test_direct.pdf")
else:
    print("No datasets found")