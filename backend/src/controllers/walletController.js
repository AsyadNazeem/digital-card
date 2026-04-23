// backend/src/controllers/walletController.js

import { PKPass } from 'passkit-generator';
import fs from 'fs';
import path from 'path';
import { appleWalletConfig } from '../config/appleWallet.js';
import User from '../models/User.js';
import Company from '../models/Company.js';

// ─────────────────────────────────────────────
// Generate Apple Wallet Pass
// GET /api/wallet/apple/:userId
// ─────────────────────────────────────────────
export const generateApplePass = async (req, res) => {
    try {
        const { userId } = req.params;

        // ── Guard: certificates not set up yet ──
        if (!appleWalletConfig.isConfigured()) {
            return res.status(503).json({
                success: false,
                message: 'Apple Wallet not configured yet. Waiting for Apple Developer credentials.',
            });
        }

        // ── 1. Get user data from your database ──
        const user = await User.findByPk(userId, {
            include: [{ model: Company, as: 'company' }],
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // ── 2. Check certificate files exist ──
        const certsExist =
            fs.existsSync(appleWalletConfig.wwdrPath) &&
            fs.existsSync(appleWalletConfig.signerCertPath) &&
            fs.existsSync(appleWalletConfig.signerKeyPath);

        if (!certsExist) {
            return res.status(503).json({
                success: false,
                message: 'Certificate files missing. Please add them to the certs/ folder.',
            });
        }

        // ── 3. Build the pass ──
        const pass = await PKPass.from(
            {
                model: appleWalletConfig.templatePath,
                certificates: {
                    wwdr: fs.readFileSync(appleWalletConfig.wwdrPath),
                    signerCert: fs.readFileSync(appleWalletConfig.signerCertPath),
                    signerKey: fs.readFileSync(appleWalletConfig.signerKeyPath),
                    signerKeyPassphrase: appleWalletConfig.signerKeyPassphrase,
                },
            },
            {
                // Override static pass.json values with real data
                serialNumber: `user-${user.id}-${Date.now()}`,
                description: appleWalletConfig.description,
                organizationName: user.company?.name || appleWalletConfig.organizationName,
                passTypeIdentifier: appleWalletConfig.passTypeIdentifier,
                teamIdentifier: appleWalletConfig.teamIdentifier,
                foregroundColor: appleWalletConfig.foregroundColor,
                backgroundColor: appleWalletConfig.backgroundColor,
                labelColor: appleWalletConfig.labelColor,
            }
        );

        // ── 4. Fill in card fields with real user data ──

        // Primary: Full Name (largest text on the card)
        pass.primaryFields.push({
            key: 'name',
            label: 'NAME',
            value: user.full_name || user.name || 'No Name',
        });

        // Secondary: Job Title
        pass.secondaryFields.push({
            key: 'title',
            label: 'TITLE',
            value: user.job_title || user.title || '',
        });

        // Auxiliary: Company Name
        pass.auxiliaryFields.push({
            key: 'company',
            label: 'COMPANY',
            value: user.company?.name || '',
        });

        // Back of card fields (shown when user taps the (i) button)
        pass.backFields.push(
            {
                key: 'email',
                label: 'EMAIL',
                value: user.email || '',
                textAlignment: 'PKTextAlignmentLeft',
            },
            {
                key: 'phone',
                label: 'PHONE',
                value: user.phone || user.phone_number || '',
                textAlignment: 'PKTextAlignmentLeft',
            },
            {
                key: 'website',
                label: 'WEBSITE',
                value: user.website || '',
                textAlignment: 'PKTextAlignmentLeft',
            }
        );

        // ── 5. Optional: add profile photo as thumbnail ──
        // If your users have a profile photo, you can include it
        if (user.photo_url && user.photo_url.startsWith('/')) {
            const photoPath = path.join(process.cwd(), 'uploads', user.photo_url);
            if (fs.existsSync(photoPath)) {
                pass.addBuffer('thumbnail.png', fs.readFileSync(photoPath));
                pass.addBuffer('thumbnail@2x.png', fs.readFileSync(photoPath));
            }
        }

        // ── 6. Send .pkpass file to browser ──
        const buffer = pass.getAsBuffer();
        const filename = `${(user.full_name || user.name || 'card').replace(/\s+/g, '_')}.pkpass`;

        res.set({
            'Content-Type': 'application/vnd.apple.pkpass',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length,
        });

        return res.send(buffer);

    } catch (error) {
        console.error('Apple Wallet generation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate Apple Wallet pass',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

// ─────────────────────────────────────────────
// Check if Apple Wallet is available
// GET /api/wallet/status
// ─────────────────────────────────────────────
export const getWalletStatus = async (req, res) => {
    return res.json({
        success: true,
        appleWallet: {
            configured: appleWalletConfig.isConfigured(),
            message: appleWalletConfig.isConfigured()
                ? 'Apple Wallet is ready'
                : 'Apple Developer credentials not yet configured',
        },
    });
};
