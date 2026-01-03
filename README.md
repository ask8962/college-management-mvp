# 🎓 Indian College OS

<div align="center">

![College OS Banner](https://img.shields.io/badge/College-OS-blueviolet?style=for-the-badge&logo=graduation-cap)

**The Ultimate Student Management Platform for Indian Colleges**

[![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=java)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## ⚡ What Makes Us Different

This isn't just another boring college portal. We built **features students actually want**:

| Feature | Description |
|---------|-------------|
| 🔥 **Assignment Hustle** | P2P marketplace for assignments, notes & projects |
| ⭐ **Rate My Khadoos** | Anonymous professor ratings with stats |
| 🚨 **Flash Alert** | Real-time attendance alerts with phone vibration |
| 📊 **Bunk-o-Meter** | Calculate safe bunks to maintain 75% |
| 🏆 **Activity Streak** | LeetCode-style daily streaks with XP & badges |
| 💬 **Broadcast Chat** | WhatsApp-style rooms with admin controls |
| 🌓 **Dark/Light Mode** | Beautiful theme toggle |

---

## 🎯 Features

### 📚 Core Features
- ✅ **Attendance Tracking** - View records, percentages & safe bunks
- ✅ **Notice Board** - AI-powered PDF/image summarization
- ✅ **Exam Schedule** - Upcoming exams with countdown
- ✅ **Placement Portal** - Job listings with apply links
- ✅ **Admin Dashboard** - Full CRUD for all modules

### 🔥 Student-Focused Features
- ✅ **Assignment Marketplace** - Buy/sell notes, assignments
- ✅ **Professor Reviews** - Rate profs anonymously
- ✅ **Attendance Alerts** - Get notified when roll call starts
- ✅ **Activity Gamification** - Daily streaks, XP, badges, heatmap
- ✅ **Group Chat** - Broadcast/open chat modes

### 🛡️ Security & UX
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access** - Admin vs Student permissions
- ✅ **Responsive Design** - Works on all devices
- ✅ **Dark/Light Mode** - Theme persistence
- ✅ **Real-time Updates** - Auto-refresh for alerts

---

## 📸 Demo

### Dashboard
![Dashboard Screenshot](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Features
| Bunk-o-Meter | Activity Streak | Chat |
|--------------|-----------------|------|
| Track your safe bunks | LeetCode-style heatmap | Broadcast mode toggle |

---

## 🚀 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Java 17+ | Core language |
| Spring Boot 3.2 | Framework |
| Spring Security | Authentication |
| MongoDB Atlas | Database |
| JWT | Token auth |
| Cloudinary | File storage |
| Google Gemini AI | Notice summarization |
| Apache PDFBox | PDF extraction |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Lucide React | Icons |

---

## 🛠️ Installation

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- MongoDB Atlas account
- Cloudinary account
- Google AI API key

### 1️⃣ Clone Repository
```bash
git clone https://github.com/ask8962/college-management-mvp.git
cd college-management-mvp
```

### 2️⃣ Backend Setup
```bash
cd indian-college-os-backend

# Set environment variables
export MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/collegeos
export JWT_SECRET=your-256-bit-secret-key-minimum-32-characters
export CLOUDINARY_CLOUD_NAME=your-cloud-name
export CLOUDINARY_API_KEY=your-api-key
export CLOUDINARY_API_SECRET=your-api-secret
export GOOGLE_AI_API_KEY=your-gemini-api-key
export CORS_ORIGINS=http://localhost:3000

# Run backend
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### 3️⃣ Frontend Setup
```bash
cd indian-college-os-frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Run frontend
npm run dev
```
Frontend runs at: `http://localhost:3000`

---

## 👥 User Roles

### 🔐 Admin
- Upload notices (PDF/Image) with AI summarization
- Create exams & deadlines
- Add placement drives
- Manage student attendance
- Create chat rooms (broadcast/open)
- Toggle broadcast mode

### 🎓 Student
- View attendance with percentage tracking
- Calculate safe bunks (Bunk-o-Meter)
- View notices with AI-generated summaries
- Track exams & deadlines
- View placement opportunities
- Daily check-in for streaks
- Post/view assignment requests
- Rate professors anonymously
- Receive attendance alerts
- Chat in allowed rooms

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register student |
| POST | `/auth/login` | Login user |

### Core Modules
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/attendance` | Student | Get own attendance |
| POST | `/attendance` | All | Mark attendance |
| GET | `/notices` | All | Get notices |
| POST | `/notices` | Admin | Upload notice |
| GET | `/exams` | All | Get exams |
| POST | `/exams` | Admin | Create exam |
| GET | `/placements` | All | Get placements |
| POST | `/placements` | Admin | Add placement |

### Student Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/gigs` | Assignment marketplace |
| GET/POST | `/reviews` | Professor reviews |
| GET/POST | `/alerts` | Attendance alerts |
| GET/POST | `/activity` | Streak & check-in |
| GET/POST | `/chat/rooms` | Chat rooms |
| GET/POST | `/chat/rooms/:id/messages` | Messages |

---

## 🚢 Deployment

### Backend on Render
1. Create Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Build: `mvn clean package -DskipTests`
4. Start: `java -jar target/indian-college-os-1.0.0.jar`
5. Add all environment variables

### Frontend on Vercel
1. Import from GitHub on [Vercel](https://vercel.com)
2. Set `NEXT_PUBLIC_API_URL` to Render URL
3. Deploy!

---

## 📝 Creating Admin User

```javascript
// In MongoDB Compass or mongosh:
db.users.insertOne({
  name: "Admin User",
  email: "admin@college.edu",
  password: "$2a$10$...", // BCrypt hash
  role: "ADMIN"
})
```

Or temporarily modify `AuthService.java` to register as ADMIN.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**ASK8962**

- GitHub: [@ask8962](https://github.com/ask8962)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ for Indian College Students

</div>
