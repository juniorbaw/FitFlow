# 📋 VALEURS À COPIER-COLLER

## Pour Vercel Dashboard

### Variable 1: NEXT_PUBLIC_INSTAGRAM_APP_ID

**À copier:**
```
4318616691715057
```

### Variable 2: INSTAGRAM_APP_SECRET

**À copier:**
```
a667e928daee99ec432b7a829394dc6a
```

### Variable 3: SUPABASE_SERVICE_ROLE_KEY

**Pour obtenir la valeur:**
1. Ouvrez: `~/.env.local` (ou `/Users/souleyjr/Desktop/FitFlow Launch/.env.local`)
2. Cherchez la ligne: `SUPABASE_SERVICE_ROLE_KEY=...`
3. Copiez **toute la valeur** (commence par `eyJ`)

**Ou lancez:**
```bash
grep "^SUPABASE_SERVICE_ROLE_KEY=" ~/.env.local | cut -d'=' -f2
```

---

## Pour Facebook Developer

### Redirect URI

**À copier dans "Valid OAuth Redirect URIs":**
```
https://fit-flow-gamma.vercel.app/api/auth/instagram/callback
```

**Pour dev local (optionnel):**
```
http://localhost:3000/api/auth/instagram/callback
```

---

## Résumé des URLs

| Endroit | URL/Valeur |
|---------|-----------|
| Vercel Env Var | `https://vercel.com/dashboard/fit-flow/settings/environment-variables` |
| Facebook Dev | `https://developers.facebook.com/apps/4318616691715057/` |
| App Production | `https://fit-flow-gamma.vercel.app` |
| App Dev Local | `http://localhost:3000` |
| OAuth Redirect (Prod) | `https://fit-flow-gamma.vercel.app/api/auth/instagram/callback` |
| OAuth Redirect (Dev) | `http://localhost:3000/api/auth/instagram/callback` |

---

## Commandes utiles

### Afficher les variables locales:
```bash
cd "/Users/souleyjr/Desktop/FitFlow Launch"
grep -E "NEXT_PUBLIC_INSTAGRAM|INSTAGRAM_APP_SECRET|SUPABASE_SERVICE_ROLE_KEY" .env.local
```

### Vérifier la configuration:
```bash
bash scripts/verify-instagram-config.sh
```

### Lancer le serveur dev:
```bash
npm run dev
# Puis ouvrez: http://localhost:3000/settings
```

### Redéployer:
```bash
git push
```

---

## État de checklist

- [ ] Vercel Env Vars ajoutées (3 variables)
- [ ] Facebook Developer Redirect URI configuré
- [ ] Facebook Developer Scopes vérifiés
- [ ] `git push` lancé
- [ ] Redéploiement Vercel fini (3-5 min)
- [ ] Test: https://fit-flow-gamma.vercel.app/settings

