# 💬 Sistema de Chat en Vivo - BAS SAAS

## Cómo funciona

### 1. Widget de chat
- Icono flotante en todas las páginas (esquina inferior derecha)
- Click para abrir ventana de chat
- Usuario escribe mensaje

### 2. Flujo de mensajes

**Usuario → Charly (Telegram)**
```
Usuario escribe en widget
  ↓
Mensaje guardado en localStorage
  ↓
Mensaje visible en consola del navegador (window.basChatQueue)
  ↓
Rodrigo: abres consola del navegador y ves los mensajes pendientes
  ↓
Copias el mensaje y se lo pasas a Charly manualmente
```

**Charly → Usuario**
```
Charly responde en este chat de Telegram
  ↓
Tú copias la respuesta de Charly
  ↓
Abres consola del navegador y ejecutas:
  window.chatWidget.receiveFromCharly("Respuesta de Charly aquí")
  ↓
Mensaje aparece en el widget del usuario
```

## Comandos de consola

### Ver mensajes pendientes
```javascript
// Ver cola de mensajes esperando respuesta
console.log(window.basChatQueue);

// Ver último mensaje
window.basChatQueue[window.basChatQueue.length - 1]
```

### Enviar respuesta de Charly
```javascript
// Responder al último usuario
window.chatWidget.receiveFromCharly("Hola, soy Charly. ¿En qué puedo ayudarte?");

// Responder a sesión específica
window.chatWidget.receiveFromCharly("Tu respuesta", "chat_1234567_abc");
```

### Ver historial completo
```javascript
// Ver todos los mensajes de una sesión
const sessionId = "chat_1234567_abc";
const messages = JSON.parse(localStorage.getItem('bas_chat_messages'));
console.log(messages);
```

## Automatización futura (Fase 2)

Para automatizar completamente (sin copiar/pegar manual):

### Opción A: Webhook desde Clawdbot
1. Configurar webhook en el sitio (`/webhook/chat`)
2. Clawdbot envía respuestas via POST
3. Widget las recibe automáticamente

### Opción B: Integración directa Telegram
1. Bot de Telegram dedicado
2. Widget conecta via WebSocket
3. Chat 100% en tiempo real

### Opción C: Backend Node.js
1. Servidor que corre en tu hosting
2. Maneja mensajes ida y vuelta
3. Base de datos para historial

## Calificación de leads

Charly puede usar estos criterios:

**Lead Caliente 🔥**
- Tiene presupuesto claro
- Necesidad urgente (< 2 semanas)
- Ya usa herramientas similares
- Pide demo o precios específicos

**Lead Tibio 🌡️**
- Interés pero no urgencia
- Investiga opciones
- Hace preguntas generales
- Pide más información

**Lead Frío ❄️**
- Solo curiosidad
- Sin presupuesto definido
- Sin timeline
- Preguntas muy básicas

## Notificación a Rodrigo

Cuando Charly detecta lead caliente:
```
🔥 LEAD CALIENTE detectado

Nombre: Juan Pérez
Email: juan@empresa.com
Plan interesado: Pro
Necesidad: Automatización ventas
Urgencia: 1 semana
Budget: 500-1000€/mes

Conversación:
[Resumen de chat]

¿Quieres tomar el control del chat?
```

## Testing

Para probar el widget:
1. Abre: https://rodrigodiazv.github.io/BAS-SAAS/
2. Click en el icono de chat (abajo derecha)
3. Escribe un mensaje de prueba
4. Abre consola (F12)
5. Ve los mensajes en `window.basChatQueue`

## Próximos pasos

- [ ] Webhook automático para respuestas
- [ ] Panel de admin para ver todos los chats
- [ ] Notificaciones push cuando llega mensaje
- [ ] Integración con CRM
- [ ] Analytics de conversaciones
