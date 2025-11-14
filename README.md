# Chemical Equipment Parameter Visualizer

A hybrid web and desktop application for visualizing chemical equipment data with Django backend, React web frontend, and PyQt5 desktop frontend.

## Features

- **CSV Upload**: Upload chemical equipment data via web or desktop interface
- **Data Visualization**: Interactive charts showing equipment parameters and type distribution
- **Summary Statistics**: Automatic calculation of averages and equipment counts
- **History Management**: Store and access last 5 uploaded datasets
- **PDF Reports**: Generate downloadable PDF reports
- **Authentication**: Basic authentication for API access

## Tech Stack

- **Backend**: Django + Django REST Framework
- **Web Frontend**: React.js + TypeScript + Chart.js
- **Desktop Frontend**: PyQt5 + Matplotlib
- **Database**: SQLite
- **Data Processing**: Pandas

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start Django server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

**Default credentials**: username: `admin`, password: `admin123`

### Web Frontend Setup

1. Navigate to web frontend directory:
```bash
cd frontend_web
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The web app will be available at `http://localhost:3000`

### Desktop Frontend Setup

1. Navigate to desktop frontend directory:
```bash
cd frontend_desktop
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python main.py
```

## CSV Format

The application expects CSV files with the following columns:
- Equipment Name
- Type
- Flowrate
- Pressure
- Temperature

Sample data is provided in `sample_equipment_data.csv`.

## API Endpoints

- `GET /api/datasets/` - List recent datasets
- `POST /api/datasets/upload_csv/` - Upload CSV file
- `GET /api/datasets/{id}/summary/` - Get dataset summary
- `GET /api/datasets/{id}/generate_pdf/` - Download PDF report

## Authentication

Both frontends use HTTP Basic Authentication with the following default credentials:
- Username: `admin`
- Password: `admin123`

## Project Structure

```
chemical_equipment_visualizer/
├── backend/                 # Django backend
│   ├── equipment/          # Django app
│   ├── equipment_api/      # Django project
│   └── requirements.txt
├── frontend_web/           # React web frontend
│   ├── src/
│   │   ├── components/
│   │   ├── api.ts
│   │   └── types.ts
│   └── package.json
├── frontend_desktop/       # PyQt5 desktop frontend
│   ├── main.py
│   └── requirements.txt
├── sample_equipment_data.csv
└── README.md
```

## Demo

1. Start the Django backend server
2. Launch either the web or desktop frontend
3. Upload the provided sample CSV file
4. View the generated charts and statistics
5. Download PDF reports
6. Upload additional datasets to see history management

## Development Notes

- The application stores only the last 5 datasets per user
- PDF reports include summary statistics and equipment type distribution
- Both frontends consume the same Django REST API
- CORS is configured to allow requests from the React development server