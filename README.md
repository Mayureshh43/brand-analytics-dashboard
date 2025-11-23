# 🚀 Brand Sales Analytics Dashboard

A comprehensive MERN stack application for analyzing brand sales and advertising metrics with interactive visualizations and real-time data filtering.

![Dashboard Preview](https://img.shields.io/badge/MERN-Stack-green) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)

## 📊 Live Demo

**Live URL:** [brand-analytics-dashboard-livid.vercel.app](https://brand-analytics-dashboard-livid.vercel.app)

**Note:** The application is deployed on Vercel's hobby plan. If you encounter access issues, please contact me for permissions.

## ✨ Features

### 🎯 Core Functionality
- **Date Range Filtering** - Filter all data by selecting start and end dates
- **Metric Summary Tiles** - Display key metrics: Total Sales, Advertising Cost, Impressions, and Clicks
- **Interactive Line Charts** - Compare multiple metrics for specific shoes using Chart.js
- **Data Table** - Detailed shoe-wise performance data with grand totals
- **Responsive Design** - Optimized for both desktop and mobile devices

### 📈 Dashboard Components
1. **Date Range Picker** - Dynamic calendar for date selection
2. **Summary Tiles** - Four key metric cards with real-time updates
3. **Analytics Chart** - Multi-metric comparison with shoe-specific filtering
4. **Data Table** - Comprehensive data view with footer totals

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Chart.js** - Data visualization
- **CSS3** - Styling and responsive design
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM library
- **JWT** - Authentication

### Deployment
- **Vercel** - Frontend deployment
- **MongoDB Atlas** - Cloud database

## 📥 Installation & Local Setup

Follow these steps to run the project locally:

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn

### 1. Clone the Repository
bash
git clone https://github.com/Mayureshh43/brand-analytics-dashboard.git
cd brand-analytics-dashboard

2️⃣ Backend Setup
cd backend
npm install

Create .env inside backend:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

Start server:
npm run dev

3️⃣ Frontend Setup
cd ../frontend
npm install
Create .env inside frontend:
REACT_APP_API_URL=http://localhost:5000/api
Run frontend:
npm start

4️⃣ Database Setup
Ensure MongoDB is online (local/Atlas)
Collections auto-generate
Optional: Import sample data from /backend/data
🎮 Usage Guide
Authentication
Register or Login to access dashboard
Dashboard Navigation
Select date range → entire dashboard updates
Use dropdown to analyze specific shoes
Compare up to 2 metrics in charts
Review aggregated performance in data table

📁 Project Structure

brand-analytics-dashboard/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── data/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
├── README.md
└── package.json

🔧 API Endpoints
Authentication
| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/login    | User login        |
| POST   | /api/auth/register | User registration |

Analysis
| Method | Endpoint               | Description     |
| ------ | ---------------------- | --------------- |
| GET    | /api/analytics/summary | Summary metrics |
| GET    | /api/analytics/chart   | Chart data      |
| GET    | /api/analytics/table   | Table data      |
| GET    | /api/analytics/shoes   | Shoe list       |

🚀 Deployment
Frontend – Vercel
Backend – Render

👨‍💻 Author
Mayuresh Dalvi
GitHub: https://github.com/Mayureshh43
Repository: https://github.com/Mayureshh43/brand-analytics-dashboard

📝 License
Licensed under the MIT License.
