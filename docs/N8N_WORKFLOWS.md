# 🔄 N8n Workflow Templates for FitFlow

## Overview

This document contains ready-to-use N8n workflow templates for integrating Apify, FitFlow, and Go High Level.

---

## 🎯 Workflow 1: Instagram Comment Scraper → FitFlow

**Purpose:** Scrape Instagram comments, score leads, and save to FitFlow.

### Workflow Steps:

1. **Trigger** (Schedule/Webhook)
2. **Apify - Instagram Comment Scraper**
3. **Split In Batches** (Process 10 at a time)
4. **Function - Transform Data**
5. **FitFlow - Score Lead**
6. **Filter - Hot Leads Only** (score >= 70)
7. **FitFlow - Save Lead**
8. **Go High Level - Create Contact**

### Configuration:

#### 1. Schedule Trigger
```json
{
  "mode": "everyMinute",
  "minute": 30,
  "timezone": "America/New_York"
}
```

#### 2. Apify - Instagram Comment Scraper
```json
{
  "actorId": "apify/instagram-comment-scraper",
  "input": {
    "postUrls": [
      "{{ $json.post_url }}"
    ],
    "resultsLimit": 100
  }
}
```

#### 3. Function - Transform Data
```javascript
// Extract relevant data from Apify output
const items = $input.all();
const leads = [];

for (const item of items) {
  const data = item.json;
  
  leads.push({
    instagram_username: data.ownerUsername,
    full_name: data.ownerFullName || null,
    bio: data.ownerBio || null,
    followers_count: data.followersCount || null,
    following_count: data.followsCount || null,
    profile_pic_url: data.ownerProfilePicUrl || null,
    is_verified: data.isVerified || false,
    recent_comments: [data.text],
    source: 'apify-comments'
  });
}

return leads;
```

#### 4. FitFlow - Score Lead (HTTP Request)
```json
{
  "method": "POST",
  "url": "https://your-fitflow-url.vercel.app/api/leads/score",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "instagram_username": "={{ $json.instagram_username }}",
    "full_name": "={{ $json.full_name }}",
    "bio": "={{ $json.bio }}",
    "followers_count": "={{ $json.followers_count }}",
    "following_count": "={{ $json.following_count }}",
    "recent_comments": "={{ $json.recent_comments }}"
  }
}
```

#### 5. Filter - Hot Leads Only
```json
{
  "conditions": {
    "number": [
      {
        "value1": "={{ $json.lead_score }}",
        "operation": "larger",
        "value2": 70
      }
    ]
  }
}
```

#### 6. FitFlow - Save Lead (HTTP Request)
```json
{
  "method": "POST",
  "url": "https://your-fitflow-url.vercel.app/api/webhooks/n8n/leads",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "leads": [
      {
        "instagram_username": "={{ $json.instagram_username }}",
        "full_name": "={{ $json.full_name }}",
        "bio": "={{ $json.bio }}",
        "followers_count": "={{ $json.followers_count }}",
        "following_count": "={{ $json.following_count }}",
        "profile_pic_url": "={{ $json.profile_pic_url }}",
        "is_verified": "={{ $json.is_verified }}",
        "lead_score": "={{ $json.lead_score }}",
        "tags": "={{ $json.tags }}",
        "status": "new",
        "source": "apify-comments"
      }
    ]
  }
}
```

#### 7. Go High Level - Create Contact (HTTP Request)
```json
{
  "method": "POST",
  "url": "https://rest.gohighlevel.com/v1/contacts/",
  "headers": {
    "Authorization": "Bearer YOUR_GHL_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "firstName": "={{ $json.full_name.split(' ')[0] }}",
    "lastName": "={{ $json.full_name.split(' ').slice(1).join(' ') }}",
    "email": "={{ $json.instagram_username }}@instagram.placeholder",
    "phone": "",
    "source": "Instagram",
    "tags": "={{ $json.tags.join(',') }}",
    "customField": {
      "instagram_username": "={{ $json.instagram_username }}",
      "lead_score": "={{ $json.lead_score }}",
      "fitflow_lead_id": "={{ $json.lead.id }}"
    }
  }
}
```

---

## 🎯 Workflow 2: Instagram Profile Scraper → FitFlow

**Purpose:** Scrape specific Instagram profiles and enrich lead data.

### Workflow Steps:

1. **Webhook Trigger** (Receive usernames to scrape)
2. **Apify - Instagram Profile Scraper**
3. **Function - Transform Data**
4. **FitFlow - Score Lead**
5. **FitFlow - Save Lead**
6. **Go High Level - Create/Update Contact**

### Configuration:

#### 2. Apify - Instagram Profile Scraper
```json
{
  "actorId": "apify/instagram-profile-scraper",
  "input": {
    "usernames": [
      "={{ $json.username }}"
    ],
    "resultsLimit": 1
  }
}
```

