import sys
import requests
import pandas as pd
from PyQt5.QtWidgets import (QApplication, QMainWindow, QVBoxLayout, QHBoxLayout, 
                             QWidget, QPushButton, QFileDialog, QTableWidget, 
                             QTableWidgetItem, QLabel, QComboBox, QMessageBox,
                             QTextEdit, QSplitter)
from PyQt5.QtCore import Qt, QThread, pyqtSignal
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import json

class APIClient:
    def __init__(self):
        self.base_url = 'http://localhost:8000/api'
    
    def upload_csv(self, file_path, name=None):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {'name': name} if name else {}
            response = requests.post(f'{self.base_url}/datasets/upload_csv/', 
                                   files=files, data=data)
            return response.json()
    
    def get_datasets(self):
        response = requests.get(f'{self.base_url}/datasets/')
        return response.json()
    
    def download_pdf(self, dataset_id):
        response = requests.get(f'{self.base_url}/datasets/{dataset_id}/generate_pdf/')
        return response.content

class UploadThread(QThread):
    finished = pyqtSignal(dict)
    error = pyqtSignal(str)
    
    def __init__(self, file_path, name=None):
        super().__init__()
        self.file_path = file_path
        self.name = name
        self.api_client = APIClient()
    
    def run(self):
        try:
            result = self.api_client.upload_csv(self.file_path, self.name)
            self.finished.emit(result)
        except Exception as e:
            self.error.emit(str(e))

class ChartWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.figure = Figure(figsize=(12, 6))
        self.canvas = FigureCanvas(self.figure)
        layout = QVBoxLayout()
        layout.addWidget(self.canvas)
        self.setLayout(layout)
    
    def plot_data(self, stats):
        self.figure.clear()
        
        # Create subplots
        ax1 = self.figure.add_subplot(121)
        ax2 = self.figure.add_subplot(122)
        
        # Bar chart for averages
        categories = ['Flowrate', 'Pressure', 'Temperature']
        values = [stats['avg_flowrate'], stats['avg_pressure'], stats['avg_temperature']]
        ax1.bar(categories, values, color=['#FF6384', '#36A2EB', '#FFCE56'])
        ax1.set_title('Average Parameters')
        ax1.set_ylabel('Values')
        
        # Pie chart for equipment types
        types = list(stats['type_distribution'].keys())
        counts = list(stats['type_distribution'].values())
        ax2.pie(counts, labels=types, autopct='%1.1f%%')
        ax2.set_title('Equipment Type Distribution')
        
        self.figure.tight_layout()
        self.canvas.draw()

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.api_client = APIClient()
        self.datasets = []
        self.current_dataset = None
        self.init_ui()
        self.load_datasets()
    
    def init_ui(self):
        self.setWindowTitle('Chemical Equipment Parameter Visualizer')
        self.setGeometry(100, 100, 1200, 800)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Main layout
        main_layout = QVBoxLayout()
        
        # Upload section
        upload_layout = QHBoxLayout()
        self.upload_btn = QPushButton('Upload CSV File')
        self.upload_btn.clicked.connect(self.upload_file)
        upload_layout.addWidget(self.upload_btn)
        upload_layout.addStretch()
        
        # Dataset selection
        self.dataset_combo = QComboBox()
        self.dataset_combo.currentTextChanged.connect(self.on_dataset_changed)
        upload_layout.addWidget(QLabel('Select Dataset:'))
        upload_layout.addWidget(self.dataset_combo)
        
        # PDF download button
        self.pdf_btn = QPushButton('Download PDF Report')
        self.pdf_btn.clicked.connect(self.download_pdf)
        self.pdf_btn.setEnabled(False)
        upload_layout.addWidget(self.pdf_btn)
        
        main_layout.addLayout(upload_layout)
        
        # Splitter for charts and table
        splitter = QSplitter(Qt.Vertical)
        
        # Summary and charts
        top_widget = QWidget()
        top_layout = QVBoxLayout()
        
        self.summary_text = QTextEdit()
        self.summary_text.setMaximumHeight(150)
        top_layout.addWidget(QLabel('Summary Statistics:'))
        top_layout.addWidget(self.summary_text)
        
        self.chart_widget = ChartWidget()
        top_layout.addWidget(self.chart_widget)
        
        top_widget.setLayout(top_layout)
        splitter.addWidget(top_widget)
        
        # Data table
        self.table = QTableWidget()
        splitter.addWidget(self.table)
        
        splitter.setSizes([400, 400])
        main_layout.addWidget(splitter)
        
        central_widget.setLayout(main_layout)
    
    def upload_file(self):
        file_path, _ = QFileDialog.getOpenFileName(self, 'Select CSV File', '', 'CSV Files (*.csv)')
        if file_path:
            self.upload_btn.setEnabled(False)
            self.upload_btn.setText('Uploading...')
            
            self.upload_thread = UploadThread(file_path)
            self.upload_thread.finished.connect(self.on_upload_finished)
            self.upload_thread.error.connect(self.on_upload_error)
            self.upload_thread.start()
    
    def on_upload_finished(self, dataset):
        self.upload_btn.setEnabled(True)
        self.upload_btn.setText('Upload CSV File')
        self.load_datasets()
        QMessageBox.information(self, 'Success', 'File uploaded successfully!')
    
    def on_upload_error(self, error):
        self.upload_btn.setEnabled(True)
        self.upload_btn.setText('Upload CSV File')
        QMessageBox.critical(self, 'Error', f'Upload failed: {error}')
    
    def load_datasets(self):
        try:
            self.datasets = self.api_client.get_datasets()
            self.dataset_combo.clear()
            
            for dataset in self.datasets:
                self.dataset_combo.addItem(f"{dataset['name']} ({dataset['uploaded_at'][:10]})")
            
            if self.datasets:
                self.current_dataset = self.datasets[0]
                self.update_display()
                self.pdf_btn.setEnabled(True)
        except Exception as e:
            QMessageBox.critical(self, 'Error', f'Failed to load datasets: {str(e)}')
    
    def on_dataset_changed(self, text):
        if text and self.datasets:
            index = self.dataset_combo.currentIndex()
            if 0 <= index < len(self.datasets):
                self.current_dataset = self.datasets[index]
                self.update_display()
    
    def update_display(self):
        if not self.current_dataset:
            return
        
        # Update summary
        stats = self.current_dataset['summary_stats']
        summary_lines = [
            f"Total Equipment: {stats['total_count']}",
            f"Average Flowrate: {stats['avg_flowrate']:.2f}",
            f"Average Pressure: {stats['avg_pressure']:.2f}",
            f"Average Temperature: {stats['avg_temperature']:.2f}",
            "",
            "Equipment Types:"
        ]
        
        for eq_type, count in stats['type_distribution'].items():
            summary_lines.append(f"- {eq_type}: {count}")
        
        self.summary_text.setPlainText('\n'.join(summary_lines))
        
        # Update charts
        self.chart_widget.plot_data(stats)
        
        # Update table
        equipment = self.current_dataset['equipment']
        self.table.setRowCount(len(equipment))
        self.table.setColumnCount(5)
        self.table.setHorizontalHeaderLabels(['Name', 'Type', 'Flowrate', 'Pressure', 'Temperature'])
        
        for i, item in enumerate(equipment):
            self.table.setItem(i, 0, QTableWidgetItem(item['name']))
            self.table.setItem(i, 1, QTableWidgetItem(item['type']))
            self.table.setItem(i, 2, QTableWidgetItem(f"{item['flowrate']:.2f}"))
            self.table.setItem(i, 3, QTableWidgetItem(f"{item['pressure']:.2f}"))
            self.table.setItem(i, 4, QTableWidgetItem(f"{item['temperature']:.2f}"))
        
        self.table.resizeColumnsToContents()
    
    def download_pdf(self):
        if not self.current_dataset:
            return
        
        try:
            pdf_content = self.api_client.download_pdf(self.current_dataset['id'])
            file_path, _ = QFileDialog.getSaveFileName(self, 'Save PDF Report', 
                                                     f"{self.current_dataset['name']}_report.pdf", 
                                                     'PDF Files (*.pdf)')
            if file_path:
                with open(file_path, 'wb') as f:
                    f.write(pdf_content)
                QMessageBox.information(self, 'Success', 'PDF report saved successfully!')
        except Exception as e:
            QMessageBox.critical(self, 'Error', f'Failed to download PDF: {str(e)}')

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()