import os
import sys
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'equipment_api.settings')

import django
django.setup()

from equipment.models import Dataset, Equipment
from django.contrib.auth.models import User
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import pandas as pd

# Create test data and PDF
print("Creating test dataset...")
user, _ = User.objects.get_or_create(username='admin', defaults={'email': 'admin@test.com'})

# Read CSV
df = pd.read_csv('sample_equipment_data.csv')
dataset = Dataset.objects.create(name='Test Report', uploaded_by=user, file_path='test.csv')

# Create equipment
for _, row in df.iterrows():
    Equipment.objects.create(
        dataset=dataset,
        name=row['Equipment Name'],
        type=row['Type'],
        flowrate=float(row['Flowrate']),
        pressure=float(row['Pressure']),
        temperature=float(row['Temperature'])
    )

# Calculate stats
equipment = dataset.equipment.all()
stats = {
    'total_count': equipment.count(),
    'avg_flowrate': sum(e.flowrate for e in equipment) / equipment.count(),
    'avg_pressure': sum(e.pressure for e in equipment) / equipment.count(),
    'avg_temperature': sum(e.temperature for e in equipment) / equipment.count(),
}

dataset.set_summary_stats(stats)
dataset.save()

# Generate PDF
print("Generating PDF...")
from io import BytesIO
buffer = BytesIO()
p = canvas.Canvas(buffer, pagesize=letter)
width, height = letter

p.setFont("Helvetica-Bold", 16)
p.drawString(50, height - 50, f"Equipment Report: {dataset.name}")

p.setFont("Helvetica", 12)
y = height - 100
p.drawString(50, y, f"Total Equipment: {stats['total_count']}")
y -= 20
p.drawString(50, y, f"Average Flowrate: {stats['avg_flowrate']:.2f}")
y -= 20
p.drawString(50, y, f"Average Pressure: {stats['avg_pressure']:.2f}")
y -= 20
p.drawString(50, y, f"Average Temperature: {stats['avg_temperature']:.2f}")

p.save()

# Save PDF
with open('equipment_report_working.pdf', 'wb') as f:
    f.write(buffer.getvalue())

print(f"PDF generated: equipment_report_working.pdf")
print(f"Dataset ID: {dataset.id}")
print("PDF generation is working!")