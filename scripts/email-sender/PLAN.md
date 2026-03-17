# Email Sender Script - Implementation Plan

## Overview
A Python script to send the Save the Date HTML emails to ~100 guests using Gmail SMTP. No external dependencies required (uses Python standard library only).

---

## Files to Create

```
scripts/email-sender/
├── PLAN.md              # This file
├── send_emails.py       # Main script
├── guests.csv           # Guest list (name, email)
├── .env.example         # Example env file (committed to repo)
├── .env                  # Actual credentials (gitignored)
└── sent_log.txt         # Log of sent emails (gitignored)
```

---

## Guest List Format (guests.csv)

```csv
name,email
John Smith,john@example.com
Jane Doe,jane@example.com
```

---

## Configuration (.env)

```bash
# Gmail SMTP settings
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Email content
SUBJECT=Save the Date: Tea & Ben - August 29, 2026
WEBSITE_URL=https://your-username.github.io/e-invites/
```

The script will parse the `.env` file directly (no external dependencies needed).

---

## Script Features

### 1. Core Functionality
- Read guest list from CSV
- Read HTML email template
- Personalize each email (optional: insert guest name)
- Send via Gmail SMTP with TLS

### 2. Safety Features
- **Test mode**: Send only to yourself first (`--test`)
- **Dry run**: Preview what would be sent without sending (`--dry-run`)
- **Rate limiting**: 3-second delay between emails to avoid spam flags
- **Sent log**: Track who received emails to avoid duplicates
- **Resume support**: Skip already-sent emails if script is interrupted

### 3. Error Handling
- Validate email addresses before sending
- Catch and log failed sends
- Continue to next recipient on failure

---

## Gmail Setup Required

### Step 1: Enable 2-Factor Authentication
1. Go to Google Account → Security
2. Enable 2-Step Verification

### Step 2: Create App Password
1. Go to Google Account → Security → 2-Step Verification
2. Scroll to "App passwords"
3. Generate a new app password for "Mail"
4. Copy the 16-character password (use this in config.py)

---

## Usage

```bash
# First, set up config
cp .env.example .env
# Edit .env with your credentials

# Add guests to CSV
# Edit guests.csv

# Test with your own email
python send_emails.py --test

# Dry run to see what would be sent
python send_emails.py --dry-run

# Send to all guests
python send_emails.py

# Send to specific guest (by email)
python send_emails.py --to john@example.com
```

---

## Email Personalization

The script will replace these placeholders in the HTML:
- `{{NAME}}` → Guest's first name (from CSV)
- `{{WEBSITE_URL}}` → Link to the save-the-date page

---

## Rate Limiting Strategy

To avoid Gmail spam detection:
- 3-second delay between emails
- Maximum 50 emails per batch (then 5-minute pause)
- For 100 guests: ~10 minutes total send time

---

## Files to Add to .gitignore

```
scripts/email-sender/.env
scripts/email-sender/sent_log.txt
```

---

## Implementation Order

1. Create `.env.example` with placeholder values
2. Create `guests.csv` with header row
3. Create `send_emails.py` with:
   - `.env` file parser (no external dependencies)
   - Argument parsing (--test, --dry-run, --to)
   - CSV reading
   - HTML template loading
   - SMTP connection handling
   - Send loop with rate limiting
   - Logging
4. Update `.gitignore` to exclude sensitive files
5. Test with --test flag first
