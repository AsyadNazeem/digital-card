import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const appleWalletConfig99 = {
    // ─── Replace these when client gives you Apple Developer access ───
    passTypeIdentifier: process.env.PASS_TYPE_ID || 'pass.com.REPLACE_ME.card',
    teamIdentifier: process.env.APPLE_TEAM_ID || 'REPLACE_TEAM_ID',

    // ─── Certificate paths ────────────────────────────────────────────
    wwdrPath: path.join(__dirname, '../../../certs/wwdr.pem'),
    signerCertPath: path.join(__dirname, '../../../certs/signerCert.pem'),
    signerKeyPath: path.join(__dirname, '../../../certs/signerKey.pem'),
    signerKeyPassphrase: process.env.CERT_PASSWORD || '',

    // ─── Pass template folder ─────────────────────────────────────────
    templatePath: path.join(__dirname, '../../../pass-template.pass'),

    // ─── Pass appearance ──────────────────────────────────────────────
    organizationName: process.env.ORG_NAME || 'Public Card',
    description: 'Digital Business Card',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 0, 0)',
    labelColor: 'rgb(200, 200, 200)',

    // ─── Check if certificates are ready ─────────────────────────────
    isConfigured() {
        return (
            this.teamIdentifier !== 'REPLACE_TEAM_ID' &&
            this.passTypeIdentifier !== 'pass.com.REPLACE_ME.card'
        );
    },
};
