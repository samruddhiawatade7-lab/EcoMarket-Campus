# EcoMarket - Full-Stack E-Commerce Sustainability Marketplace

EcoMarket is a complete, production-grade full-stack e-commerce marketplace dedicated to sustainable, pre-owned, refurbished, recycled, and upcycled products. It features dynamic sustainability scoring, detailed environmental impact metrics (CO₂ avoided, water saved, waste reduced), role-based access (Buyer, Seller, Admin), atomic checkout processing, and real-time interactive UI dashboards.

---

## 🚀 Tech Stack

### **Backend**
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.5
- **Security**: Spring Security + JWT Authentication (Stateless Stateless Security)
- **Database**: MySQL (`ecomarket_db`) with Spring Data JPA & Hibernate 6
- **Testing**: H2 Database (In-Memory for unit/integration tests with `mvn test`)
- **Build Tool**: Apache Maven

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Build System**: Vite
- **Styling**: Tailwind CSS + Lucide React Icons
- **State & Forms**: React Context API, React Hook Form
- **Analytics/Charts**: Recharts
- **HTTP Client**: Axios with automated JWT Bearer interceptors

---

## 💡 Key Features & Architecture

### **1. Sustainability Engine**
- **Deterministic Sustainability Score (0 - 100)**: Evaluates items based on:
  - **Condition** (Refurbished: +25, Pre-owned: +30, Upcycled: +35, Recycled: +35, New: +10)
  - **Eco-Certifications** (Energy Star, Fair Trade, GOTS, etc.: up to +25)
  - **Recycled Content & Materials** (up to +20)
  - **Repairability & Recyclability** (up to +20)
- **Environmental Impact Metrics**: Calculates real-time savings per purchase and across the entire platform:
  - **CO₂ Avoided** (kg)
  - **Water Saved** (Liters)
  - **Waste Reduced** (kg)

### **2. Multi-Role Permissions**
- **BUYER**: Browse products with filters, dynamic search, add to cart/wishlist, atomic multi-item checkout, view order history & sustainability impact metrics, write verified purchase reviews.
- **SELLER**: Submit products with eco-attributes (status set to `PENDING` awaiting Admin approval), manage inventory, view personal order items & sales analytics.
- **ADMIN**: Approve/reject pending seller products, manage categories, view platform-wide analytics, manage user accounts (deactivate/activate).

---

## 🔑 Default Credentials (Database Seeder)

The application automatically seeds standard roles and test accounts on launch:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ecomarket.com` | `Admin@123` |
| **Seller** | `seller@ecomarket.com` | `Seller@123` |
| **Buyer** | `buyer@ecomarket.com` | `Buyer@123` |

---

## 🛠️ Installation & Setup Guide

### **Prerequisites**
- **JDK**: Java 21 or higher
- **Node.js**: Node 18+ and npm
- **Database**: MySQL 5.5+ or 8.0+ running on `localhost:3306`

### **1. Database Configuration**
Create a MySQL database named `ecomarket_db`:
```sql
CREATE DATABASE ecomarket_db;
```

### **2. Backend Setup (`/backend`)**
Navigate to the `backend` folder:
```bash
cd backend
```
Verify `src/main/resources/application.properties` settings:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecomarket_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```
Run the application:
```bash
mvn spring-boot:run
```
The backend API will start on **`http://localhost:8080`**.

To execute backend test suite (uses embedded H2 database):
```bash
mvn test
```

### **3. Frontend Setup (`/frontend`)**
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The application will open on **`http://localhost:5173`**.

---

## 📊 API Overview

| Category | Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | Public | Register new account |
| **Auth** | `/api/auth/login` | `POST` | Public | Authenticate user & issue JWT |
| **Products** | `/api/products` | `GET` | Public | Search & filter approved products |
| **Products** | `/api/products/{id}` | `GET` | Public | Get product details & impact breakdown |
| **Cart** | `/api/cart` | `GET` | Buyer | Fetch current shopping cart |
| **Orders** | `/api/orders/checkout` | `POST` | Buyer | Atomic checkout creation |
| **Impact** | `/api/impact/summary` | `GET` | Public | Get global environmental impact metrics |
| **Seller** | `/api/seller/products` | `POST` | Seller | Submit new product for approval |
| **Admin** | `/api/admin/products/{id}/approve` | `PUT` | Admin | Approve pending seller submission |

---

## 🛡️ License
Distributed under the MIT License.
