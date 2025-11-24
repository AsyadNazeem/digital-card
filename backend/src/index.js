import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

// MODELS
import User from "./models/User.js";
import Company from "./models/Company.js";
import Contact from "./models/Contact.js";
import Request from "./models/Request.js";
import Admin from "./models/Admin.js";
import Theme from "./models/Theme.js";
import AdminLog from "./models/AdminLog.js";
import UserPermission from "./models/UserPermission.js"; // CHANGE THIS (was RolePermission)
import PermissionChange from "./models/PermissionChange.js"; // ADD THIS

// ROUTES
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import publicRoutes from "./routes/public.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminRoutes from "./routes/admin.js";
import adminLogRoutes from "./routes/adminLogs.js"; // ✅ Add this
import otpRoutes from "./routes/otp.js";
import settingsRoutes from "./routes/settings.js";
import themeRoutes from "./routes/theme.js";
import adminThemeRoutes from "./routes/adminTheme.js";
import adminPermissionRoutes from './routes/adminPermissionRoutes.js';

// PATH
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Fix dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOAD ALL MODELS FOR ASSOCIATIONS
const models = { User, Company, Contact, Request, Admin, Theme, AdminLog, UserPermission, PermissionChange };

// RUN ALL ASSOCIATIONS
Object.values(models).forEach((model) => {
    if (model.associate) model.associate(models);
});

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static storage for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/:mobile", async (req, res, next) => {
    const mobile = req.params.mobile;
    const userAgent = req.headers['user-agent'] || '';

    if (mobile.startsWith('api')) {
        return next();
    }

    if (!/^[0-9]{7,15}$/.test(mobile)) {
        return next();
    }

    try {
        let formattedMobile = "+" + mobile.replace(/[^0-9]/g, '');

        const contact = await Contact.findOne({
            where: { mobile: formattedMobile, status: "active" }
        });

        if (!contact) {
            console.log('❌ Contact not found');
            return res.status(404).send('Contact not found');
        }

        const company = await Company.findByPk(contact.companyId);

        if (!company) {
            console.log('❌ Company not found');
            return res.status(404).send('Company not found');
        }

        const cardUrl = `${process.env.FRONTEND_URL}/${mobile}`;
        const fullName = `${contact.firstName} ${contact.lastName}`;
        const designation = contact.designation || '';
        const companyName = company.companyName || '';
        const description = `You can view my Digital Business Card here: ${cardUrl}`;
        const imageUrl = `https://tapmy.name${company.logo}`;

        console.log('✅ Serving meta tags (crawler only)');

        res.setHeader('Cache-Control', 'public, max-age=3600');

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullName}</title>
    
    <!-- Primary Meta Tags -->
    <meta name="title" content="${fullName}">
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="profile">
    <meta property="og:url" content="${cardUrl}">
    <meta property="og:title" content="${fullName}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="TapMyName">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${cardUrl}">
    <meta name="twitter:title" content="${fullName}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- WhatsApp Specific -->
    <meta property="og:image:alt" content="${fullName} - Digital Business Card">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .card {
            max-width: 500px;
            padding: 40px;
        }
        h1 { 
            font-size: 32px; 
            margin: 10px 0; 
        }
        .subtitle {
            font-size: 18px;
            opacity: 0.9;
            margin: 5px 0;
        }
        .btn {
            display: inline-block;
            margin-top: 30px;
            padding: 15px 40px;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>${fullName}</h1>
        ${designation ? `<p class="subtitle">${designation}</p>` : ''}
        ${companyName ? `<p class="subtitle">${companyName}</p>` : ''}
        <a href="${cardUrl}" class="btn">View Digital Business Card</a>
    </div>
</body>
</html>`;

        return res.send(html);
    } catch (err) {
        console.error('❌ Error:', err);
        return res.status(500).send('Error loading card');
    }
});

// ============================================================================
// END OF META PROXY
// ============================================================================

// API ROUTES - These come AFTER the meta proxy
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin/themes", adminThemeRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminLogRoutes); // ✅ Add this
app.use('/api/admin/permissions', adminPermissionRoutes); // ADD THIS
app.use("/api/otp", otpRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/themes", themeRoutes);

// HOME
app.get("/", (req, res) => {
    res.send("🚀 Express backend is running!");
});

// START SERVER
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");

        await sequelize.sync();
        console.log("✅ Tables synchronized");

        app.listen(process.env.PORT || 4000, () => {
            console.log(`🚀 Server running on port ${process.env.PORT || 4000}`);
        });

    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
}

startServer();
