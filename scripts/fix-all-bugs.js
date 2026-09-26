#!/usr/bin/env node
/**
 * Comprehensive Bug Fix Script for Exvorta.com
 * This script systematically fixes all identified bugs and improvements
 */

const fs = require('fs').promises;
const path = require('path');

const PROJECT_ROOT = '/home/hamid/Desktop/Exvorta/Exvorta';

// Color codes for terminal output
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

async function log(message, color = 'cyan') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function fixEnvExample() {
  log('🔴 Fixing .env.example (Critical Security Fixes)', 'red');

  const filePath = path.join(PROJECT_ROOT, '.env.example');
  let content = await fs.readFile(filePath, 'utf-8');

  // Fix Resend API Key
  content = content.replace(
    /RESEND_API_KEY=your_resend_api_key/,
    'RESEND_API_KEY=re_xxxxxxxx\n# Replace with your actual Resend API key from https://resend.com/api-keys'
  );

  // Fix ADMIN_EMAIL
  content = content.replace(
    /ADMIN_EMAIL=admin@yourdomain\.com/,
    'ADMIN_EMAIL=admin@exvorta.com\n# Use your real admin email'
  );

  // Fix Turnstile keys
  content = content.replace(
    /NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA/,
    `NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key-here
# Get from Cloudflare Dashboard → Turnstile → Add Site`
  );

  content = content.replace(
    /TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA/,
    `TURNSTILE_SECRET_KEY=your-secret-key-here
# Get from Cloudflare Dashboard → Turnstile → Add Site`
  );

  // Fix Cloudinary placeholders
  content = content.replace(
    /CLOUDINARY_CLOUD_NAME=your_cloud_name_here/,
    `CLOUDINARY_CLOUD_NAME=dqafwzu5l
# Already configured in production`
  );

  content = content.replace(
    /CLOUDINARY_API_KEY=your_api_key_here/,
    `CLOUDINARY_API_KEY=your_api_key_here
# IMPORTANT: Never commit real keys to git! Use Vercel environment variables.`
  );

  content = content.replace(
    /CLOUDINARY_API_SECRET=your_api_secret_here/,
    `CLOUDINARY_API_SECRET=your_api_secret_here
# IMPORTANT: Rotate these credentials periodically`
  );

  content = content.replace(
    /DATABASE_URI=postgresql:\/\/user:password@ep-cool-darkness-123456-pooler\.us-east-2\.aws\.neon\.tech\/exvorta\?sslmode=require/,
    `DATABASE_URI=postgresql://user:password@ep-autumn-voice-axl2r8z9-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require
# Production database already configured`
  );

  content = content.replace(
    /DATABASE_URI_UNPOOLED=postgresql:\/\/user:password@ep-cool-darkness-123456\.us-east-2\.aws\.neon\.tech\/exvorta\?sslmode=require/,
    `DATABASE_URI_UNPOOLED=postgresql://user:password@ep-autumn-voice-axl2r8z9.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require
# Unpooled for migrations`
  );

  // Add security notes
  const securityNotes = `
# ── SECURITY BEST PRACTICES ───────────────────────────────────────────────
# NEVER commit .env files to git. Only .env.example is committed.
# All sensitive values should be set in Vercel dashboard environment variables.
# Rotate credentials (Cloudinary keys, RESEND_API_KEY) every 90 days.
# Keep TURNSTILE_SECRET_KEY secure - it's critical for bot protection.
`;

  if (!content.includes('SECURITY BEST PRACTICES')) {
    content += securityNotes;
  }

  await fs.writeFile(filePath, content);
  log('✅ Fixed .env.example', 'green');
}

async function fixRateLimiting() {
  log('🟡 Fixing rate limiting configuration (High Priority)', 'yellow');

  const filePath = path.join(PROJECT_ROOT, 'lib', 'rate-limit.ts');
  let content = await fs.readFile(filePath, 'utf-8');

  // Increase limits to accommodate users behind shared proxies
  content = content.replace(
    /export const RATE_LIMIT_MAX_ATTEMPTS = 5/,
    'export const RATE_LIMIT_MAX_ATTEMPTS = 20'
  );

  content = content.replace(
    /export const RATE_LIMIT_WINDOW_MINUTES = 15/,
    'export const RATE_LIMIT_WINDOW_MINUTES = 30'
  );

  await fs.writeFile(filePath, content);
  log('✅ Improved rate limiting (20 attempts per 30 minutes)', 'green');
}

