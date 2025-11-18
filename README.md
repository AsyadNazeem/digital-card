✨ Digital Contact Card Platform

A modern full-stack platform to create & share digital business cards — with company management, contact profiles, admin panel, themes, Google login, OTP verification, & more.

<div align="center">
🚀 Live Demo

🔗 https://tapmy.name/
 (Replace later)

🛠 Built With
<img src="https://skillicons.dev/icons?i=vue,nodejs,mysql,js,express,html,css" /> </div>
📇 What Is This App?

The Digital Contact Card Platform allows users to create an online business card that includes:

Company details

Contact person details

Social profiles

Google Maps Location

Google Reviews

Custom themes

Shareable public URL:
👉 https://tapmy.name/94761234567

It also includes a powerful Admin Panel for managing users & their limit-increase requests.

📸 Screenshots

(You can upload screenshots later)

📁 /screenshots
   ├── dashboard.png
   ├── admin.png
   ├── contact-card.png

⭐ Key Features
👤 User Features

🔐 Email + Password login

🔐 Google OAuth login

✉ Email OTP Verification

📱 Mandatory phone number setup

🏢 Create & manage companies

👤 Create & manage contacts

🖼 Upload logo & profile picture

🌍 Add Google Maps location

⭐ Add Google Review URLs

🎨 Choose themes

🔗 Share public contact card

🆙 Request limits (companies/contacts)

🛡 Admin Features

🔐 Admin authentication (separate JWT)

📊 Statistics dashboard

🧑‍💼 View & manage all users

📨 Approve or reject limit requests

📂 View full request history

🧩 Notifications system

⚙ Admin Settings

🧑‍💻 Tech Stack
Frontend
Technology	Purpose
Vue 3 (Composition API)	Main UI Framework
Vue Router	Routing
Axios	API communication
TailwindCSS + Custom CSS	Styling
Google Identity SDK	Google OAuth
Backend
Technology	Purpose
Node.js + Express	REST API
Sequelize ORM	Database ORM
Multer	File uploads
JWT	Authentication
Nodemailer	Email OTP
Google Auth Library	OAuth tokens
Database

MySQL / MariaDB

Strict foreign keys

Auto-relations between User → Company → Contact

📁 Project Structure
root/
 ├── backend/
 │    ├── src/
 │    │    ├── models/
 │    │    ├── routes/
 │    │    ├── middleware/
 │    │    ├── controllers/
 │    │    └── config/
 │    ├── uploads/
 │    └── server.js
 └── frontend/
      ├── src/
      ├── public/
      └── vite.config.js

⚙ Environment Setup
🔧 Backend .env
PORT=4000
DB_HOST=127.0.0.1
DB_USER=db_user
DB_PASS=db_pass
DB_NAME=digital_card

JWT_SECRET=mySecret

GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback

BASE_URL=http://localhost:4000
FRONTEND_URL=http://localhost:5173

ADMIN_JWT_SECRET=myAdminSecret
MAIL_USER=myemail@gmail.com
MAIL_PASS=myapppassword

🎨 Frontend .env
VITE_GOOGLE_CLIENT_ID=xxxx
VITE_API_BASE_URL=http://localhost:4000

🏃‍♂️ Running the Project Locally
1️⃣ Clone Repo
git clone https://github.com/yourname/digital-card.git
cd digital-card

🖥 Backend Setup
cd backend
npm install
npm run dev


Runs on → http://localhost:4000

🌐 Frontend Setup
cd frontend
npm install
npm run dev


Runs on → http://localhost:5173

📦 Production Build
Build frontend
cd frontend
npm run build


Upload /dist folder to your hosting provider (cPanel / VPS / Subdomain).

Deploy backend (Node.js)

Upload backend to server

Configure Node App in cPanel

Install dependencies

Run server.js

Set .env

🛠 Database Setup

Create new MySQL database

Import your .sql file

Ensure foreign keys are valid

Update DB credentials in .env

❗ Common Issues & Fixes
⚠ Google OAuth: unauthorized_client

✔ Ensure redirect URI matches EXACTLY

http://localhost:4000/auth/google/callback

⚠ Themes disappear after adding contact

✔ Caused by broken foreign keys
✔ Verify DB constraints

⚠ Public card infinite loading

✔ Normalize mobile number (remove + automatically)

🌍 Hosting Guide

You can host on:

Hosting Type	Works?	Notes
Shared Hosting	✅	Backend via NodeJS App
VPS (DigitalOcean, AWS)	⭐ Best	Full control
Subdomain	✅	Recommended
Same server as another website	⚠ If ports allowed	Use reverse proxy
👨‍💻 Developer

Asyad Nazeem
💼 PHP / Laravel / Vue Developer
⚙ ERP / POS Developer
📍 Sri Lanka
📬 Add social links here

🎁 Support & Contributions

Feel free to:
⭐ Star the repo
🔀 Fork
📥 Submit a PR

📜 License

MIT License — free for personal & commercial use.

