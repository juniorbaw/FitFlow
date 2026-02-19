# ✅ CHECKLIST TESTS COMPLETS FITFLOW

## 🔐 AUTHENTIFICATION (Priorité P0)

### Test 1: Login Email
- [ ] Aller sur /login
- [ ] Entrer email + password
- [ ] Cliquer "Se connecter"
- [ ] **Attendu**: Redirect vers /dashboard
- [ ] **Attendu**: Profil coach créé automatiquement dans Supabase

### Test 2: Signup Email
- [ ] Aller sur /signup
- [ ] Remplir formulaire (nom, email, password)
- [ ] Cliquer "Créer un compte"
- [ ] **Attendu**: Redirect vers /dashboard (ou email confirmation si activée)
- [ ] **Attendu**: Profil coach créé

### Test 3: Login Facebook/Instagram OAuth
**PRÉREQUIS**: Whitelister URLs dans Facebook App
- [ ] Aller sur /login
- [ ] Cliquer "Se connecter avec Facebook"
- [ ] Autoriser l'app
- [ ] **Attendu**: Redirect vers /dashboard
- [ ] **Attendu**: instagram_username dans profil coach

---

## 🤖 FEATURES IA (Priorité P0)

### Test 4: Content AI (Analyse texte)
- [ ] Dashboard → Onglet "Content AI"
- [ ] Coller un texte court: "bonjour"
- [ ] Cliquer "Analyser"
- [ ] **Attendu**: Score < 40, suggestions pertinentes
- [ ] Coller un vrai post optimisé
- [ ] **Attendu**: Score > 70

### Test 5: Video Analyzer
- [ ] Dashboard → Onglet "Video Analyzer"
- [ ] Coller URL Reel Instagram
- [ ] Cliquer "Analyser"
- [ ] **Attendu**: Score viral, hook analysis, suggestions

### Test 6: Competitor Spy
- [ ] Dashboard → Onglet "Competitor Spy"
- [ ] Entrer username concurrent (ex: @cristiano)
- [ ] Cliquer "Analyser"
- [ ] **Attendu**: Followers, engagement, hashtags, opportunités

### Test 7: Smart Calendar
- [ ] Dashboard → Onglet "Smart Calendar"
- [ ] Cliquer "Analyser mon audience"
- [ ] **Attendu**: Meilleurs horaires affichés
- [ ] Écrire un post
- [ ] Cliquer "Planifier"
- [ ] **Attendu**: Post ajouté au calendrier

---

## 📊 DASHBOARD (Priorité P1)

### Test 8: StatCards Animées
- [ ] Aller sur /dashboard
- [ ] **Attendu**: Cards slide-in progressivement (0 → 0.4s)
- [ ] **Attendu**: Hover avec glow orange
- [ ] **Attendu**: Icons rotate animation

### Test 9: Tabs Navigation
- [ ] Cliquer sur différents onglets
- [ ] **Attendu**: Sliding indicator orange animé
- [ ] **Attendu**: Transition smooth (spring animation)

### Test 10: Charts
- [ ] Vérifier Bar Chart (Leads par jour)
- [ ] **Attendu**: Gradients orange/blue
- [ ] **Attendu**: Hover tooltip
- [ ] Vérifier Pie Chart (Répartition)
- [ ] **Attendu**: 3 catégories (VIP, Standard, Low)

### Test 11: Leads Table
- [ ] Hover sur une ligne lead
- [ ] **Attendu**: Scale + glow orange
- [ ] **Attendu**: Stagger animation

---

## 🎨 DESIGN (Priorité P1)

### Test 12: Polices Harmonisées
- [ ] Vérifier toutes les pages
- [ ] **Attendu**: DM Sans partout
- [ ] **Attendu**: Pas de Arial, Times, etc.

