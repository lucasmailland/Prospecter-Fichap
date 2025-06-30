const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getAuthToken() {
  console.log('🔑 Generando token de autenticación...');

  // Validar que JWT_SECRET esté configurado correctamente
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error('❌ JWT_SECRET no está configurado en las variables de entorno');
    console.error('💡 Ejecuta: node scripts/generate-secure-secrets.js');
    process.exit(1);
  }

  // Verificar que no sea el valor inseguro por defecto
  const insecureSecrets = [
    'your-super-secret-jwt-key-change-this-in-production',
    'your_super_secret_jwt_key_here_make_it_long_and_random',
    'dev-secret-key-change-in-production'
  ];

  if (insecureSecrets.includes(jwtSecret)) {
    console.error('❌ JWT_SECRET usa un valor inseguro por defecto');
    console.error('💡 Ejecuta: node scripts/generate-secure-secrets.js');
    console.error('⚠️  NUNCA uses secrets por defecto en producción');
    process.exit(1);
  }

  // Verificar que el secret sea lo suficientemente fuerte
  if (jwtSecret.length < 64) {
    console.warn('⚠️  JWT_SECRET es demasiado corto (< 64 caracteres)');
    console.warn('💡 Recomendación: usar un secret de al menos 128 caracteres');
  }

  const payload = {
    sub: 'admin-user-id', // ID del usuario admin
    email: 'admin@prospecter-fichap.com',
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
    iss: 'prospecter-fichap',
    aud: 'prospecter-fichap-users',
  };

  try {
    const token = jwt.sign(payload, jwtSecret);
    
    console.log('✅ Token generado exitosamente');
    console.log('🔐 Token JWT:');
    console.log(token);
    console.log('');
    console.log('📋 Para usar el token en las peticiones:');
    console.log('   Authorization: Bearer ' + token);
    console.log('');
    console.log('🧪 Ejemplo de uso:');
    console.log(`   curl -H "Authorization: Bearer ${token}" http://localhost:4000/api/health`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Este token expira en 24 horas');
    console.log('🔒 Secret utilizado: [HIDDEN FOR SECURITY]');
    
    return token;
  } catch (error) {
    console.error('❌ Error generando token:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  getAuthToken();
}

module.exports = { getAuthToken }; 