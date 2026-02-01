# 🔗 Go High Level Integration Guide for FitFlow

## Overview

This guide shows you how to integrate Go High Level (GHL) with FitFlow for automated Instagram DM campaigns and lead management.

---

## 📋 Prerequisites

- ✅ Active Go High Level account
- ✅ FitFlow deployed on Vercel
- ✅ N8n instance running
- ✅ Apify account with API token

---

## 🔑 Step 1: Get Your GHL API Credentials

### 1.1 Get API Key

1. Log into Go High Level
2. Go to **Settings → Integrations → API**
3. Click "**Create API Key**"
4. Name it "FitFlow Integration"
5. Copy your API key (starts with `eyJ...`)
6. Save it securely - you'll need it for N8n

### 1.2 Get Location ID

1. In GHL, go to your dashboard
2. Look at the URL: `https://app.gohighlevel.com/location/{LOCATION_ID}/dashboard`
3. Copy the `LOCATION_ID` part
4. Save it for later

### 1.3 API Endpoints

GHL API Base URL: `https://rest.gohighlevel.com/v1/`

---

## 🎯 Step 2: Set Up Custom Fields in GHL

Create these custom fields for contacts:

1. Go to **Settings → Custom Fields**
2. Add these fields:

| Field Name | Type | API Key |
|------------|------|---------|
| Instagram Username | Text | `instagram_username` |
| Lead Score | Number | `lead_score` |
| FitFlow Lead ID | Text | `fitflow_lead_id` |
| Lead Source | Text | `lead_source` |
| Engagement Rate | Number | `engagement_rate` |
| Tags Array | Text | `lead_tags` |

---

## 💬 Step 3: Create Instagram DM Campaign in GHL

### 3.1 Create Campaign

1. Go to **Marketing → Campaigns**
2. Click "**Create Campaign**"
3. Name it "**Instagram Hot Leads DM**"
4. Select campaign type: **Manual**

### 3.2 Add Message Templates

Create 3-5 message templates for your DM sequence:

**Message 1 - Initial Reach Out:**
```
Hey {{firstName}}! 👋

I saw your recent activity on Instagram and noticed you're into fitness. I help people like you [achieve specific goal].

Quick question - what's your biggest challenge right now with [fitness goal]?

Would love to share some free tips that have helped others in similar situations! 💪
```

**Message 2 - Value Bomb (Wait 24h):**
```
Hey {{firstName}}!

Here's that tip I mentioned:

[Your best quick tip related to their challenge]

Have you tried this before? Let me know how it works for you! 🔥
```

**Message 3 - Soft CTA (Wait 48h):**
```
{{firstName}}, I've got something special for you...

I'm opening up a few spots for my [program name] and thought you might be interested based on what you shared.

Want to hop on a quick 15-min call to see if it's a fit? No pressure! 📞
```

### 3.3 Set Up Automation Rules

1. **Trigger:** When contact is added to campaign
2. **Wait:** 0 minutes
3. **Action:** Send Message 1
4. **Wait:** 24 hours
5. **Condition:** If not replied
6. **Action:** Send Message 2
7. **Wait:** 48 hours
8. **Condition:** If not replied
9. **Action:** Send Message 3

### 3.4 Get Campaign ID

1. Click on your campaign
2. Look at URL: `https://app.gohighlevel.com/location/{LOCATION}/campaigns/{CAMPAIGN_ID}`
3. Copy the `CAMPAIGN_ID`
4. Save it for N8n configuration

---

## 🔔 Step 4: Set Up GHL Webhooks

### 4.1 Create Webhook for Message Replies

1. Go to **Settings → Integrations → Webhooks**
2. Click "**Add Webhook**"
3. Configure:
   - **Name:** FitFlow Reply Monitor
   - **URL:** `https://your-n8n-instance.com/webhook/ghl-reply`
   - **Events:** Select "Message Received"
   - **Status:** Active
4. Save webhook

### 4.2 Create Webhook for DM Delivery Status

1. Add another webhook
2. Configure:
   - **Name:** FitFlow DM Status
   - **URL:** `https://your-n8n-instance.com/webhook/ghl-dm-status`
   - **Events:** Select "Message Sent", "Message Delivered", "Message Failed"
   - **Status:** Active
3. Save webhook

---

## 🔄 Step 5: Configure N8n Workflows

### 5.1 Update Environment Variables

In your N8n instance, add these variables:

```bash
GHL_API_KEY=your_ghl_api_key_here
GHL_LOCATION_ID=your_location_id_here
GHL_CAMPAIGN_ID=your_campaign_id_here
FITFLOW_URL=https://your-fitflow.vercel.app
```

### 5.2 Import Workflows

1. Open N8n
2. Go to **Workflows**
3. Click "**Import from File**"
4. Import the workflows from `docs/N8N_WORKFLOWS.md`
5. Update all URLs and credentials

### 5.3 Test Each Workflow

Test each workflow individually:

- ✅ Apify scraper works
- ✅ Lead scoring calculates correctly
- ✅ FitFlow receives and stores leads
- ✅ GHL creates contacts
- ✅ Contacts are added to campaign
- ✅ Webhooks update FitFlow

---

## 📊 Step 6: Set Up GHL Pipeline

### 6.1 Create Opportunity Pipeline

