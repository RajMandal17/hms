# 🏥 Hospital Management System (HMS)


A comprehensive, production-ready Hospital Management System built with Spring Boot and React. This system provides end-to-end healthcare management capabilities including patient registration, appointment scheduling, billing, pharmacy management, and more.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## ✨ Features

### 👤 User Management
- **Role-based Authentication**: Admin, Doctor, Nurse, Receptionist, Pharmacist
- **JWT Token-based Security**: Secure API access
- **User Profile Management**: Complete user information handling

### 🏥 Patient Management
- **Patient Registration**: Comprehensive patient data collection
- **Medical History**: Complete patient medical records
- **Photo Management**: Patient photo upload and storage
- **Search & Filter**: Advanced patient search capabilities

### 📅 Appointment System
- **Appointment Scheduling**: Easy appointment booking
- **Calendar Management**: Visual appointment calendar
- **Status Tracking**: Pending, confirmed, completed appointments
- **Automated Notifications**: Email reminders and confirmations

### 🏨 OPD & IPD Management
- **Outpatient Department**: Consultation management
- **Inpatient Department**: Bed allocation and management
- **Vital Signs Tracking**: Patient vitals monitoring
- **Consultation Records**: Detailed medical consultations

### 💊 Pharmacy Management
- **Medicine Inventory**: Stock management and tracking
- **Prescription Management**: Digital prescription handling
- **Sales Tracking**: Pharmacy sales and reporting
- **Batch Management**: Medicine batch tracking
- **Returns Processing**: Medicine return handling

### 💰 Billing & Payments
- **Comprehensive Billing**: OPD, IPD, and pharmacy billing
- **Payment Processing**: Multiple payment methods
- **Insurance Claims**: Insurance claim management
- **Refund Management**: Automated refund processing
- **Audit Logs**: Complete financial audit trails

### 📊 Reporting & Analytics
- **PDF Generation**: Automated report generation
- **Financial Reports**: Revenue and expense tracking
- **Patient Analytics**: Patient demographic analysis
- **Inventory Reports**: Pharmacy stock reports

### 📧 Notification System
- **Email Notifications**: Automated email alerts
- **Appointment Reminders**: Scheduled notification system
- **System Alerts**: Important system notifications

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│────│  Spring Boot    │────│     MySQL       │
│   (Port 3000)   │    │   Backend       │    │   Database      │
│                 │    │   (Port 8080)   │    │   (Port 3307)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │                 │
                    │  File Storage   │
                    │   (uploads/)    │
                    │                 │
                    └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.3
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**: MySQL 8.0 / H2 (dev)
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Documentation**: Swagger/OpenAPI 3
- **PDF Generation**: OpenPDF
- **Email**: Spring Mail
- **Validation**: Hibernate Validator

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Styling**: Tailwind CSS + Emotion
- **State Management**: React Context
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Date Handling**: Day.js
- **PDF Generation**: jsPDF

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL 8.0
- **Environment**: Development, Production
- **Health Checks**: Spring Actuator
- **File Upload**: Apache Commons FileUpload

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 18** or higher
- **Maven 3.6** or higher
- **Docker & Docker Compose** (for containerized deployment)
- **MySQL 8.0** (if running without Docker)

## 🚀 Installation

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd hms
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui.html

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to the root directory**:
   ```bash
   cd hms
   ```

2. **Configure MySQL database**:
   ```sql
   CREATE DATABASE hms_db;
   CREATE USER 'hms_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON hms_db.* TO 'hms_user'@'localhost';
   ```

3. **Update application properties**:
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hms_db
   spring.datasource.username=hms_user
   spring.datasource.password=your_password
   ```

4. **Run the backend**:
   ```bash
   ./mvnw spring-boot:run
   ```

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hms_db
DB_USERNAME=hms_user
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400000

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# File Upload Configuration
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10MB

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Database Configuration

The application supports multiple database profiles:

- **Development**: H2 in-memory database
- **Production**: MySQL 8.0

### Security Configuration

- JWT tokens are used for authentication
- Role-based access control (RBAC)
- CORS is configured for frontend access
- Password encryption using BCrypt

## 📖 Usage

### Default User Accounts

After initial setup, you can log in with these default accounts:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Nurse | nurse@hospital.com | nurse123 |
| Receptionist | reception@hospital.com | reception123 |
| Pharmacist | pharmacy@hospital.com | pharmacy123 |

### Quick Start Guide

1. **Login** using default credentials
2. **Register Patients** through the patient management module
3. **Schedule Appointments** via the appointment system
4. **Manage Consultations** in OPD/IPD modules
5. **Process Billing** through the billing system
6. **Handle Pharmacy** operations for medicine management

## 📚 API Documentation

The API documentation is available through Swagger UI:

- **Local**: http://localhost:8080/swagger-ui.html
- **Production**: https://your-domain.com/swagger-ui.html

### Key API Endpoints

```
POST   /api/auth/login              # User authentication
GET    /api/patients                # Get all patients
POST   /api/patients                # Create new patient
GET    /api/appointments            # Get appointments
POST   /api/appointments            # Schedule appointment
GET    /api/billing/invoices        # Get billing invoices
POST   /api/pharmacy/sales          # Record pharmacy sale
```

## 🚀 Deployment

### Production Deployment with Docker

1. **Update docker-compose.yml** for production:
   ```yaml
   version: '3.8'
   services:
     mysql:
       environment:
         MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
         MYSQL_DATABASE: ${DB_NAME}
     backend:
       environment:
         SPRING_PROFILES_ACTIVE: production
         SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
   ```

2. **Deploy**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Manual Production Deployment

1. **Build the backend**:
   ```bash
   ./mvnw clean package -Pprod
   ```

2. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to your server** using your preferred method (AWS, Azure, etc.)

### Environment-Specific Configurations

- **Development**: Use H2 database, hot reload enabled
- **Production**: MySQL database, optimized builds, security hardening

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -am 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit a Pull Request**

### Development Guidelines

- Follow Java coding standards
- Write unit tests for new features
- Use TypeScript for frontend development
- Follow Material-UI design guidelines
- Update documentation for new features


## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information
4. **Contact support** at: Rajmandal147@gmail.com

## 📞 Contact

- **Project Maintainer**: [Your Name]
- **Email**: [Rajmandal147@gmail.com]
- **LinkedIn**: [https://www.linkedin.com/in/rajkumarmandal17/]
- **GitHub**: [https://github.com/RajMandal17]

---

**⭐ If you found this project helpful, please give it a star!**

## 🔄 Recent Updates

- **v1.0.0** (Current): Initial production release
  - Complete hospital management features
  - Docker containerization
  - Comprehensive API documentation
  - Production-ready security implementation

---

*Built with ❤️ for healthcare management*
