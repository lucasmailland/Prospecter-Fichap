import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas personalizadas
const errorRate = new Rate('errors');

// Configuración del test
export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up
    { duration: '5m', target: 10 },  // Mantener carga
    { duration: '2m', target: 20 },  // Aumentar carga
    { duration: '5m', target: 20 },  // Mantener carga alta
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de requests deben completarse en menos de 500ms
    http_req_failed: ['rate<0.1'],    // Menos del 10% de errores
    errors: ['rate<0.1'],
  },
};

// Variables de entorno
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Función de setup (se ejecuta una vez al inicio)
export function setup() {
  // Aquí podrías hacer setup inicial como crear datos de prueba
  console.log('Iniciando test de performance en:', BASE_URL);
  return { baseUrl: BASE_URL };
}

// Función principal del test
export default function(data) {
  const baseUrl = data.baseUrl;
  
  // Grupo de tests para endpoints principales
  const responses = {
    health: http.get(`${baseUrl}/health`),
    api: http.get(`${baseUrl}/api/prospects`),
    metrics: http.get(`${baseUrl}/metrics`),
  };

  // Verificar health check
  check(responses.health, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 100ms': (r) => r.timings.duration < 100,
  });

  // Verificar API endpoint
  check(responses.api, {
    'api status is 200': (r) => r.status === 200,
    'api response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Verificar métricas
  check(responses.metrics, {
    'metrics status is 200': (r) => r.status === 200,
    'metrics response time < 200ms': (r) => r.timings.duration < 200,
  });

  // Registrar errores
  errorRate.add(responses.health.status !== 200);
  errorRate.add(responses.api.status !== 200);
  errorRate.add(responses.metrics.status !== 200);

  // Simular tiempo de think entre requests
  sleep(1);
}

// Función de teardown (se ejecuta al final)
export function teardown(data) {
  console.log('Test de performance completado');
}

// Función para manejar errores
export function handleSummary(data) {
  return {
    'performance-results.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
} 