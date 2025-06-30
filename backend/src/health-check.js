const https = require('https');
const http = require('http');

// Determine if we should use HTTPS or HTTP based on environment
const useHttps = process.env.NODE_ENV === 'production' || process.env.USE_HTTPS === 'true';
const protocol = useHttps ? https : http;
const defaultPort = useHttps ? 443 : (process.env.PORT || 3000);

const options = {
  host: 'localhost',
  port: process.env.HEALTH_CHECK_PORT || defaultPort,
  path: '/health',
  timeout: 2000,
  method: 'GET',
  // For HTTPS, accept self-signed certificates in development
  rejectUnauthorized: process.env.NODE_ENV === 'production'
};

console.log(`Starting health check using ${useHttps ? 'HTTPS' : 'HTTP'} on port ${options.port}`);

const request = protocol.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Health check status: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ Health check passed');
      process.exit(0);
    } else {
      console.error(`❌ Health check failed with status: ${res.statusCode}`);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

request.on('error', (err) => {
  console.error('❌ Health check request failed:', err.message);
  
  // If HTTPS fails and we're in development, try HTTP as fallback
  if (useHttps && process.env.NODE_ENV !== 'production') {
    console.log('🔄 Attempting fallback to HTTP...');
    
    const httpOptions = { ...options };
    const httpRequest = http.request(httpOptions, (res) => {
      console.log(`Health check status (HTTP fallback): ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log('✅ Health check passed (HTTP fallback)');
        process.exit(0);
      } else {
        console.error(`❌ Health check failed with status: ${res.statusCode}`);
        process.exit(1);
      }
    });
    
    httpRequest.on('error', (httpErr) => {
      console.error('❌ HTTP fallback also failed:', httpErr.message);
      process.exit(1);
    });
    
    httpRequest.on('timeout', () => {
      console.error('❌ HTTP fallback timeout');
      httpRequest.destroy();
      process.exit(1);
    });
    
    httpRequest.setTimeout(options.timeout);
    httpRequest.end();
    return;
  }
  
  process.exit(1);
});

request.on('timeout', () => {
  console.error('❌ Health check timeout');
  request.destroy();
  process.exit(1);
});

// Set timeout
request.setTimeout(options.timeout);

request.end(); 