const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Auditoría Comprehensiva de Seguridad para Prospecter-Fichap
 * 
 * Este script detecta TODAS las vulnerabilidades identificadas
 * en el reporte de análisis de código.
 */

class ComprehensiveSecurityAudit {
  constructor() {
    this.critical = [];
    this.high = [];
    this.medium = [];
    this.low = [];
    this.info = [];
  }

  log(severity, category, message, file = '', line = '') {
    const entry = {
      severity,
      category,
      message,
      file,
      line,
      timestamp: new Date().toISOString()
    };

    const prefix = {
      'CRITICAL': '🔴',
      'HIGH': '🟠',
      'MEDIUM': '🟡',
      'LOW': '🔵',
      'INFO': '⚪'
    }[severity] || '❓';

    const location = file ? `[${file}${line ? `:${line}` : ''}]` : '';
    console.log(`${prefix} [${severity}] ${category}: ${message} ${location}`);

    switch (severity) {
      case 'CRITICAL': this.critical.push(entry); break;
      case 'HIGH': this.high.push(entry); break;
      case 'MEDIUM': this.medium.push(entry); break;
      case 'LOW': this.low.push(entry); break;
      case 'INFO': this.info.push(entry); break;
    }
  }

  // 1. HARDCODED CREDENTIALS (Score: 445+)
  scanHardcodedCredentials() {
    this.log('INFO', 'SCAN', 'Escaneando credenciales hardcodeadas...');
    
    const patterns = [
      { pattern: /password\s*[=:]\s*["'][^"']{1,20}["']/gi, type: 'Password' },
      { pattern: /secret\s*[=:]\s*["'][^"']{8,}["']/gi, type: 'Secret' },
      { pattern: /token\s*[=:]\s*["'][^"']{10,}["']/gi, type: 'Token' },
      { pattern: /api[_-]?key\s*[=:]\s*["'][^"']{10,}["']/gi, type: 'API Key' },
      { pattern: /auth[_-]?token\s*[=:]\s*["'][^"']{10,}["']/gi, type: 'Auth Token' },
      { pattern: /jwt[_-]?secret\s*[=:]\s*["'][^"']{8,}["']/gi, type: 'JWT Secret' },
      { pattern: /admin123|password|123456|root/gi, type: 'Weak Password' }
    ];

    const scanDirs = [
      path.join(__dirname, '..'),
      path.join(__dirname, '..', '..', 'frontend'),
      path.join(__dirname, '..', '..')
    ];

    patterns.forEach(({ pattern, type }) => {
      scanDirs.forEach(dir => {
        this.scanDirectory(dir, pattern, type, 'HARDCODED_CREDENTIALS');
      });
    });
  }

