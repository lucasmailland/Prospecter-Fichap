# 🚀 GUÍA RÁPIDA - PROSPECTER-FICHAP

## ⚡ **INICIO RÁPIDO MAÑANA:**

```bash
# 1. Ir al directorio del proyecto
cd /Users/lucasmailland/Desktop/Prospecter-Fichap

# 2A. OPCIÓN 1: Limpiar problemas PRIMERO (RECOMENDADO)
./fix-all-problems.sh    # Arregla 146 problemas
./start-dev.sh           # Luego inicia todo

# 2B. OPCIÓN 2: Inicio rápido (te pregunta si limpiar)
./start-dev.sh           # Inicia con opción de limpiar

# 3. Esperar 2-3 minutos y abrir:
# 🌐 Frontend: http://localhost:3003
# 🔧 Backend:  http://localhost:4000  
# 📊 Prisma:   http://localhost:5555
```

## 🧹 **ARREGLAR PROBLEMAS (146 detectados):**

```bash
./fix-all-problems.sh
```

**Este script arregla:**
- ✅ Errores TypeScript
- ✅ Warnings ESLint  
- ✅ Formato Prettier
- ✅ Imports no utilizados
- ✅ Cache corrupto
- ✅ Dependencias outdated

## 🛑 **PARA CERRAR TODO:**

```bash
./stop-dev.sh
```

---

## 📊 **ESTADO ACTUAL:**

### ✅ **LO QUE FUNCIONA:**
- ✅ **Signup/Login** - Puedes registrarte y loguearte
- ✅ **Base datos** - Prisma + SQLite para NextAuth
- ✅ **API mock** - Leads funcionan temporalmente
- ✅ **Layout** - Datos reales del usuario
- ✅ **Docker** - PostgreSQL configurado

### ❌ **LO QUE FALTA:**
- ❌ **Backend NestJS** - Se cuelga al arrancar
- ❌ **API real** - Cambiar mock por PostgreSQL
- 🧹 **146 problemas** - Errores TypeScript/ESLint

---

## 🔧 **SI HAY PROBLEMAS:**

### **Backend no arranca:**
```bash
cd backend
npm run start:dev
# Ver logs en pantalla para diagnosticar
```

### **Muchos errores en IDE:**
```bash
./fix-all-problems.sh
# Arregla automáticamente la mayoría
```

### **PostgreSQL no conecta:**
```bash
docker ps | grep postgres
docker logs prospecter-fichap-postgres-1
```

### **Puerto ocupado:**
```bash
lsof -i :3003  # Frontend
lsof -i :4000  # Backend
lsof -i :5432  # PostgreSQL
```

---

## 📁 **ARCHIVOS IMPORTANTES:**

- `start-dev.sh` - Script de inicio  
- `stop-dev.sh` - Script de cierre
- `fix-all-problems.sh` - Limpieza de errores ⭐
- `logs/` - Logs de todos los servicios
- `backend/.env` - Config PostgreSQL
- `.env.local` - Config principal

---

## 🎯 **PRÓXIMOS PASOS:**

1. **Limpiar problemas:** `./fix-all-problems.sh` ⭐
2. **Arrancar proyecto:** `./start-dev.sh`
3. **Diagnosticar backend** si no arranca
4. **Cambiar API mock → real** cuando backend funcione
5. **Probar signup/login** funcional

---

## 🆘 **DATOS DE PRUEBA:**

```
Email: test@example.com
Password: CHANGE_THIS_PASSWORD
```

¡Seguimos mañana! 🚀 