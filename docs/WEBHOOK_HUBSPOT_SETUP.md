# 🔗 Configuración de Webhooks HubSpot

Esta guía te ayudará a configurar webhooks en HubSpot para sincronización automática en tiempo real con tu sistema Prospecter.

## 🎯 **¿Qué son los Webhooks?**

Los webhooks permiten que HubSpot notifique automáticamente a tu sistema cuando:
- Se crea un nuevo contacto
- Se actualiza información de un contacto
- Se elimina un contacto
- Se modifican empresas, deals, etc.

**Sin webhooks**: Necesitas sincronizar manualmente  
**Con webhooks**: Sincronización automática en tiempo real ⚡

## 🚀 **Configuración Paso a Paso**

### **Paso 1: Acceder a Developer Account**

1. Ve a tu **HubSpot Developer Account**: https://developers.hubspot.com/
2. Si no tienes cuenta de desarrollador, créala (es gratuita)
3. Ve a **"My Apps"** → **"Create app"**

### **Paso 2: Crear o Configurar tu App**

1. **Nombre de la app**: "Prospecter Integration"
2. **Descripción**: "Sincronización automática con sistema de prospección"
3. En **"App info"** → **"Scopes"**, asegúrate de tener:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.companies.read`
   - `crm.objects.deals.read`

### **Paso 3: Configurar Webhooks**

1. En tu app, ve a **"Webhooks"** tab
2. Haz clic en **"Create subscription"**
3. Configura los siguientes webhooks:

#### **📞 Webhook de Contactos**
```
Subscription Type: contact.creation, contact.propertyChange, contact.deletion
Target URL: https://tu-dominio.com/api/webhooks/hubspot/contact
```

#### **🏢 Webhook de Empresas (opcional)**
```
Subscription Type: company.creation, company.propertyChange, company.deletion  
Target URL: https://tu-dominio.com/api/webhooks/hubspot/company
```

#### **💰 Webhook de Deals (opcional)**
```
Subscription Type: deal.creation, deal.propertyChange, deal.deletion
Target URL: https://tu-dominio.com/api/webhooks/hubspot/deal
```

### **Paso 4: Configurar URL Pública**

Para desarrollo local, necesitas exponer tu localhost al internet:

#### **Opción A: ngrok (Recomendado)**
```bash
# Instalar ngrok
npm install -g ngrok

# Exponer puerto 3000
ngrok http 3000

# Usar la URL que te da ngrok
https://abc123.ngrok.io/api/webhooks/hubspot/contact
```

#### **Opción B: Railway/Vercel (Producción)**
```bash
# Deploy a producción
vercel --prod

# Usar tu dominio de producción
https://tu-app.vercel.app/api/webhooks/hubspot/contact
```

### **Paso 5: Validar Configuración**

1. En HubSpot, ve a **"Test"** en tu webhook
2. Debe mostrar **"Success"** al hacer la prueba
3. En tu sistema, verifica que aparezca el webhook activo

## 🔧 **URLs de Webhooks Disponibles**

| Tipo | Endpoint | Eventos |
|------|----------|---------|
| Contactos | `/api/webhooks/hubspot/contact` | Creación, actualización, eliminación |
| Empresas | `/api/webhooks/hubspot/company` | Creación, actualización, eliminación |
| Deals | `/api/webhooks/hubspot/deal` | Creación, actualización, eliminación |

## 📋 **Eventos Soportados**

### **Contactos**
- `contact.creation` - Nuevo contacto creado
- `contact.propertyChange` - Propiedad de contacto actualizada
- `contact.deletion` - Contacto eliminado

### **Empresas**
- `company.creation` - Nueva empresa creada
- `company.propertyChange` - Propiedad de empresa actualizada
- `company.deletion` - Empresa eliminada

### **Deals**
- `deal.creation` - Nuevo deal creado
- `deal.propertyChange` - Propiedad de deal actualizada
- `deal.deletion` - Deal eliminado

## 🧪 **Testing**

### **Verificar que el Webhook Funciona**

1. **En HubSpot**: Crea un contacto de prueba
2. **En tu sistema**: Ve a HubSpot → debería aparecer automáticamente
3. **En los logs**: Deberías ver:
   ```
   🔔 Webhook de HubSpot recibido: contact.creation
   🆕 Contacto creado: Juan Pérez
   ```

### **Endpoint de Verificación**
```bash
curl https://tu-dominio.com/api/webhooks/hubspot/contact
```

Respuesta esperada:
```json
{
  "success": true,
  "webhook": {
    "status": "active",
    "endpoint": "/api/webhooks/hubspot/contact",
    "lastEvent": { ... },
    "lastEventTime": "2025-07-07T21:30:00.000Z"
  },
  "syncStats": {
    "contacts": 47207,
    "companies": 18689,
    "total": 96655
  }
}
```

## 🔒 **Seguridad**

### **Validación de Eventos**
- Los webhooks validan que vengan de HubSpot
- Se registran todos los eventos para auditoria
- Manejo de errores robusto

### **Rate Limiting**
- HubSpot tiene límites de rate (100 requests/10s)
- El sistema maneja automáticamente los delays
- Los errores se reintentan automáticamente

## 🎛️ **Monitoreo**

### **Dashboard del Webhook**
En la página HubSpot de tu sistema puedes ver:
- ✅ Estado del webhook (activo/inactivo)
- 📊 Último evento recibido
- 📈 Estadísticas de procesamiento
- ❌ Errores recientes

### **Logs Detallados**
```bash
# Ver logs del servidor
npm run dev

# Buscar logs de webhook
grep "Webhook de HubSpot" logs/
```

## 🚨 **Troubleshooting**

### **Webhook No Recibe Eventos**
1. ✅ Verificar que la URL sea accesible públicamente
2. ✅ Comprobar que el endpoint responda 200 OK
3. ✅ Validar que los scopes estén configurados
4. ✅ Revisar que el webhook esté activo en HubSpot

### **Errores Comunes**

| Error | Causa | Solución |
|-------|--------|----------|
| 404 Not Found | URL incorrecta | Verificar endpoint |
| 401 Unauthorized | Token inválido | Reconfigurar API key |
| 500 Server Error | Error en código | Revisar logs |
| Timeout | Proceso muy lento | Optimizar webhook handler |

### **Comandos de Debug**
```bash
# Verificar token HubSpot
curl -H "Authorization: Bearer tu-token" https://api.hubapi.com/crm/v3/objects/contacts?limit=1

# Test manual del webhook
curl -X POST https://tu-dominio.com/api/webhooks/hubspot/contact \
  -H "Content-Type: application/json" \
  -d '[{"eventType":"contact.creation","objectId":"12345"}]'
```

## 🎉 **¡Listo!**

Una vez configurado, tu sistema:
- ⚡ Se sincroniza automáticamente con HubSpot
- 🔄 No necesita sincronización manual
- 📱 Funciona en tiempo real
- 🛡️ Es seguro y confiable

**¿Necesitas ayuda?** Contacta al equipo de desarrollo con los logs específicos del error.

---

### 📚 **Referencias**
- [HubSpot Webhooks Documentation](https://developers.hubspot.com/docs/api/webhooks)
- [HubSpot Developer Account](https://developers.hubspot.com/)
- [ngrok Documentation](https://ngrok.com/docs) 