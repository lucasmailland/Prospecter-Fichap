const axios = require('axios');

// Configuración del cliente API
class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autenticación
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejo de errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Limpiar token si es inválido
          localStorage.removeItem('auth-token');
          window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos HTTP básicos
  async get(url, config) {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.api.delete(url, config);
    return response.data;
  }

  // Métodos específicos para la API
  
  // Autenticación
  async login(credentials) {
    return this.post('/auth/login', credentials);
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async getProfile() {
    return this.post('/auth/profile');
  }

  // Usuarios
  async getUsers() {
    return this.get('/users');
  }

  async getUserById(id) {
    return this.get(`/users/${id}`);
  }

  async createUser(userData) {
    return this.post('/users', userData);
  }

  async updateUser(id, userData) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  }

  // Prospectos
  async getProspects() {
    return this.get('/prospects');
  }

  async getProspectById(id) {
    return this.get(`/prospects/${id}`);
  }

  async createProspect(prospectData) {
    return this.post('/prospects', prospectData);
  }

  async updateProspect(id, prospectData) {
    return this.put(`/prospects/${id}`, prospectData);
  }

  async deleteProspect(id) {
    return this.delete(`/prospects/${id}`);
  }

  async bulkCreateProspects(prospects) {
    return this.post('/prospects/bulk', prospects);
  }

  // HubSpot
  async getHubSpotContacts() {
    return this.get('/hubspot/contacts');
  }

  async syncHubSpot() {
    return this.post('/hubspot/sync');
  }

  // Tareas
  async getTasks() {
    return this.get('/tasks');
  }

  async createTask(taskData) {
    return this.post('/tasks', taskData);
  }

  // IA
  async generateContent(prompt) {
    return this.post('/ai/generate', { prompt });
  }

  async analyzeText(text) {
    return this.post('/ai/analyze', { text });
  }

  // Configuraciones
  async getSettings() {
    return this.get('/settings');
  }

  async updateSetting(key, value) {
    return this.put(`/settings/${key}`, { value });
  }

  // Seguridad
  async runSecurityScan() {
    return this.post('/security/scan');
  }
}

module.exports = { ApiService }; 