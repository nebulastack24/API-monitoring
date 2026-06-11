# 🚀 API Monitoring Dashboard

A real-time API monitoring platform that continuously tracks API uptime, response times, service health, and performance metrics.

---

## ✨ Features

✅ Register APIs for monitoring

✅ Automated health checks using Spring Scheduler

✅ Response time tracking

✅ Uptime percentage calculation

✅ Historical monitoring records

✅ API status monitoring (UP / DOWN)

✅ Dashboard analytics

✅ RESTful APIs

✅ PostgreSQL database integration

✅ Flyway database migrations

---

## 🏗️ System Architecture

```text
          Admin
            │
            ▼
      Dashboard UI
            │
            ▼
      Spring Boot API
            │
   ┌────────┴────────┐
   │                 │
Scheduler       PostgreSQL
   │
   ▼
Check APIs
   │
   ▼
Store Results
```

---

## 🛠️ Tech Stack

### Backend

* ☕ Java
* 🌱 Spring Boot
* 🗄️ Spring Data JPA
* 🐘 PostgreSQL
* 🛫 Flyway
* ⏰ Spring Scheduler

### Frontend

* ⚛️ React
* 📊 Chart.js
* 🔗 Axios

---

## 📂 Project Structure

```text
backend
├── controller
├── service
├── repository
├── entity
├── dto
├── scheduler
└── config

frontend
├── components
├── pages
├── services
├── charts
└── styles
```
---

## 📊 Dashboard Metrics

The dashboard provides:

* 📦 Total APIs
* ✅ Healthy APIs
* ❌ Failed APIs
* ⚡ Average Response Time
* 📈 Overall Uptime Percentage

Example:

```text
Total APIs: 15

Healthy APIs: 13

Failed APIs: 2

Average Response Time: 145 ms

Overall Uptime: 99.2%
```

---

## 📸 Planned Features

* 🔐 JWT Authentication
* 📧 Email Alerts
* 🤖 Telegram Notifications
* ⚡ Multi-threaded Monitoring
* 📄 Downtime Reports
* 📊 Interactive Charts
* 🌓 Dark Mode Dashboard

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
```

### 2️⃣ Configure PostgreSQL

Create a database:

```sql
CREATE DATABASE api_monitor;
```

### 3️⃣ Update application.properties

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/api_monitor
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### 4️⃣ Run Application

```bash
mvn spring-boot:run
```

### 5️⃣ Access Application

```text
http://localhost:8080
```

---

## 🎯 Learning Outcomes

Through this project, I gained experience with:

* Spring Boot Development
* REST API Design
* Database Migrations with Flyway
* PostgreSQL Integration
* Scheduled Tasks
* Monitoring Systems
* Backend Architecture
* Performance Analytics

---

## 👨‍💻 Author

**Rakshitha Duraisamy**

Built as a portfolio project to explore backend development, monitoring systems, and scalable application design.

---

⭐ If you found this project interesting, consider giving it a star!
