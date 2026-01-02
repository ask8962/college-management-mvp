# Indian College OS

A production-ready MVP for Indian college students to manage attendance, exams, notices, and placements.

## 🚀 Tech Stack

### Backend
- **Java 17+** with Spring Boot 3.2
- **Spring Security** + JWT authentication
- **Spring Data MongoDB**
- **Maven** for build management
- **Cloudinary** for file storage
- **Google Gemini AI** for notice summarization
- **Apache PDFBox** for PDF text extraction

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Database
- **MongoDB Atlas** (NoSQL)

## 📁 Project Structure

```
indian-college-os-backend/     # Spring Boot backend
indian-college-os-frontend/    # Next.js frontend
```

## 🛠️ Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- MongoDB Atlas account
- Cloudinary account
- Google AI API key

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd indian-college-os-backend
   ```

2. Set environment variables:
   ```bash
   export MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/collegeos
   export JWT_SECRET=your-256-bit-secret-key-minimum-32-characters
   export CLOUDINARY_CLOUD_NAME=your-cloud-name
   export CLOUDINARY_API_KEY=your-api-key
   export CLOUDINARY_API_SECRET=your-api-secret
   export GOOGLE_AI_API_KEY=your-gemini-api-key
   export CORS_ORIGINS=http://localhost:3000
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   Backend will start at `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd indian-college-os-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   # Edit .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   Frontend will start at `http://localhost:3000`

## 👥 User Roles

### ADMIN
- Upload notices (PDF/Image) with AI summarization
- Create exams & deadlines
- Add placement drives
- Manage student attendance

### STUDENT
- View attendance with percentage tracking
- View notices with AI-generated summaries
- Track exams & deadlines
- View placement opportunities

## 🔐 API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register student |
| POST | `/auth/login` | Public | Login |
| GET | `/attendance` | STUDENT | Get student attendance |
| POST | `/attendance` | ADMIN | Add attendance record |
| GET | `/notices` | ALL | Get all notices |
| POST | `/notices` | ADMIN | Upload notice |
| GET | `/exams` | ALL | Get all exams |
| POST | `/exams` | ADMIN | Create exam |
| GET | `/placements` | ALL | Get all placements |
| POST | `/placements` | ADMIN | Add placement |

## 🚢 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `mvn clean package -DskipTests`
4. Set start command: `java -jar target/indian-college-os-1.0.0.jar`
5. Add environment variables

### Frontend (Vercel)
1. Import project from GitHub
2. Set `NEXT_PUBLIC_API_URL` to your Render backend URL
3. Deploy

## 📝 Creating Admin User

To create an admin user, use MongoDB Compass or mongosh:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@college.edu",
  password: "$2a$10$...", // BCrypt hash of password
  role: "ADMIN"
})
```

Or temporarily modify the `AuthService.java` to set role as ADMIN for registration.

## 📄 License

MIT License
