# 🚀 FitFlow - Checklist de Déploiement Production

## ✅ Avant Déploiement

### 1. Code & Configuration
- [x] ✅ Branding FitFlow complet (nom, logo, couleurs)
- [x] ✅ Pricing correct (199€/499€/999€)
- [x] ✅ Texte français partout (sauf code)
- [ ] ⚠️ Variables d'environnement production configurées
- [ ] ⚠️ API keys sécurisées (pas en dur dans code)
- [ ] ⚠️ CORS configuré pour domaine production
- [ ] ⚠️ Rate limiting API activé

### 2. Supabase Production
- [ ] Créer projet production (séparé de dev)
- [ ] Exécuter toutes les migrations SQL
- [ ] Configurer RLS (Row Level Security)
- [ ] Activer réplication en temps réel
- [ ] Backup automatique activé
- [ ] Storage bucket créé (si images)
- [ ] Variables env copiées

### 3. Intégrations Externes
- [ ] n8n workflows créés et testés
- [ ] Apify API token configuré
- [ ] Gemini AI API key active
- [ ] Go HighLevel connecté et testé
- [ ] Stripe account activé (mode live)
- [ ] Webhooks configurés partout

---

## 🌐 Déploiement Vercel

### Étape 1: Préparer le Repo
```bash
# Créer repo GitHub
git init
git add .
git commit -m "Initial FitFlow deployment"
git branch -M main
git remote add origin https://github.com/votre-compte/fitflow.git
git push -u origin main
```

### Étape 2: Configurer Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Import Git Repository
3. Sélectionner repo "fitflow"
4. Framework: Next.js (auto-détecté)
5. Root Directory: ./
6. Build Command: `npm run build`
7. Output Directory: .next

### Étape 3: Variables d'Environnement Vercel

**Dans Settings → Environment Variables, ajouter:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# n8n
N8N_WEBHOOK_SECRET=votre-secret-fort

# Apify
APIFY_API_TOKEN=xxx

# Gemini AI
GEMINI_API_KEY=xxx

# Go HighLevel
GHL_API_KEY=xxx
GHL_LOCATION_ID=xxx
GHL_INSTAGRAM_INTEGRATION_ID=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# App
NEXT_PUBLIC_APP_URL=https://fitflow.fr
```

### Étape 4: Déployer
```bash
# Vercel CLI (optionnel)
npm i -g vercel
vercel --prod

# Ou via dashboard
# Push to main → auto-deploy
```

---

## 🔒 Configuration Domaine & SSL

### Étape 1: Acheter Domaine
Recommandations:
- **fitflow.fr** (préféré)
- **fit-flow.fr** (backup)
- **getfitflow.com** (international)

Providers: OVH, Gandi, Namecheap

### Étape 2: Configurer DNS
Dans Vercel → Domains → Add Domain

**Records DNS à ajouter:**
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### Étape 3: SSL Auto
- Vercel gère SSL automatiquement
- Certificate Let's Encrypt
- Renouvellement auto
- ✅ HTTPS forcé

### Étape 4: Redirections
```javascript
// next.config.ts
async redirects() {
  return [
    {
      source: '/instacoach-pro',
      destination: '/',
      permanent: true, // 301 redirect
    },
    {
      source: '/clientwin',
      destination: '/',
      permanent: true,
    },
  ]
}
```

---

## 📊 Analytics & Monitoring

### Analytics (Choisir un)

**Option 1: Plausible (Recommandé - RGPD friendly)**
```html
<!-- app/layout.tsx -->
<script defer data-domain="fitflow.fr" src="https://plausible.io/js/script.js"></script>
```

**Option 2: Google Analytics 4**
```bash
npm install @next/third-parties
```

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### Error Tracking: Sentry
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com) (gratuit)
- [BetterUptime](https://betteruptime.com)
- Pinguer: https://fitflow.fr/api/health

---

## 🔐 Sécurité Production

### 1. Headers Sécurité
```javascript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### 2. Rate Limiting
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})
```

### 3. CORS
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  if (origin && !['https://fitflow.fr', 'https://www.fitflow.fr'].includes(origin)) {
    return new Response('Forbidden', { status: 403 })
  }
}
```

---

## 📧 Configuration Email

### SendGrid Setup (Transactionnels)
```bash
SENDGRID_API_KEY=SG.xxx
FROM_EMAIL=hello@fitflow.fr
```

**Templates à créer:**
1. Welcome email (après signup)
2. Lead notification (nouveau lead score 9+)
3. Daily digest (résumé quotidien)
4. Invoice (facture Stripe)
5. Password reset

### Domaine Email
Configurer SPF, DKIM, DMARC:
```
TXT @ "v=spf1 include:sendgrid.net ~all"
TXT s1._domainkey (value from SendGrid)
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:admin@fitflow.fr"
```

---

## 🎯 SEO & Performance