  // 2. HARDCODED SECRETS (Score: 812)
  scanHardcodedSecrets() {
    this.log('INFO', 'SCAN', 'Escaneando secrets hardcodeados...');
    
    const secretPatterns = [
      { pattern: /ghp_[a-zA-Z0-9]{36}/g, type: 'GitHub Token' },
      { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, type: 'Stripe Secret' },
      { pattern: /xoxb-[a-zA-Z0-9-]+/g, type: 'Slack Bot Token' },
      { pattern: /AIza[0-9A-Za-z\\-_]{35}/g, type: 'Google API Key' },
      { pattern: /AKIA[0-9A-Z]{16}/g, type: 'AWS Access Key' },
      { pattern: /dckr_pat_[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/g, type: 'Docker Token' },
      { pattern: /sq_[a-zA-Z0-9]{40,}/g, type: 'SonarQube Token' }
    ];

    secretPatterns.forEach(({ pattern, type }) => {
      this.scanProjectFiles(pattern, type, 'HARDCODED_SECRETS');
    });
  }

  // 3. CLEARTEXT TRANSMISSION (Score: 506)
  scanCleartextTransmission() {
    this.log('INFO', 'SCAN', 'Escaneando transmisión en texto claro...');
    
    const patterns = [
      { pattern: /http:\/\/[^\/\s"']+/gi, type: 'HTTP URL' },
      { pattern: /ftp:\/\/[^\/\s"']+/gi, type: 'FTP URL' },
      { pattern: /telnet:\/\/[^\/\s"']+/gi, type: 'Telnet URL' },
      { pattern: /smtp\.gmail\.com.*\bport\s*[=:]\s*25\b/gi, type: 'SMTP Plain' }
    ];

    patterns.forEach(({ pattern, type }) => {
      this.scanProjectFiles(pattern, type, 'CLEARTEXT_TRANSMISSION');
    });
  }

  // 4. SERVER-SIDE REQUEST FORGERY (Score: 412)
  scanSSRFVulnerabilities() {
    this.log('INFO', 'SCAN', 'Escaneando vulnerabilidades SSRF...');
    
    const patterns = [
      { pattern: /fetch\s*\(\s*[^)]*\$\{[^}]+\}/gi, type: 'Dynamic Fetch URL' },
      { pattern: /axios\s*\(\s*[^)]*\$\{[^}]+\}/gi, type: 'Dynamic Axios URL' },
      { pattern: /request\s*\(\s*[^)]*\$\{[^}]+\}/gi, type: 'Dynamic Request URL' },
      { pattern: /curl\s+[^"']*\$\{[^}]+\}/gi, type: 'Dynamic cURL Command' },
      { pattern: /http\.get\s*\(\s*[^)]*\$\{[^}]+\}/gi, type: 'Dynamic HTTP GET' }
    ];

    patterns.forEach(({ pattern, type }) => {
      this.scanProjectFiles(pattern, type, 'SSRF_VULNERABILITY');
    });
  }

  // 5. XSS VULNERABILITIES (Score: 756)
  scanXSSVulnerabilities() {
    this.log('INFO', 'SCAN', 'Escaneando vulnerabilidades XSS...');
    
    const patterns = [
      { pattern: /dangerouslySetInnerHTML/gi, type: 'dangerouslySetInnerHTML' },
      { pattern: /innerHTML\s*[=:]/gi, type: 'innerHTML Assignment' },
      { pattern: /outerHTML\s*[=:]/gi, type: 'outerHTML Assignment' },
      { pattern: /document\.write\s*\(/gi, type: 'document.write' },
      { pattern: /eval\s*\(/gi, type: 'eval() Usage' },
      { pattern: /Function\s*\(/gi, type: 'Function Constructor' },
      { pattern: /setTimeout\s*\(\s*["'][^"']*\$\{[^}]+\}/gi, type: 'Dynamic setTimeout' },
      { pattern: /setInterval\s*\(\s*["'][^"']*\$\{[^}]+\}/gi, type: 'Dynamic setInterval' }
    ];

    patterns.forEach(({ pattern, type }) => {
      this.scanProjectFiles(pattern, type, 'XSS_VULNERABILITY');
    });
  }

  // 6. HARDCODED PASSWORDS (Score: 567)
  scanHardcodedPasswords() {
    this.log('INFO', 'SCAN', 'Escaneando contraseñas hardcodeadas...');
    
    const patterns = [
      { pattern: /POSTGRES_PASSWORD\s*[=:]\s*["']?password["']?/gi, type: 'PostgreSQL Default Password' },
      { pattern: /PGADMIN_DEFAULT_PASSWORD\s*[=:]\s*["']?admin["']?/gi, type: 'PgAdmin Default Password' },
      { pattern: /GRAFANA_PASSWORD\s*[=:]\s*["']?admin["']?/gi, type: 'Grafana Default Password' },
      { pattern: /DATABASE_PASSWORD\s*[=:]\s*["']?password["']?/gi, type: 'Database Default Password' },
      { pattern: /admin123/gi, type: 'Common Weak Password' }
    ];

    patterns.forEach(({ pattern, type }) => {
      this.scanProjectFiles(pattern, type, 'HARDCODED_PASSWORDS');
    });
  }

  // 7. DOCKER VULNERABILITIES
  scanDockerVulnerabilities() {
    this.log('INFO', 'SCAN', 'Escaneando vulnerabilidades Docker...');
    
    const dockerFiles = [
      'backend/Dockerfile',
      'frontend/Dockerfile'
    ];

    dockerFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', '..', file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check Node.js version
        const nodeVersionMatch = content.match(/FROM\s+node:([^\s-]+)/);
        if (nodeVersionMatch) {
          const version = nodeVersionMatch[1];
          if (version !== '24.3.0') {
            this.log('HIGH', 'DOCKER_VULNERABILITY', 
              `Outdated Node.js version: ${version} (should be 24.3.0)`, file);
          }
        }

        // Check for root user
        if (!content.includes('USER ') || content.includes('USER root')) {
          this.log('MEDIUM', 'DOCKER_VULNERABILITY', 
            'Container running as root user', file);
        }
      }
    });
  }

  // 8. CONFIGURATION VULNERABILITIES
  scanConfigurationVulnerabilities() {
    this.log('INFO', 'SCAN', 'Escaneando vulnerabilidades de configuración...');
    
    const configFiles = [
      'docker-compose.yml',
      'docker-compose.dev.yml',
      'nginx.conf'
    ];

    configFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', '..', file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for default passwords in config
        if (content.includes(':-password') || content.includes(':-admin')) {
          this.log('HIGH', 'CONFIGURATION_VULNERABILITY', 
            'Default password fallback in configuration', file);
        }

        // Check for missing environment variables
        if (content.includes('${') && content.includes(':-')) {
          const matches = content.match(/\$\{[^}]*:-[^}]*\}/g);
          matches?.forEach(match => {
            if (match.includes('password') || match.includes('secret') || match.includes('token')) {
              this.log('MEDIUM', 'CONFIGURATION_VULNERABILITY', 
                `Insecure default value: ${match}`, file);
            }
          });
        }
      }
    });
  }

  // Helper function to scan directory recursively
  scanDirectory(dir, pattern, type, category) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory() && !this.isIgnoredDirectory(item)) {
        this.scanDirectory(itemPath, pattern, type, category);
      } else if (stat.isFile() && this.isScannableFile(item)) {
        this.scanFile(itemPath, pattern, type, category);
      }
    });
  }

  // Helper function to scan project files
  scanProjectFiles(pattern, type, category) {
    const projectRoot = path.join(__dirname, '..', '..');
    this.scanDirectory(projectRoot, pattern, type, category);
  }

  // Helper function to scan individual file
  scanFile(filePath, pattern, type, category) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const severity = this.getSeverityForCategory(category);
            const relativePath = path.relative(path.join(__dirname, '..', '..'), filePath);
            
            this.log(severity, category, 
              `${type} detected: ${match.substring(0, 50)}...`, 
              relativePath, 
              index + 1
            );
          });
        }
      });
    } catch (error) {
      // Ignore binary files or permission errors
    }
  }

  getSeverityForCategory(category) {
    const severityMap = {
      'HARDCODED_SECRETS': 'CRITICAL',
      'HARDCODED_CREDENTIALS': 'CRITICAL',
      'HARDCODED_PASSWORDS': 'HIGH',
      'XSS_VULNERABILITY': 'HIGH',
      'SSRF_VULNERABILITY': 'HIGH',
      'CLEARTEXT_TRANSMISSION': 'MEDIUM',
      'DOCKER_VULNERABILITY': 'HIGH',
      'CONFIGURATION_VULNERABILITY': 'MEDIUM'
    };
    
    return severityMap[category] || 'LOW';
  }

  isIgnoredDirectory(dirname) {
    const ignored = [
      'node_modules', '.git', '.next', 'dist', 'build', 'coverage',
      '.vscode', '.idea', 'logs', 'tmp', 'temp'
    ];
    return ignored.includes(dirname);
  }

  isScannableFile(filename) {
    const extensions = [
      '.js', '.ts', '.jsx', '.tsx', '.json', '.yml', '.yaml',
      '.env', '.md', '.sh', '.sql', '.conf', '.config'
    ];
    
    return extensions.some(ext => filename.endsWith(ext)) || 
           filename === 'Dockerfile' || 
           filename.startsWith('.env');
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🔒 COMPREHENSIVE SECURITY AUDIT REPORT');
    console.log('='.repeat(80));
    
    const total = this.critical.length + this.high.length + this.medium.length + this.low.length;
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`🔴 Critical Issues: ${this.critical.length}`);
    console.log(`🟠 High Issues: ${this.high.length}`);
    console.log(`🟡 Medium Issues: ${this.medium.length}`);
    console.log(`🔵 Low Issues: ${this.low.length}`);
    console.log(`📄 Total Issues: ${total}`);
    
    // Risk Score Calculation
    const riskScore = (this.critical.length * 10) + (this.high.length * 7) + 
                     (this.medium.length * 4) + (this.low.length * 1);
    
    console.log(`\n🎯 RISK SCORE: ${riskScore}/1000`);
    
    let riskLevel = 'LOW';
    if (riskScore > 100) riskLevel = 'CRITICAL';
    else if (riskScore > 50) riskLevel = 'HIGH';
    else if (riskScore > 20) riskLevel = 'MEDIUM';
    
    console.log(`🚨 RISK LEVEL: ${riskLevel}`);
    
    // Recommendations
    console.log(`\n💡 IMMEDIATE ACTIONS REQUIRED:`);
    
    if (this.critical.length > 0) {
      console.log(`🔴 Fix ${this.critical.length} CRITICAL vulnerabilities immediately`);
    }
    
    if (this.high.length > 0) {
      console.log(`🟠 Address ${this.high.length} HIGH vulnerabilities within 24 hours`);
    }
    
    console.log(`\n🛠️  RECOMMENDED COMMANDS:`);
    console.log(`   npm run security:generate    # Generate secure secrets`);
    console.log(`   npm run security:verify      # Verify fixes`);
    console.log(`   docker build --no-cache .    # Rebuild with latest security fixes`);
    
    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        critical: this.critical.length,
        high: this.high.length,
        medium: this.medium.length,
        low: this.low.length,
        total,
        riskScore,
        riskLevel
      },
      vulnerabilities: {
        critical: this.critical,
        high: this.high,
        medium: this.medium,
        low: this.low
      }
    };
    
    const reportPath = path.join(__dirname, '..', 'security-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📋 Detailed report saved: ${reportPath}`);
    
    return riskScore === 0;
  }

  // Main audit function
  async runComprehensiveAudit() {
    console.log('🔒 INICIANDO AUDITORÍA COMPREHENSIVA DE SEGURIDAD');
    console.log('================================================\n');

    this.scanHardcodedCredentials();
    this.scanHardcodedSecrets();
    this.scanHardcodedPasswords();
    this.scanCleartextTransmission();
    this.scanSSRFVulnerabilities();
    this.scanXSSVulnerabilities();
    this.scanDockerVulnerabilities();
    this.scanConfigurationVulnerabilities();

    return this.generateReport();
  }
}

// Auto-ejecutar si se llama directamente
if (require.main === module) {
  const audit = new ComprehensiveSecurityAudit();
  audit.runComprehensiveAudit().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Error ejecutando auditoría:', error);
    process.exit(1);
  });
}

module.exports = { ComprehensiveSecurityAudit }; 