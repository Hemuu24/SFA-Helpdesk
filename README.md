# SFA 2.0 Help Desk Admin System

A comprehensive help desk system for the SFA 2.0 app with admin dashboard for ticket management.

## 🎯 **Project Overview**

This project provides a complete help desk solution for the SFA 2.0 app, including:
- **Public Help Desk** - Video tutorials, FAQ, and contact form
- **Admin Dashboard** - Ticket management and analytics
- **MongoDB Integration** - Persistent data storage
- **Secure Authentication** - Admin login system

## ✨ **Key Features**

### **Public Features**
- 📹 **Video Tutorials** - Under 1 minute in English and Telugu
- 🤖 **Knowledge-based Chatbot** - Answers app-related questions
- 🎁 **Simplified Schemes Section** - All organizational schemes in one place
- 📝 **Contact Form** - Submit support tickets

### **Admin Features**
- 🔐 **Secure Login** - Admin authentication system
- 📊 **Dashboard** - View and manage all tickets
- 📈 **Statistics** - Real-time analytics and metrics
- 🔄 **Status Management** - Update ticket statuses
- 📱 **Responsive Design** - Works on all devices

## 🛠️ **Technologies Used**

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Token-based admin system
- **Deployment**: Render (Backend), Vercel/Netlify (Frontend)

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hemuu24/SFA-Helpdesk.git
   cd SFA-Helpdesk
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your MongoDB credentials
   node server.js
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   # Open index.html in your browser
   ```

### **Environment Variables**

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_TOKEN_SECRET=your_generated_token
PORT=5000
NODE_ENV=development
```

## 🔒 **Security Features**

- ✅ **Environment Variables** - Sensitive data protected
- ✅ **Admin Authentication** - Token-based security
- ✅ **Input Validation** - Server-side validation
- ✅ **CORS Protection** - Cross-origin security
- ✅ **HTTPS Ready** - Production security

## 📁 **Project Structure**

```
SFA-Helpdesk/
├── backend/
│   ├── models/
│   │   └── SupportTicket.js
│   ├── server.js
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── index.html
│   ├── contact.html
│   ├── login.html
│   ├── admin.html
│   ├── config.js
│   ├── admin.js
│   ├── script.js
│   └── style.css
├── imagesandvideos/
├── .gitignore
├── DEPLOYMENT_GUIDE.md
└── README.md
```

## 🌐 **Deployment**

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions to Render.

## 🔧 **API Endpoints**

- `POST /api/tickets` - Submit support ticket
- `POST /api/admin/login` - Admin authentication
- `GET /api/tickets` - Get all tickets (admin)
- `PATCH /api/tickets/:id/status` - Update ticket status
- `GET /api/tickets/stats` - Get statistics

## 📊 **Admin Credentials**

**Default credentials** (change in production):
- Username: `admin`
- Password: `admin123`

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project was created as part of an internship at HCCB.

## 👨‍💻 **Developer**

Created by BTech CSE Student for Internship Project at HCCB.

---

**🎉 Built with real user feedback and on-site experience with presellers!** 