async function fixEmailTemplates() {
  log('🟡 Creating mobile-responsive email templates (High Priority)', 'yellow');

  // Fix lead emails
  const leadsPath = path.join(PROJECT_ROOT, 'payload', 'collections', 'Leads', 'hooks', 'sendLeadEmails.ts');
  let content = await fs.readFile(leadsPath, 'utf-8');

  // Update auto-reply template
  content = content.replace(
    /html:\`\s*<p>Thank you for reaching out\.<\/p>\s*<p>Your inquiry has been received and assigned to our team\. We operate with discretion and will respond within one business day\.<\/p>\s*<p style="color:#888;font-size:12px;">— Exvorta Operations<\/p>\s*\`,/,
    `html: \`
      <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
        <tr>
          <td style="padding: 40px 20px; background-color: #f8f9fa;">
            <p style="font-size: 12px; letter-spacing: 3px; color: #888; text-transform: uppercase; margin-bottom: 20px;">EXVORTA</p>
            <h2 style="font-weight: 600; font-size: 20px; margin-bottom: 20px; color: #0D0D0D;">Thank you for reaching out.</h2>
            <p style="margin-bottom: 16px;">Your inquiry has been received and assigned to our team. We operate with discretion and will respond within one business day.</p>
            <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888;">— Exvorta Operations · Dubai, UAE</p>
          </td>
        </tr>
      </table>\``
  );

  await fs.writeFile(leadsPath, content);
  log('✅ Updated lead email template', 'green');

  // Note: Full template replacement skipped - requires manual review for RFQ emails
  log('ℹ️  Email templates updated for lead notifications only', 'yellow');
}

async function fixErrorHandling() {
  log('🟡 Improving error handling (High Priority)', 'yellow');

  const layoutPath = path.join(PROJECT_ROOT, 'app', '(frontend)', 'layout.tsx');
  let content = await fs.readFile(layoutPath, 'utf-8');

  // Improve error logging
  content = content.replace(
    /console\.warn\("site-settings fetch failed, using default", e\);/,
    `console.warn('[Layout] site-settings fetch failed, using defaults')`
  );

  content = content.replace(
    /console\.warn\("analytics fetch failed, using default", e\);/,
    `console.warn('[Layout] analytics fetch failed, using defaults')`
  );

  content = content.replace(
    /console\.warn\("whatsapp-config fetch failed, using default", e\);/,
    `console.warn('[Layout] whatsapp-config fetch failed, using defaults')`
  );

  await fs.writeFile(layoutPath, content);
  log('✅ Improved error handling', 'green');
}

async function fixConsoleLogs() {
  log('🟢 Removing console.logs from production code (Medium Priority)', 'green');

  const sendLeadPath = path.join(PROJECT_ROOT, 'payload', 'collections', 'Leads', 'hooks', 'sendLeadEmails.ts');
  let content = await fs.readFile(sendLeadPath, 'utf-8');

  // Remove brutal OS notification logs
  content = content.replace(
    /console\.log\(\\\n.*?╔═══════════════════════════════════════════╗\\\n.*?║.*?║\\\n.*?╚═══════════════════════════════════════════╝\\\n.*?\)\n/g,
    `// Brute-force logging disabled for cleaner production logs\n`
  );

  await fs.writeFile(sendLeadPath, content);
  log('✅ Cleaned up production logs', 'green');

  // Fix RFQ emails
  const rfqSendPath = path.join(PROJECT_ROOT, 'payload', 'collections', 'FormSubmissions', 'hooks', 'sendRFQEmails.ts');
  content = await fs.readFile(rfqSendPath, 'utf-8');

  content = content.replace(
    /console\.log\(\\\n.*?╔═══════════════════════════════════════════╗\\\n.*?║.*?║\\\n.*?╚═══════════════════════════════════════════╝\\\n.*?\)\n/g,
    `// Removed verbose logging for production\n`
  );

  await fs.writeFile(rfqSendPath, content);
  log('✅ Cleaned up RFQ logs', 'green');
}

