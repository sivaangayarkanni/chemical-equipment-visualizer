#!/usr/bin/env python3
"""
Chemical Equipment Report Generator
Generates comprehensive PDF reports with analytics
"""

import requests
import json
from datetime import datetime

def generate_comprehensive_report():
    """Generate and download PDF report"""
    
    print("ChemLab Analytics Pro - Report Generator")
    print("=" * 50)
    
    # Upload sample data
    print("Uploading equipment data...")
    
    try:
        with open('sample_equipment_data.csv', 'rb') as f:
            upload_response = requests.post(
                'http://127.0.0.1:8000/api/datasets/upload_csv/', 
                files={'file': f}, 
                data={'name': f'Process Analysis Report - {datetime.now().strftime("%Y-%m-%d %H:%M")}'}
            )
        
        if upload_response.status_code == 201:
            dataset = upload_response.json()
            dataset_id = dataset['id']
            
            print(f"SUCCESS: Dataset uploaded successfully!")
            print(f"   Dataset ID: {dataset_id}")
            print(f"   Equipment count: {len(dataset['equipment'])}")
            print(f"   Total records: {dataset['summary_stats']['total_count']}")
            
            # Display summary statistics
            stats = dataset['summary_stats']
            print(f"\nProcess Summary:")
            print(f"   Average Temperature: {stats['avg_temperature']:.1f} C")
            print(f"   Average Pressure: {stats['avg_pressure']:.1f} bar")
            print(f"   Average Flowrate: {stats['avg_flowrate']:.1f} L/min")
            
            print(f"\nEquipment Distribution:")
            for eq_type, count in stats['type_distribution'].items():
                print(f"   - {eq_type}: {count} units")
            
            # Generate PDF report
            print(f"\nGenerating comprehensive PDF report...")
            
            pdf_response = requests.get(f'http://127.0.0.1:8000/api/datasets/{dataset_id}/generate_pdf/')
            
            if pdf_response.status_code == 200:
                # Save PDF with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f'ChemLab_Process_Report_{timestamp}.pdf'
                
                with open(filename, 'wb') as f:
                    f.write(pdf_response.content)
                
                print(f"SUCCESS: PDF Report Generated!")
                print(f"   Filename: {filename}")
                print(f"   File size: {len(pdf_response.content):,} bytes")
                print(f"   Location: {filename}")
                
                print(f"\nReport Contents:")
                print(f"   - Equipment inventory and specifications")
                print(f"   - Process parameter analysis")
                print(f"   - Statistical summaries")
                print(f"   - Equipment type distribution")
                
                print(f"\nReport ready for download and analysis!")
                return True
                
            else:
                print(f"ERROR: PDF generation failed!")
                print(f"   Status code: {pdf_response.status_code}")
                print(f"   Error: {pdf_response.text}")
                return False
                
        else:
            print(f"ERROR: Data upload failed!")
            print(f"   Status code: {upload_response.status_code}")
            print(f"   Error: {upload_response.text}")
            return False
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = generate_comprehensive_report()
    if success:
        print(f"\nProcess completed successfully!")
    else:
        print(f"\nProcess failed. Check backend server status.")