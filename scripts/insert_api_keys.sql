-- OpenAI
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'OPENAI_API_KEY', '', 'STRING', 'Clave API de OpenAI', 'AI', true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'OPENAI_API_KEY');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'OPENAI_MODEL', 'gpt-4o', 'STRING', 'Modelo de OpenAI', 'AI', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'OPENAI_MODEL');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'OPENAI_TEMPERATURE', '0.7', 'NUMBER', 'Temperatura de OpenAI', 'AI', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'OPENAI_TEMPERATURE');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'OPENAI_MAX_TOKENS', '1000', 'NUMBER', 'Máximo de tokens OpenAI', 'AI', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'OPENAI_MAX_TOKENS');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'OPENAI_IS_ACTIVE', 'true', 'BOOLEAN', 'OpenAI activo', 'AI', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'OPENAI_IS_ACTIVE');
-- HubSpot
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'HUBSPOT_API_KEY', '', 'STRING', 'Clave API de HubSpot', 'HUBSPOT', true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'HUBSPOT_API_KEY');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'HUBSPOT_ENV', 'production', 'STRING', 'Ambiente HubSpot', 'HUBSPOT', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'HUBSPOT_ENV');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'HUBSPOT_ACCOUNT_NAME', '', 'STRING', 'Nombre de cuenta HubSpot', 'HUBSPOT', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'HUBSPOT_ACCOUNT_NAME');
-- Clearbit
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'CLEARBIT_API_KEY', '', 'STRING', 'Clave API de Clearbit', 'CLEARBIT', true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'CLEARBIT_API_KEY');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'CLEARBIT_NAME', '', 'STRING', 'Nombre de integración Clearbit', 'CLEARBIT', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'CLEARBIT_NAME');
-- Hunter.io
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'HUNTERIO_API_KEY', '', 'STRING', 'Clave API de Hunter.io', 'HUNTERIO', true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'HUNTERIO_API_KEY');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'HUNTERIO_NAME', '', 'STRING', 'Nombre de integración Hunter.io', 'HUNTERIO', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'HUNTERIO_NAME');
-- MailboxLayer
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'MAILBOXLAYER_API_KEY', '', 'STRING', 'Clave API de MailboxLayer', 'MAILBOXLAYER', true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'MAILBOXLAYER_API_KEY');
INSERT INTO system_configuration (id, key, value, type, description, category, "isEncrypted", "isEditable", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'MAILBOXLAYER_NAME', '', 'STRING', 'Nombre de integración MailboxLayer', 'MAILBOXLAYER', false, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE key = 'MAILBOXLAYER_NAME'); 