import requests
import os

# Upload sample data first
print("Uploading sample data...")
with open('sample_equipment_data.csv', 'rb') as f:
    upload_response = requests.post('http://127.0.0.1:8000/api/datasets/upload_csv/', 
                                  files={'file': f})

print(f"Upload status: {upload_response.status_code}")

if upload_response.status_code == 201:
    dataset = upload_response.json()
    dataset_id = dataset['id']
    print(f"Dataset created with ID: {dataset_id}")
    
    # Test PDF generation
    print("Generating PDF...")
    pdf_response = requests.get(f'http://127.0.0.1:8000/api/datasets/{dataset_id}/generate_pdf/')
    
    print(f"PDF status: {pdf_response.status_code}")
    print(f"Content type: {pdf_response.headers.get('content-type')}")
    print(f"Content length: {len(pdf_response.content)} bytes")
    
    if pdf_response.status_code == 200:
        # Save PDF to test
        with open('test_report.pdf', 'wb') as f:
            f.write(pdf_response.content)
        print("PDF saved as test_report.pdf")
    else:
        print("PDF generation failed:", pdf_response.text)
else:
    print("Upload failed:", upload_response.text)