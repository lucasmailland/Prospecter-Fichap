const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getAuthToken() {
  console.log('🔑 Generando token de autenticación...');

  const payload = {
    sub: 'admin-user-id', // ID del usuario admin
    email: 'admin@prospecter-fichap.com',
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
    iss: 'prospecter-fichap',
    aud: 'prospecter-fichap-users',
  };

  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  
  try {
    const token = jwt.sign(payload, secret);
    
    console.log('✅ Token generado exitosamente');
    console.log('🔐 Token JWT:');
    console.log(token);
    console.log('');
    console.log('📋 Para usar el token en las peticiones:');
    console.log('   Authorization: Bearer ' + token);
    console.log('');
    console.log('🧪 Ejemplo de uso:');
    console.log(`   curl -H "Authorization: Bearer ${token}" http://localhost:3000/api/pentest/tools`);
    
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