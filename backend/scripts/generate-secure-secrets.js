const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generador de Secrets Seguros para Prospecter-Fichap
 * 
 * Este script genera automáticamente todos los secrets necesarios
 * para una configuración segura del sistema.
 */

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateJWTSecret() {
  // JWT secret debe ser particularmente fuerte (128 bytes = 256 caracteres hex)
  return crypto.randomBytes(128).toString('hex');
}

function generatePassword(length = 32) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

function generateApiKey() {
  // Formato estándar para API keys
  const prefix = 'pk_';
  const key = crypto.randomBytes(32).toString('hex');
  return prefix + key;
}

async function generateSecrets() {
  console.log('🔐 Generando secrets seguros...\n');

  const secrets = {
    // JWT Configuration
    JWT_SECRET: generateJWTSecret(),
    
    // Database Security
    DATABASE_PASSWORD: generatePassword(24),
    
    // Redis Security
    REDIS_PASSWORD: generatePassword(20),
    
    // Application Security
    SESSION_SECRET: generateSecureSecret(64),
    ENCRYPTION_KEY: generateSecureSecret(32),
    
    // Monitoring
    GRAFANA_PASSWORD: generatePassword(16),
    
    // API Keys (placeholders seguros)
    MAILBOXLAYER_API_KEY: generateApiKey(),
    HUNTER_API_KEY: generateApiKey(),
    CLEARBIT_API_KEY: generateApiKey(),
    ABSTRACT_API_KEY: generateApiKey(),
    
    // Webhooks (placeholder seguro)
    SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/REPLACE/WITH/REAL/WEBHOOK',
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/REPLACE/WITH/REAL/WEBHOOK',
    
    // SSH Keys (para staging)
    STAGING_SSH_PRIVATE_KEY_PLACEHOLDER: 'REPLACE_WITH_REAL_SSH_PRIVATE_KEY',
    
    // Docker Registry
    DOCKER_REGISTRY_TOKEN: generateSecureSecret(32),
    
    // SonarQube
    SONAR_TOKEN: 'sq_' + generateSecureSecret(32),
  };

  // Mostrar secrets generados
  console.log('✅ Secrets generados exitosamente:\n');
  console.log('═══════════════════════════════════════════════════');
  
  Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
  
  console.log('═══════════════════════════════════════════════════\n');

  // Crear archivo .env.secure
  const envContent = Object.entries(secrets)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const envPath = path.join(__dirname, '..', '.env.secure');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`📝 Secrets guardados en: ${envPath}`);
  console.log('⚠️  IMPORTANTE: Copia estos valores a tu archivo .env');
  console.log('⚠️  NUNCA commitees .env.secure al repositorio');
  console.log('⚠️  Guarda estos secrets en un gestor de contraseñas');
  
  // Crear instrucciones de seguridad
  const securityInstructions = `
# 🔒 INSTRUCCIONES DE SEGURIDAD
# ========================================

## ⚠️ ACCIONES REQUERIDAS:

1. COPIAR los valores de .env.secure a tu archivo .env
2. ELIMINAR el archivo .env.secure después de copiar
3. CAMBIAR los placeholders por valores reales:
   - SLACK_WEBHOOK_URL
   - DISCORD_WEBHOOK_URL
   - STAGING_SSH_PRIVATE_KEY_PLACEHOLDER
   - API keys de servicios externos

## 🔐 SECRETS CRÍTICOS:

- JWT_SECRET: Nunca compartir, usar solo en producción
- DATABASE_PASSWORD: Cambiar en producción
- REDIS_PASSWORD: Configurar en Redis
- ENCRYPTION_KEY: Para cifrado de datos sensibles

## 📋 VERIFICACIÓN:

Ejecuta: npm run verify-security
Para verificar que todos los secrets están configurados correctamente.

## 🚨 EN CASO DE COMPROMISO:

1. Regenerar TODOS los secrets
2. Cambiar contraseñas de base de datos
3. Rotar API keys de servicios externos
4. Revisar logs de acceso

Generado el: ${new Date().toISOString()}
`;

  const instructionsPath = path.join(__dirname, '..', 'SECURITY_INSTRUCTIONS.md');
  fs.writeFileSync(instructionsPath, securityInstructions);
  
  console.log(`📋 Instrucciones de seguridad creadas: ${instructionsPath}\n`);
  
  return secrets;
}

// Auto-ejecutar si se llama directamente
if (require.main === module) {
  generateSecrets().catch(console.error);
}

module.exports = { generateSecrets, generateSecureSecret, generateJWTSecret, generatePassword }; 