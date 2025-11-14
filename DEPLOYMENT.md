# Deployment Guide

## Production Deployment

### Backend Deployment (Django)

#### Option 1: Heroku Deployment
1. Create `Procfile`:
```
web: gunicorn equipment_api.wsgi
```

2. Update `requirements.txt`:
```
gunicorn==21.2.0
dj-database-url==2.1.0
whitenoise==6.6.0
```

3. Update `settings.py` for production:
```python
import dj_database_url
import os

# Production settings
DEBUG = False
ALLOWED_HOSTS = ['your-app.herokuapp.com', 'localhost']

# Database
DATABASES = {
    'default': dj_database_url.config(default='sqlite:///db.sqlite3')
}

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

#### Option 2: AWS EC2 Deployment
1. Launch EC2 instance with Ubuntu
2. Install dependencies:
```bash
sudo apt update
sudo apt install python3-pip nginx
pip3 install -r requirements.txt
```

3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Frontend Deployment

#### Web Frontend (React)
1. Build for production:
```bash
npm run build
```

2. Deploy to Netlify/Vercel:
- Connect GitHub repository
- Set build command: `npm run build`
- Set publish directory: `build`

3. Update API base URL in `api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

#### Desktop Application Distribution
1. Create executable with PyInstaller:
```bash
pip install pyinstaller
pyinstaller --onefile --windowed main.py
```

2. Create installer with NSIS (Windows):
```nsis
!define APPNAME "Chemical Equipment Visualizer"
!define VERSION "1.0"

OutFile "ChemicalEquipmentVisualizer_Setup.exe"
InstallDir "$PROGRAMFILES\${APPNAME}"

Section "Install"
    SetOutPath $INSTDIR
    File "dist\main.exe"
    CreateShortcut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\main.exe"
SectionEnd
```

## Environment Configuration

### Development Environment
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
pip install -r requirements.txt

# Web Frontend
cd frontend_web
npm install

# Desktop Frontend
cd frontend_desktop
pip install -r requirements.txt
```

### Production Environment Variables
```bash
# Django
export SECRET_KEY="your-secret-key"
export DEBUG=False
export DATABASE_URL="your-database-url"

# CORS
export CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
```

## Security Considerations

### Authentication
- Change default admin credentials
- Implement JWT tokens for production
- Add rate limiting for API endpoints

### Database Security
- Use PostgreSQL for production
- Enable SSL connections
- Regular backups

### HTTPS Configuration
- Obtain SSL certificate (Let's Encrypt)
- Configure HTTPS redirects
- Update CORS settings for HTTPS

## Monitoring and Logging

### Django Logging
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Performance Monitoring
- Use Django Debug Toolbar for development
- Implement APM tools (New Relic, DataDog) for production
- Monitor API response times and error rates

## Backup Strategy

### Database Backup
```bash
# SQLite backup
cp db.sqlite3 backup_$(date +%Y%m%d).sqlite3

# PostgreSQL backup
pg_dump database_name > backup_$(date +%Y%m%d).sql
```

### File Backup
- Regular backup of uploaded CSV files
- Version control for code changes
- Automated backup scripts

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ALB, Nginx)
- Implement Redis for session storage
- Use CDN for static files

### Database Scaling
- Read replicas for heavy read workloads
- Connection pooling
- Query optimization

### Caching Strategy
- Redis for API response caching
- Browser caching for static assets
- Database query caching