### Test 13: Textes Visibles
- [ ] Vérifier inputs (login, signup, dashboard)
- [ ] **Attendu**: Texte blanc (#fafafa), PAS noir
- [ ] **Attendu**: Placeholders gris (#666) visibles

### Test 14: Glassmorphism
- [ ] Vérifier cards dashboard
- [ ] **Attendu**: backdrop-filter: blur(10px)
- [ ] **Attendu**: Borders subtiles (rgba)

---

## 🔒 FEATURES PREMIUM (Priorité P2)

### Test 15: Lock Features Elite
- [ ] Dashboard → "Competitor Spy" ou "Smart Calendar"
- [ ] Sans plan Elite
- [ ] **Attendu**: Icon 🔒 visible
- [ ] Cliquer dessus
- [ ] **Attendu**: Popup "Passer à Elite" ou redirect /pricing

---

## 👑 ADMIN DASHBOARD (Priorité P2)

### Test 16: Accès Admin
- [ ] Ajouter votre email dans `app/admin/middleware.ts`
- [ ] Redéployer
- [ ] Aller sur /admin/dashboard
- [ ] **Attendu**: Dashboard admin visible

### Test 17: Liste Coaches
- [ ] Vérifier liste tous les coaches
- [ ] **Attendu**: Nom, email, plan, status, revenue

### Test 18: Métriques Globales
- [ ] Vérifier MRR, Total Users, Churn
- [ ] **Attendu**: Calculs corrects depuis Supabase

### Test 19: Actions Admin
- [ ] Cliquer "Voir Dashboard" sur un coach
- [ ] **Attendu**: Voir son dashboard (impersonate)
- [ ] Cliquer "Suspendre"
- [ ] **Attendu**: Status → suspended

---

## 📄 PAGES (Priorité P2)

### Test 20: Page /demo
- [ ] Aller sur /demo
- [ ] **Attendu**: Dashboard preview interactif
- [ ] **Attendu**: Graphiques animés
- [ ] **Attendu**: Badge "Mode Aperçu"

### Test 21: Landing Page
- [ ] Aller sur /
- [ ] Vérifier toutes les sections
- [ ] **Attendu**: Vidéo autoplay (ou iframe)
- [ ] **Attendu**: CTAs fonctionnels

### Test 22: Pricing
- [ ] Aller sur /pricing
- [ ] **Attendu**: 3 plans (Starter, Pro, Elite)
- [ ] **Attendu**: Boutons "Choisir" fonctionnels

---

## 🚨 TESTS CRITIQUES FINAUX

### Test 23: Mode Démo
- [ ] Nouveau compte sans leads
- [ ] Aller sur dashboard
- [ ] **Attendu**: Données de démo affichées
- [ ] **Attendu**: Banner "Mode Aperçu"

### Test 24: Responsive Mobile
- [ ] Ouvrir sur mobile (ou DevTools mobile)
- [ ] Vérifier toutes les pages
- [ ] **Attendu**: Layout responsive, pas de scroll horizontal

### Test 25: Performance
- [ ] PageSpeed Insights
- [ ] **Attendu**: Score > 80
- [ ] **Attendu**: Pas d'erreurs console

---

## ✅ VALIDATIONS FINALES

| Catégorie | Tests Passés | Tests Total | % |
|-----------|--------------|-------------|---|
| Auth | ___ / 3 | 3 | ___% |
| IA | ___ / 4 | 4 | ___% |
| Dashboard | ___ / 4 | 4 | ___% |
| Design | ___ / 3 | 3 | ___% |
| Premium | ___ / 1 | 1 | ___% |
| Admin | ___ / 4 | 4 | ___% |
| Pages | ___ / 3 | 3 | ___% |
| Critiques | ___ / 3 | 3 | ___% |
| **TOTAL** | **___ / 25** | **25** | **___**% |

**Minimum acceptable : 90% (23/25)**

---

## 🐛 BUGS À RAPPORTER

Si un test échoue, noter ici:

1. **Test #__ :
...** 
   - Erreur: ___
   - Screenshot: ___
   - Console log: ___

2. **Test #__ :**: 
   - Erreur: ___
   - ...

---

## 📝 NOTES

- Tests à faire sur navigateur récent (Chrome/Firefox)
- Vider cache entre tests si nécessaire
- Tester en navigation privée pour simuler nouveau user
