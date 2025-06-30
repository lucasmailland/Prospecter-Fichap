const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Verificador de Seguridad para Prospecter-Fichap
 * 
 * Este script verifica que todas las vulnerabilidades de seguridad
 * han sido corregidas correctamente.
 */

class SecurityVerifier {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  log(type, message) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ${message}`;
    
    switch (type) {
      case 'error':
        this.errors.push(formatted);
        console.error(`❌ ${message}`);
        break;
      case 'warning':
        this.warnings.push(formatted);
        console.warn(`⚠️  ${message}`);
        break;
      case 'success':
        this.passed.push(formatted);
        console.log(`✅ ${message}`);
        break;
      case 'info':
        console.log(`ℹ️  ${message}`);
        break;
    }
  }

  // Verificar archivo .env
  checkEnvironmentFile() {
    this.log('info', 'Verificando archivo .env...');
    
    const envPath = path.join(__dirname, '..', '.env');
    
    if (!fs.existsSync(envPath)) {
      this.log('error', 'Archivo .env no encontrado');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    // Parse .env file
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });

    // Verificar JWT_SECRET
    this.checkJWTSecret(envVars.JWT_SECRET);
    
    // Verificar DATABASE_PASSWORD
    this.checkDatabasePassword(envVars.DATABASE_PASSWORD);
    
    // Verificar REDIS_PASSWORD
    this.checkRedisPassword(envVars.REDIS_PASSWORD);
    
    // Verificar otros secrets críticos
    this.checkGenericSecret('ENCRYPTION_KEY', envVars.ENCRYPTION_KEY);
    this.checkGenericSecret('SESSION_SECRET', envVars.SESSION_SECRET);
  }

  checkJWTSecret(jwtSecret) {
    if (!jwtSecret) {
      this.log('error', 'JWT_SECRET no está configurado');
      return;
    }

    const insecureSecrets = [
      'your-super-secret-jwt-key-change-this-in-production',
      'your_super_secret_jwt_key_here_make_it_long_and_random',
      'dev-secret-key-change-in-production'
    ];

    if (insecureSecrets.includes(jwtSecret)) {
      this.log('error', 'JWT_SECRET usa un valor inseguro por defecto');
      return;
    }

    if (jwtSecret.length < 64) {
      this.log('warning', 'JWT_SECRET es demasiado corto (< 64 caracteres)');
    } else if (jwtSecret.length >= 128) {
      this.log('success', 'JWT_SECRET tiene longitud adecuada (>= 128 caracteres)');
    } else {
      this.log('success', 'JWT_SECRET configurado correctamente');
    }
  }

  checkDatabasePassword(dbPassword) {
    if (!dbPassword) {
      this.log('warning', 'DATABASE_PASSWORD está vacío (puede ser válido para desarrollo local)');
      return;
    }

    const weakPasswords = ['password', '123456', 'admin', 'root', 'postgres'];
    
    if (weakPasswords.includes(dbPassword)) {
      this.log('error', 'DATABASE_PASSWORD usa una contraseña débil común');
      return;
    }

    if (dbPassword.length < 12) {
      this.log('warning', 'DATABASE_PASSWORD es demasiado corta (< 12 caracteres)');
    } else {
      this.log('success', 'DATABASE_PASSWORD configurada correctamente');
    }
  }

  checkRedisPassword(redisPassword) {
    if (!redisPassword) {
      this.log('warning', 'REDIS_PASSWORD está vacío (Redis sin autenticación)');
      return;
    }

    if (redisPassword.length < 16) {
      this.log('warning', 'REDIS_PASSWORD es demasiado corta (< 16 caracteres)');
    } else {
      this.log('success', 'REDIS_PASSWORD configurada correctamente');
    }
  }

  checkGenericSecret(name, value) {
    if (!value) {
      this.log('warning', `${name} no está configurado`);
      return;
    }

    if (value.length < 32) {
      this.log('warning', `${name} es demasiado corto (< 32 caracteres)`);
    } else {
      this.log('success', `${name} configurado correctamente`);
    }
  }

  // Verificar contraseñas hardcodeadas en scripts
  checkHardcodedCredentials() {
    this.log('info', 'Verificando contraseñas hardcodeadas...');
    
    const scriptsDir = path.join(__dirname);
    const scriptFiles = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.js'));
    
              const dangerousPatterns = [
       /password.*=.*["']admin123["']/i,
       /password.*=.*["']password["']/i,
       /secret.*=.*["']your-super-secret/i,
       /token.*=.*["']your-token/i,
     ];

    let foundHardcoded = false;

         scriptFiles.forEach(file => {
       // Saltar archivos de seguridad para evitar falsos positivos
       const securityFiles = [
         'verify-security.js', 
         'comprehensive-security-audit.js',
         'auto-fix-vulnerabilities.js',
         'generate-secure-secrets.js'
       ];
       if (securityFiles.includes(file)) return;
       
       const filePath = path.join(scriptsDir, file);
       const content = fs.readFileSync(filePath, 'utf8');
      
      dangerousPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          this.log('error', `Contraseña hardcodeada encontrada en ${file}`);
          foundHardcoded = true;
        }
      });
    });

    if (!foundHardcoded) {
      this.log('success', 'No se encontraron contraseñas hardcodeadas en scripts');
    }
  }

  // Verificar configuración de Docker
  checkDockerSecurity() {
    this.log('info', 'Verificando configuración de Docker...');
    
    const dockerComposePath = path.join(__dirname, '..', '..', 'docker-compose.yml');
    
    if (!fs.existsSync(dockerComposePath)) {
      this.log('warning', 'docker-compose.yml no encontrado');
      return;
    }

    const dockerContent = fs.readFileSync(dockerComposePath, 'utf8');
    
    // Verificar que no hay contraseñas por defecto
    if (dockerContent.includes('POSTGRES_PASSWORD=password')) {
      this.log('error', 'Docker usa contraseña por defecto para PostgreSQL');
    } else {
      this.log('success', 'Docker no usa contraseñas por defecto');
    }

    // Verificar que usa variables de entorno
    if (dockerContent.includes('${DATABASE_PASSWORD}')) {
      this.log('success', 'Docker usa variables de entorno para secrets');
    } else {
      this.log('warning', 'Docker podría no usar variables de entorno');
    }
  }

  // Verificar archivos sensibles
  checkSensitiveFiles() {
    this.log('info', 'Verificando archivos sensibles...');
    
    const sensitiveFiles = [
      '.env',
      '.env.secure',
      'private.key',
      'secret.key',
      'database.sqlite'
    ];

    const gitignorePath = path.join(__dirname, '..', '..', '.gitignore');
    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    sensitiveFiles.forEach(file => {
      if (gitignoreContent.includes(file)) {
        this.log('success', `${file} está en .gitignore`);
      } else {
        this.log('warning', `${file} debería estar en .gitignore`);
      }
    });
  }

  // Ejecutar todas las verificaciones
  async runAllChecks() {
    console.log('🔒 VERIFICADOR DE SEGURIDAD - Prospecter-Fichap');
    console.log('================================================\n');

    this.checkEnvironmentFile();
    this.checkHardcodedCredentials();
    this.checkDockerSecurity();
    this.checkSensitiveFiles();

    console.log('\n================================================');
    console.log('📊 RESUMEN DE VERIFICACIÓN:');
    console.log(`✅ Verificaciones exitosas: ${this.passed.length}`);
    console.log(`⚠️  Advertencias: ${this.warnings.length}`);
    console.log(`❌ Errores críticos: ${this.errors.length}`);

    if (this.errors.length === 0) {
      console.log('\n🎉 ¡VERIFICACIÓN DE SEGURIDAD EXITOSA!');
      console.log('El sistema está configurado de manera segura.');
      
      if (this.warnings.length > 0) {
        console.log('\n💡 Considera corregir las advertencias mostradas.');
      }
      
      return true;
    } else {
      console.log('\n🚨 ¡ERRORES DE SEGURIDAD DETECTADOS!');
      console.log('Corrige los errores antes de continuar:');
      
      this.errors.forEach(error => console.log(`  • ${error}`));
      
      console.log('\n💡 Sugerencias:');
      console.log('  • Ejecuta: node scripts/generate-secure-secrets.js');
      console.log('  • Copia los secrets a tu archivo .env');
      console.log('  • Elimina contraseñas hardcodeadas');
      
      return false;
    }
  }
}

// Auto-ejecutar si se llama directamente
if (require.main === module) {
  const verifier = new SecurityVerifier();
  verifier.runAllChecks().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Error ejecutando verificación:', error);
    process.exit(1);
  });
}

module.exports = { SecurityVerifier }; 