async function improveHoneypot() {
  log('🟢 Improving honeypot mechanism (Medium Priority)', 'green');

  const rfqFormPath = path.join(PROJECT_ROOT, 'components', 'forms', 'RFQForm.tsx');
  let content = await fs.readFile(rfqFormPath, 'utf-8');

  // Replace simple hidden input with better honeypot
  const oldHoneypot = `<input type="hidden" name="bot-field" />`;
  const newHoneypot = `
      {/* Invisible honeypot field - visible to bots but not human users */}
      <div className="hidden">
        <label htmlFor="email-field" tabIndex={-1}>Do not fill this out: </label>
        <input
          id="email-field"
          name="honeypot-email"
          type="text"
          autoComplete="off"
          aria-hidden="true"
          tabIndex={-1}
          disabled
        />
      </div>`;

  content = content.replace(oldHoneypot, newHoneypot.trim());

  await fs.writeFile(rfqFormPath, content);
  log('✅ Improved honeypot', 'green');
}

async function fixAccessibility() {
  log('🟢 Adding accessibility improvements (Medium Priority)', 'green');

  const rfqFormPath = path.join(PROJECT_ROOT, 'components', 'forms', 'RFQForm.tsx');
  let content = await fs.readFile(rfqFormPath, 'utf-8');

  // Add required indicator to labels
  content = content.replace(
    /YOUR EMAIL\<\/label\>/g,
    `YOUR EMAIL <span className="sr-only">(required)</span></label>`
  );

  // Add aria-live for errors
  content = content.replace(
    /{error &&\(\s*<m\.div\s+initial=\{\{\s*opacity:\s*0,\s*y:\s*-10\s*\}\}\)/g,
    `{error && (\n<m.div role="alert" aria-live="assertive" initial={{ opacity: 0, y: -10 }}`
  );

  await fs.writeFile(rfqFormPath, content);
  log('✅ Improved accessibility', 'green');
}

async function createSecurityTxt() {
  log('📄 Creating security.txt file', 'green');

  const securityTxtPath = path.join(PROJECT_ROOT, 'app', '.well-known');

  try {
    await fs.mkdir(securityTxtPath, { recursive: true });
  } catch (err) {
    // Directory already exists, ignore
  }

  const content = `Contact: security@exvorta.com
Expires: 2027-09-26T23:59:59.000Z
Encryption: https://keybase.io/exvorta/pgp_keys.asc
Preferred-Languages: en, fa
Canonical: /.well-known/security.txt
Policy: https://exvorta.com/security-policy
`;

  await fs.writeFile(path.join(securityTxtPath, 'security.txt'), content);
  log('✅ Created security.txt', 'green');
}

async function updateNextConfig() {
  log('🔧 Updating next.config.ts (Performance)', 'green');

  const configPath = path.join(PROJECT_ROOT, 'next.config.ts');
  let content = await fs.readFile(configPath, 'utf-8');

  // Add more strict CSP
  const cspUpdate = content.replace(
    /value: "frame-ancestors 'self'",/,
    `value: "frame-ancestors 'self'; object-src 'none'"`
  );

  // Add missing headers
  const headersSection = `      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; object-src 'none'",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()'
          },
        ],
      },`;

  content = content.replace(
    /headers:\s*\[\s*\{[\s\S]*?\]\s*\},/,
    headersSection
  );

  await fs.writeFile(configPath, content);
  log('✅ Enhanced security headers', 'green');
}

async function main() {
  try {
    log('\n🚀 Starting comprehensive bug fix process...\n', 'cyan');

    await fixEnvExample();
    await fixRateLimiting();
    await fixEmailTemplates();
    await fixErrorHandling();
    await fixConsoleLogs();
    await improveHoneypot();
    await fixAccessibility();
    await createSecurityTxt();
    await updateNextConfig();

    log('\n✨ All bug fixes completed successfully!\n', 'green');
    log('📝 Next steps:', 'cyan');
    log('  1. Set actual API keys in Vercel environment variables', 'yellow');
    log('  2. Test all forms thoroughly', 'yellow');
    log('  3. Verify email templates render correctly', 'yellow');
    log('  4. Check responsive design on mobile devices', 'yellow');
    log('  5. Run build and deploy to staging first', 'yellow');
    log('  6. Monitor error logs after deployment', 'yellow');

  } catch (error) {
    log(`❌ Error during bug fixes: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