1. Go to **Opportunities**
2. Click "**Settings**" → "**Pipeline Settings**"
3. Create new pipeline: "**Instagram Leads**"
4. Add these stages:
   - 🆕 New Lead
   - 📞 DM Sent
   - 💬 In Conversation
   - 📅 Call Scheduled
   - 🎯 Qualified
   - 💰 Closed Won
   - ❌ Closed Lost

### 6.2 Create Automation for Pipeline Movement

**Rule: Move to "DM Sent" when added to campaign**
- Trigger: Contact added to campaign
- Action: Create opportunity in "DM Sent" stage

**Rule: Move to "In Conversation" when reply received**
- Trigger: Message received from contact
- Action: Move opportunity to "In Conversation"

---

## 🎨 Step 7: Create GHL Dashboard

### 7.1 Add Widgets

Create a custom dashboard with:

1. **Total Leads** - Count of contacts with tag "instagram"
2. **Hot Leads** - Count where lead_score >= 70
3. **DM Response Rate** - % of contacts who replied
4. **Opportunities by Stage** - Pipeline breakdown
5. **Revenue by Source** - Track Instagram ROI

### 7.2 Reports

Set up weekly reports to track:
- New Instagram leads added
- DM response rate
- Calls booked
- Revenue generated

---

## 🔒 Step 8: Security & Best Practices

### 8.1 API Security

- ✅ Never commit API keys to Git
- ✅ Use environment variables
- ✅ Rotate API keys every 90 days
- ✅ Monitor API usage

### 8.2 Compliance

- ✅ Add unsubscribe option in messages
- ✅ Respect Instagram DM limits (avoid spam)
- ✅ Store consent for marketing messages
- ✅ Follow GDPR/privacy regulations

### 8.3 GHL Rate Limits

- **API Calls:** 100 requests per 10 seconds per location
- **Messages:** Respect Instagram's limits (20-50 DMs/day to start)
- **Webhooks:** Max 5 retries with exponential backoff

---

## 🧪 Step 9: Testing the Integration

### 9.1 Test Workflow

1. **Scrape a test Instagram profile**
   - Use your own or a friend's account
   - Verify data appears in Apify

2. **Check FitFlow receives lead**
   - Go to FitFlow → Leads
   - Verify lead appears with correct score

3. **Verify GHL contact creation**
   - Check GHL → Contacts
   - Verify custom fields are populated

4. **Test campaign enrollment**
   - Manually add test contact to campaign
   - Verify they receive first DM

5. **Test reply webhook**
   - Reply to the test DM
   - Verify FitFlow updates lead status

### 9.2 Monitor Logs

Check these logs regularly:
- N8n execution logs
- FitFlow API logs (Vercel dashboard)
- GHL activity logs
- Apify task logs

---

## 📈 Step 10: Scaling & Optimization

### 10.1 Start Small

**Week 1-2:**
- Scrape 50 leads/day
- Send 10-20 DMs/day
- Monitor response rates

**Week 3-4:**
- Scale to 100 leads/day
- Send 30-50 DMs/day
- A/B test message templates

**Month 2+:**
- Scale to 200+ leads/day
- Optimize based on data
- Add AI personalization

### 10.2 A/B Testing

Test these variables:
- Message templates
- Timing (morning vs evening)
- Lead score thresholds
- Qualification criteria

### 10.3 Optimization Tips

- **Response Rate < 10%:** Improve message copy
- **Response Rate 10-20%:** Good, optimize targeting
- **Response Rate > 20%:** Excellent, scale up!

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Leads not appearing in FitFlow**
- ✅ Check N8n workflow execution logs
- ✅ Verify webhook URL is correct
- ✅ Check Supabase connection
- ✅ Review API error messages

**Issue: GHL contacts not being created**
- ✅ Verify GHL API key is valid
- ✅ Check location ID is correct
- ✅ Review GHL rate limits
- ✅ Check custom field mappings

**Issue: Webhooks not firing**
- ✅ Verify webhook URLs are accessible
- ✅ Check SSL certificates are valid
- ✅ Review GHL webhook settings
- ✅ Test with webhook.site first

**Issue: DMs not sending**
- ✅ Check Instagram account status
- ✅ Verify campaign is active
- ✅ Review message templates
- ✅ Check for spam flags

---

## 🎯 Success Metrics

Track these KPIs:

| Metric | Target |
|--------|--------|
| Lead Score Accuracy | 70%+ qualified |
| DM Response Rate | 15-25% |
| Call Booking Rate | 30% of responses |
| Close Rate | 20% of calls |
| Cost per Lead | < $5 |
| ROI | 5x+ |

---

## 📞 Support Resources

- **FitFlow Docs:** `/docs` folder
- **N8n Community:** https://community.n8n.io
- **GHL Support:** https://support.gohighlevel.com
- **Apify Docs:** https://docs.apify.com

---

## 🚀 What's Next?

1. ✅ Complete this setup guide
2. ✅ Test with 10 leads
3. ✅ Scale to 50 leads/day
4. ✅ Optimize messaging
5. ✅ Add AI personalization
6. ✅ Build email follow-up sequence
7. ✅ Create conversion tracking dashboard

---

**Need help?** Review the N8N_WORKFLOWS.md for detailed workflow configurations!