#### 3. Function - Transform Data
```javascript
const data = $input.first().json;

return {
  instagram_username: data.username,
  full_name: data.fullName,
  bio: data.biography,
  followers_count: data.followersCount,
  following_count: data.followsCount,
  posts_count: data.postsCount,
  profile_pic_url: data.profilePicUrl,
  is_verified: data.verified,
  is_business: data.businessCategoryName ? true : false,
  engagement_rate: calculateEngagement(data),
  source: 'apify-profile'
};

function calculateEngagement(profile) {
  if (!profile.postsCount || !profile.followersCount) return 0;
  
  // Estimate: avg 3% engagement is typical
  const avgLikes = profile.followersCount * 0.03;
  return (avgLikes / profile.followersCount) * 100;
}
```

---

## 🎯 Workflow 3: FitFlow → Go High Level DM Campaign

**Purpose:** Trigger DM campaigns in GHL when leads reach certain score.

### Workflow Steps:

1. **Webhook Trigger** (From FitFlow when lead is created)
2. **Filter - Score >= 70**
3. **Go High Level - Get Contact**
4. **Go High Level - Add to Campaign**
5. **FitFlow - Update Lead Status**

### Configuration:

#### 1. Webhook Trigger
- URL: `https://your-n8n-instance.com/webhook/fitflow-lead`
- Method: POST
- Expected payload:
```json
{
  "lead_id": "123",
  "instagram_username": "fitness_pro",
  "lead_score": 85,
  "tags": ["hot", "fitness-focused"]
}
```

#### 4. Go High Level - Add to Campaign
```json
{
  "method": "POST",
  "url": "https://rest.gohighlevel.com/v1/campaigns/{{ GHL_CAMPAIGN_ID }}/contacts",
  "headers": {
    "Authorization": "Bearer YOUR_GHL_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "contactId": "={{ $json.contact.id }}"
  }
}
```

#### 5. FitFlow - Update Lead Status
```json
{
  "method": "POST",
  "url": "https://your-fitflow-url.vercel.app/api/webhooks/n8n/update-lead",
  "body": {
    "lead_id": "={{ $json.lead_id }}",
    "updates": {
      "status": "in_campaign",
      "ghl_contact_id": "={{ $json.contact.id }}",
      "ghl_campaign_id": "{{ GHL_CAMPAIGN_ID }}"
    }
  }
}
```

---

## 🎯 Workflow 4: Go High Level → FitFlow Reply Monitor

**Purpose:** Monitor GHL for replies and update FitFlow.

### Workflow Steps:

1. **Go High Level Webhook** (On message received)
2. **Function - Parse GHL Data**
3. **FitFlow - Update Lead**

### Configuration:

#### 1. GHL Webhook Setup
In Go High Level:
- Go to Settings → Integrations → Webhooks
- Create new webhook for "Message Received"
- URL: `https://your-n8n-instance.com/webhook/ghl-reply`

#### 2. Function - Parse GHL Data
```javascript
const data = $input.first().json;

return {
  instagram_username: data.contact.customField.instagram_username,
  status: 'replied',
  reply_received: true,
  reply_text: data.message.body,
  reply_date: data.message.dateAdded
};
```

#### 3. FitFlow - Update Lead
```json
{
  "method": "POST",
  "url": "https://your-fitflow-url.vercel.app/api/webhooks/ghl/dm-status",
  "body": {
    "instagram_username": "={{ $json.instagram_username }}",
    "status": "replied",
    "message": "={{ $json.reply_text }}",
    "timestamp": "={{ $json.reply_date }}"
  }
}
```

---

## 🔑 Environment Variables Needed

### FitFlow
- `FITFLOW_URL`: Your FitFlow deployment URL
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key

### Apify
- `APIFY_API_TOKEN`: Your Apify API token

### Go High Level
- `GHL_API_KEY`: Your GHL API key
- `GHL_LOCATION_ID`: Your GHL location ID
- `GHL_CAMPAIGN_ID`: Your DM campaign ID

---

## 📝 Quick Setup Checklist

- [ ] Deploy FitFlow to Vercel
- [ ] Set up Supabase database
- [ ] Get Apify API token
- [ ] Get Go High Level API credentials
- [ ] Install N8n (self-hosted or cloud)
- [ ] Import workflows into N8n
- [ ] Configure all environment variables
- [ ] Test each workflow individually
- [ ] Set up GHL webhooks
- [ ] Monitor and optimize

---

## 🚀 Next Steps

1. **Start with Workflow 1** - Test Instagram comment scraping
2. **Add Workflow 2** - Enrich leads with profile data
3. **Connect Workflow 3** - Automate DM campaigns
4. **Set up Workflow 4** - Track replies automatically

---

## 💡 Pro Tips

- Start with small batches (10-20 leads) to test
- Monitor Apify usage to stay within limits
- Use N8n's error handling to retry failed requests
- Set up email notifications for workflow errors
- Review lead scores weekly and adjust thresholds
