# 📹 Cómo subir el video al sitio BAS-SAAS

## ✅ OPCIÓN 1: YouTube (Recomendado)

### Ventajas:
- ✅ Sin límite de ancho de banda
- ✅ Carga rápida (CDN de Google)
- ✅ Compatible con todos los dispositivos
- ✅ Analytics incluidos
- ✅ Gratis

### Pasos:

1. **Sube el video a YouTube:**
   - Ve a: https://studio.youtube.com/
   - Click "Subir video"
   - Selecciona `demo-es.mp4`
   
2. **Configuración del video:**
   ```
   Título: BAS SAAS - Sistema de Automatización para PYMEs | Demo Completa
   
   Descripción:
   Descubre cómo BAS automatiza tu negocio en 24 horas.
   
   🌐 Prueba gratis: https://rodrigodiazv.github.io/BAS-SAAS/
   💬 Únete al grupo VIP: https://t.me/+O0VJcwQpoflhZDc8
   
   BAS (Business Automation System) es la solución todo-en-uno para PYMEs:
   ✅ Dashboard con métricas en tiempo real
   ✅ Gestión completa de usuarios
   ✅ Sistema de suscripciones
   ✅ Configuración flexible
   
   Prueba gratis 14 días, sin tarjeta de crédito.
   
   Tags: saas, automatización, pymes, crm, business automation, emprendimiento
   
   Visibilidad: Público o No listado (tú decides)
   Miniatura: Captura del dashboard
   ```

3. **Copiar ID del video:**
   - Una vez subido, la URL será: `https://youtube.com/watch?v=ABC123xyz`
   - El ID del video es: `ABC123xyz`

4. **Actualizar el sitio:**
   
   Edita el archivo `/js/main.js` línea 3:
   
   ```javascript
   // ANTES:
   const YOUTUBE_VIDEO_ID = 'YOUR_VIDEO_ID';
   
   // DESPUÉS:
   const YOUTUBE_VIDEO_ID = 'ABC123xyz'; // Tu ID real
   ```

5. **Hacer push:**
   ```bash
   cd /root/clawd-main/bas-saas
   git add js/main.js
   git commit -m "Add YouTube video ID for demo"
   git push
   ```

6. **Esperar 1-2 minutos** a que GitHub Pages se actualice

7. **¡Listo!** Video funcionando en: https://rodrigodiazv.github.io/BAS-SAAS/#demo

---

## 🎬 OPCIÓN 2: Video directo en el sitio

### Ventajas:
- ✅ Sin dependencia de YouTube
- ✅ Más control
- ✅ Branding completo

### Desventajas:
- ❌ Consume ancho de banda de GitHub Pages
- ❌ Límite de 100 MB por archivo
- ❌ Más lento en móviles

### Pasos:

1. **Optimizar el video (importante):**
   
   Si el video pesa más de 50 MB, comprímelo:
   
   ```bash
   # Con ffmpeg (instalar si no lo tienes)
   ffmpeg -i demo-es.mp4 -vcodec h264 -acodec aac -b:v 3M -maxrate 3M -bufsize 6M demo-es-compressed.mp4
   ```
   
   Objetivo: 30-50 MB máximo

2. **Subir al repositorio:**
   
   ```bash
   cd /root/clawd-main/bas-saas
   mkdir -p videos
   cp /ruta/al/video/demo-es.mp4 videos/
   ```

3. **Crear miniatura:**
   
   Captura del minuto 0:30 del video:
   
   ```bash
   ffmpeg -i videos/demo-es.mp4 -ss 00:00:30 -frames:v 1 assets/video-thumbnail.jpg
   ```

4. **Actualizar index.html:**
   
   Línea ~135, cambiar de:
   ```html
   <video id="demoVideo" controls poster="assets/video-thumbnail.jpg" style="display:none;">
   ```
   
   A:
   ```html
   <video id="demoVideo" controls poster="assets/video-thumbnail.jpg" style="display:block;">
   ```
   
   Y ocultar el placeholder de YouTube:
   ```html
   <div class="youtube-placeholder" id="youtubePlaceholder" style="display:none;">
   ```

5. **Hacer push:**
   
   ```bash
   git add videos/ assets/video-thumbnail.jpg index.html
   git commit -m "Add demo video directly to site"
   git push
   ```

6. **Importante:** GitHub Pages tiene límite de 1 GB total y 100 GB/mes de bandwidth.

---

## 🎨 OPCIÓN 3: Vimeo (Premium)

Si quieres lo mejor de ambos mundos:

1. Sube a Vimeo Pro ($20/mes)
2. Sin anuncios, mejor calidad que YouTube
3. Embed profesional
4. Analytics detallados

Pasos similares a YouTube, pero con URL de Vimeo.

---

## 📸 Crear miniatura personalizada

Si quieres miniatura con texto:

### Herramientas online:
- Canva: https://www.canva.com/
- Snappa: https://snappa.com/
- Photopea: https://www.photopea.com/ (gratis, Photoshop online)

### Especificaciones:
- Tamaño: 1280x720 píxeles
- Formato: JPG
- Peso: < 2 MB
- Texto: Grande, legible
- Ejemplo: "BAS SAAS | Demo 3 min" + screenshot del dashboard

---

## ✅ Checklist final

Cuando el video esté listo:

- [ ] Video generado en MP4
- [ ] Miniatura creada (1280x720)
- [ ] Decidida plataforma (YouTube/directo/Vimeo)
- [ ] Video subido
- [ ] ID o URL copiado
- [ ] Archivo `js/main.js` actualizado
- [ ] Git push realizado
- [ ] GitHub Pages actualizado (1-2 min)
- [ ] Video probado en el sitio
- [ ] Funciona en móvil y desktop
- [ ] Compartido en grupo VIP Telegram

---

## 🆘 Problemas comunes

### "El video no carga"
- Verifica que el ID de YouTube es correcto
- Prueba en modo incógnito
- Espera 2-3 minutos tras el push

### "El video está pixelado"
- Súbelo de nuevo en HD (1080p mínimo)
- Ajusta bitrate: 5-8 Mbps

### "Error 404 en el video"
- Ruta incorrecta en el HTML
- Verifica que el archivo esté en `/videos/`

### "Muy lento en móvil"
- Usa YouTube en lugar de video directo
- O comprime más el video (3 Mbps bitrate)

---

## 📞 Ayuda

Si necesitas ayuda con algún paso:
- Escríbeme en el grupo VIP Telegram
- O usa el chat widget del sitio

¡El video va a quedar espectacular! 🎬
