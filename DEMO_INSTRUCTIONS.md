# Demo Instructions

## Quick Start Guide

### 1. Start the Backend Server
```bash
# Option 1: Use batch script (Windows)
double-click start_backend.bat

# Option 2: Manual start
cd backend
python manage.py runserver
```
Backend will run at: `http://localhost:8000`

### 2. Start Web Frontend
```bash
# Option 1: Use batch script (Windows)
double-click start_web.bat

# Option 2: Manual start
cd frontend_web
npm start
```
Web app will open at: `http://localhost:3000`

### 3. Start Desktop Application
```bash
# Option 1: Use batch script (Windows)
double-click start_desktop.bat

# Option 2: Manual start
cd frontend_desktop
python main.py
```

## Demo Workflow

### Step 1: Upload Sample Data
1. Use the provided `sample_equipment_data.csv` file
2. Upload via either web or desktop interface
3. Observe automatic data processing and visualization

### Step 2: Explore Features
- **Data Table**: View all equipment records
- **Charts**: Bar chart for averages, pie chart for type distribution
- **Summary Stats**: Total count, averages, type breakdown
- **PDF Report**: Download comprehensive report

### Step 3: Test History Management
1. Upload multiple CSV files (modify sample data)
2. Switch between datasets using dropdown
3. Verify only last 5 datasets are kept

### Step 4: Cross-Platform Verification
1. Upload data via web interface
2. View same data in desktop application
3. Confirm data synchronization through shared API

## Authentication
- Username: `admin`
- Password: `admin123`

## Troubleshooting

### Backend Issues
- Ensure Python dependencies are installed: `pip install -r backend/requirements.txt`
- Check if port 8000 is available
- Verify database migrations: `python manage.py migrate`

### Web Frontend Issues
- Install Node.js dependencies: `npm install`
- Check if port 3000 is available
- Verify API connection in browser console

### Desktop Application Issues
- Install PyQt5 dependencies: `pip install -r frontend_desktop/requirements.txt`
- Ensure backend server is running
- Check network connectivity to localhost:8000

## Sample Data Format
```csv
Equipment Name,Type,Flowrate,Pressure,Temperature
Pump A1,Pump,150.5,25.3,85.2
Heat Exchanger B2,Heat Exchanger,200.0,15.7,120.5
```

## Key Demo Points
1. **Hybrid Architecture**: Same backend serves both web and desktop
2. **Real-time Sync**: Data uploaded in one interface appears in the other
3. **Data Analytics**: Automatic calculation of statistics and visualizations
4. **Export Functionality**: PDF report generation
5. **User Management**: Authentication and dataset history per user