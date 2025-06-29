-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  is_blocked BOOLEAN DEFAULT FALSE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  last_password_change TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  blocked_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Crear índices para usuarios
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Crear tabla de leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  company VARCHAR(255),
  position VARCHAR(255),
  phone VARCHAR(50),
  linkedin_url VARCHAR(500),
  website VARCHAR(500),
  industry VARCHAR(100),
  location VARCHAR(255),
  score INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'new',
  enriched_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Crear tabla de logs de enriquecimiento
CREATE TABLE IF NOT EXISTS enrichment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  data JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para logs de enriquecimiento
CREATE INDEX IF NOT EXISTS idx_enrichment_logs_lead_id ON enrichment_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_enrichment_logs_provider ON enrichment_logs(provider);
CREATE INDEX IF NOT EXISTS idx_enrichment_logs_status ON enrichment_logs(status);

-- Crear tabla de logs de seguridad
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  risk_level VARCHAR(20) DEFAULT 'low',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para logs de seguridad
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_risk_level ON security_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);

-- Crear tabla de reportes de pentesting
CREATE TABLE IF NOT EXISTS pentest_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target VARCHAR(255) NOT NULL,
  scan_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  risk_score INTEGER,
  vulnerabilities JSONB,
  recommendations JSONB,
  scan_duration INTEGER,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para reportes de pentesting
CREATE INDEX IF NOT EXISTS idx_pentest_reports_target ON pentest_reports(target);
CREATE INDEX IF NOT EXISTS idx_pentest_reports_status ON pentest_reports(status);
CREATE INDEX IF NOT EXISTS idx_pentest_reports_risk_score ON pentest_reports(risk_score);
CREATE INDEX IF NOT EXISTS idx_pentest_reports_created_at ON pentest_reports(created_at); 