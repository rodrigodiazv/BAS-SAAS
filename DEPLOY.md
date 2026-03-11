# 🚀 DEPLOY BAS LANDING

## Ver localmente

```bash
cd /root/clawd-main/bas-saas
python3 -m http.server 8000
```

Luego abre: http://localhost:8000

---

## Deploy a GitHub Pages (RECOMENDADO)

### 1. Crea repo en GitHub:
https://github.com/new
- Nombre: `bas-saas`
- Público

### 2. Push el código:
```bash
cd /root/clawd-main/bas-saas
git remote add origin https://github.com/rodrigodiazv/bas-saas.git
git push -u origin master
```

### 3. Activa GitHub Pages:
- Ve a Settings → Pages
- Source: Deploy from branch
- Branch: master / (root)
- Save

URL final: https://rodrigodiazv.github.io/bas-saas/

---

## Deploy a Netlify (ALTERNATIVA)

### Opción A: Drag & Drop
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `/root/clawd-main/bas-saas`
3. Listo

### Opción B: GitHub (automático)
1. Conecta el repo a Netlify
2. Deploy automático en cada push

---

## Deploy a Surge.sh (RÁPIDO)

```bash
cd /root/clawd-main/bas-saas
npx surge . bas-system.surge.sh
```

Te pedirá email/password (crear cuenta gratis)
URL: https://bas-system.surge.sh

---

## Dominio custom (futuro)

Opciones de nombres:
- bas-system.com
- automate.business
- pymeauto.com
- businessautomation.es

Configurar DNS cuando tengas el dominio.