### 1. Metadata Global
```typescript
// app/layout.tsx (already done!)
export const metadata = {
  title: "FitFlow - Transformez vos commentaires Instagram en clients",
  description: "L'automatisation premium pour coachs fitness...",
  keywords: ["coach fitness", "instagram automation", "leads fitness"],
  openGraph: {
    title: "FitFlow",
    description: "...",
    url: "https://fitflow.fr",
    siteName: "FitFlow",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitFlow",
    description: "...",
    images: ["/twitter-image.png"],
  }
}
```

### 2. Sitemap
```typescript
// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://fitflow.fr',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://fitflow.fr/pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

### 3. robots.txt
```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: 'https://fitflow.fr/sitemap.xml',
  }
}
```

---

## 🧪 Tests Pré-Launch

### Test 1: Fonctionnel
- [ ] Signup → Créer compte
- [ ] Login → Se connecter
- [ ] Dashboard → Voir stats
- [ ] Leads → Créer lead test
- [ ] Clients → Ajouter client
- [ ] Templates → Créer template
- [ ] Campaigns → Lancer campagne
- [ ] Settings → Modifier profil
- [ ] Logout → Déconnexion

### Test 2: Workflow Complet
- [ ] Post Instagram → Commentaire
- [ ] n8n détecte → Score IA
- [ ] Lead apparaît dashboard
- [ ] DM suggéré copié
- [ ] Envoi (manuel ou auto)
- [ ] Status mis à jour

### Test 3: Paiement
- [ ] Stripe Checkout fonctionne
- [ ] Webhooks reçus
- [ ] Subscription activée
- [ ] Facture générée
- [ ] Email envoyé

### Test 4: Performance
```bash
# Lighthouse audit
npm run build
npm run start
# Ouvrir Chrome DevTools → Lighthouse

Targets:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100
```

### Test 5: Mobile
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] iPad
- [ ] Responsive breakpoints

---

## 📱 Post-Déploiement Immédiat

### Jour 1
1. ✅ Vérifier site accessible (fitflow.fr)
2. ✅ Tester signup complet
3. ✅ Vérifier emails transactionnels
4. ✅ Monitorer Sentry pour erreurs
5. ✅ Créer compte admin test

### Semaine 1
1. Monitorer analytics quotidiennement
2. Fixer bugs critiques en <24h
3. Collecter feedback premiers users
4. Itérer sur onboarding
5. Documenter problèmes fréquents

### Mois 1
1. A/B test landing page
2. Optimiser conversion signup
3. Améliorer templates DM
4. Ajouter features demandées
5. Construire case studies

---

## 🔄 Maintenance Continue

### Quotidien
- Vérifier uptime (UptimeRobot)
- Reviewer Sentry errors
- Répondre support (<2h)

### Hebdomadaire
- Analyser metrics (signups, churn)
- Backup manuel Supabase
- Update dependencies
- Review user feedback

### Mensuel
- Security audit
- Performance review
- Cost optimization (Vercel, Supabase)
- Feature roadmap update

---

## 💰 Coûts Mensuels Estimés

### Infrastructure
- **Vercel Pro:** $20/mois (ou gratuit si <100GB bandwidth)
- **Supabase Pro:** $25/mois (8GB DB, 250GB bandwidth)
- **n8n Cloud Pro:** $20/mois (50k executions)
- **Apify Starter:** $49/mois
- **Go HighLevel Agency:** $297/mois (VOUS L'AVEZ)
- **SendGrid:** $15/mois (40k emails)
- **Gemini AI:** Gratuit (60 req/min, puis pay-per-use)
- **Stripe:** 1.4% + 0.25€ par transaction

**Total:** ~$426/mois (+ Stripe fees)

### Break-Even
Avec Pro à 499€:
- 1 client = profitable ✅
- 2+ clients = croissance

---

## 📞 Support & Resources

### Docs
- **Features:** docs/FEATURES_SUMMARY.md
- **Integration:** docs/INTEGRATION_GUIDE.md
- **Sales:** docs/NOTEBOOKLM_PROMPT.md

### External
- **Vercel Docs:** vercel.com/docs
- **Supabase Docs:** supabase.com/docs
- **Next.js Docs:** nextjs.org/docs
- **n8n Docs:** docs.n8n.io

### Community
- **Discord:** discord.gg/fitflow
- **Email:** support@fitflow.fr

---

## ✅ Final Checklist

- [x] Code pushed to GitHub
- [ ] Vercel déployé
- [ ] Domaine configuré
- [ ] SSL actif
- [ ] Variables env prod
- [ ] Supabase production setup
- [ ] n8n workflows actifs
- [ ] Go HighLevel connecté
- [ ] Stripe webhooks testés
- [ ] Analytics installé
- [ ] Sentry configuré
- [ ] Emails transactionnels
- [ ] Tests end-to-end OK
- [ ] Mobile testé
- [ ] Performance 90+
- [ ] SEO optimisé
- [ ] Documentation à jour
- [ ] Support email configuré
- [ ] 🚀 **LAUNCH!**

---

**Dernière mise à jour:** 2026-02-01  
**Version:** 1.0.0  
**Status:** Prêt pour production
