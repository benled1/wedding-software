# Deployment Plan: Save the Date

## Overview
This document outlines the steps to deploy the Save the Date website and send the email campaign.

---

## Part 1: Website Deployment (GitHub Pages)

### Prerequisites
- [ ] GitHub account
- [ ] Git installed locally
- [ ] Repository pushed to GitHub

### Step 1: Prepare the Repository
1. Ensure all changes are committed
2. Verify the site works locally by opening `index.html` in a browser
3. Check that all images in `assets/images/` are properly linked

### Step 2: Push to GitHub
```bash
# If remote not already set up:
git remote add origin https://github.com/YOUR_USERNAME/e-invites.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for deployment

### Step 4: Verify Deployment
- Your site will be available at: `https://YOUR_USERNAME.github.io/e-invites/`
- Test on desktop and mobile devices
- Verify all images load correctly
- Test the countdown timer
- Test the "Add to Calendar" functionality

### Step 5: Custom Domain (Optional)
1. Purchase a domain (e.g., `teaandben.com`)
2. In repo root, create a file named `CNAME` containing:
   ```
   teaandben.com
   ```
3. Configure DNS at your domain registrar:
   - Add A records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Or add a CNAME record: `www` → `YOUR_USERNAME.github.io`
4. In GitHub Pages settings, enter your custom domain
5. Enable "Enforce HTTPS"

---

## Part 2: Email Campaign

### Choose an Email Service (Free Options)

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Mailchimp** | 500 contacts, 1,000 sends/month | Beginners, easy UI |
| **Brevo** | 300 emails/day | Higher volume |
| **SendGrid** | 100 emails/day | Developers |

### Step 1: Prepare the Email HTML
1. Open `email/save-the-date.html`
2. Update the CTA link (line 88):
   ```html
   <a href="https://YOUR_USERNAME.github.io/e-invites/"
   ```
3. (Optional) Add a preview image - host on GitHub or Cloudinary

### Step 2: Set Up Email Service (Mailchimp Example)
1. Create account at [mailchimp.com](https://mailchimp.com)
2. Create an **Audience** (your guest list)
3. Import contacts via CSV with columns:
   - Email Address
   - First Name
   - Last Name

### Step 3: Create the Campaign
1. Click **Create** → **Email** → **Regular**
2. Select your audience
3. Set subject line: `Save the Date: Tea & Ben - August 29, 2026`
4. Set preview text: `We're getting married!`
5. In the Design step, choose **Code your own** → **Paste in code**
6. Paste the contents of `email/save-the-date.html`
7. Preview and test

### Step 4: Test Before Sending
- [ ] Send test email to yourself
- [ ] Check rendering in Gmail (web & mobile)
- [ ] Check rendering in Outlook
- [ ] Check rendering in Apple Mail
- [ ] Verify all links work
- [ ] Check spam folder (make sure it doesn't land there)

### Step 5: Send
1. Schedule or send immediately
2. Monitor open rates and clicks in the email service dashboard

---

## Checklist Summary

### Before Launch
- [ ] All photos added to `assets/images/`
- [ ] Couple names correct ("Tea & Ben")
- [ ] Date correct (August 29, 2026)
- [ ] Location correct (Langely, British Columbia)
- [ ] Calendar event details correct in `js/main.js`

### Website Deployment
- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Site accessible at public URL
- [ ] Tested on mobile devices
- [ ] (Optional) Custom domain configured

### Email Campaign
- [ ] Email HTML updated with correct website URL
- [ ] Guest list imported to email service
- [ ] Test emails sent and verified
- [ ] Campaign sent/scheduled

---

## Troubleshooting

### GitHub Pages not working?
- Check that the repository is public (or you have GitHub Pro for private repos)
- Verify the correct branch is selected in Pages settings
- Check the Actions tab for deployment errors

### Images not loading in email?
- Email clients block external images by default
- Use absolute URLs (not relative paths)
- Host images on a reliable CDN (GitHub, Cloudinary, Imgur)

### Email landing in spam?
- Avoid spam trigger words in subject line
- Use a reputable email service
- Include an unsubscribe link (email services add this automatically)
- Don't use all caps or excessive punctuation

---

## Timeline Suggestion

| Task | When |
|------|------|
| Finalize website content | Week 1 |
| Deploy to GitHub Pages | Week 1 |
| Set up email service & import contacts | Week 1-2 |
| Send test emails | Week 2 |
| Send save the dates | 6-8 months before wedding |

---

## Resources
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Mailchimp Getting Started](https://mailchimp.com/help/getting-started-with-mailchimp/)
- [Email on Acid - Email Testing](https://www.emailonacid.com/) (paid, for thorough testing)
