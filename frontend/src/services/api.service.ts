import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Configuración del cliente API
class ApiService {
  private api: AxiosInstance;

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
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  // Métodos específicos para la API
  
  // Autenticación
  async login(credentials: { email: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  async register(userData: { email: string; name: string; password: string }) {
    return this.post('/auth/register', userData);
  }

  async getProfile() {
    return this.post('/auth/profile');
  }

  // Usuarios
  async getUsers() {
    return this.get('/users');
  }

  async getUserById(id: string) {
    return this.get(`/users/${id}`);
  }

  async createUser(userData: any) {
    return this.post('/users', userData);
  }

  async updateUser(id: string, userData: any) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id: string) {
    return this.delete(`/users/${id}`);
  }

  // Prospectos
  async getProspects() {
    return this.get('/prospects');
  }

  async getProspectById(id: string) {
    return this.get(`/prospects/${id}`);
  }

  async createProspect(prospectData: any) {
    return this.post('/prospects', prospectData);
  }

  async updateProspect(id: string, prospectData: any) {
    return this.put(`/prospects/${id}`, prospectData);
  }

  async deleteProspect(id: string) {
    return this.delete(`/prospects/${id}`);
  }

  async bulkCreateProspects(prospects: any[]) {
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

  async createTask(taskData: any) {
    return this.post('/tasks', taskData);
  }

  // IA
  async generateContent(prompt: string) {
    return this.post('/ai/generate', { prompt });
  }

  async analyzeText(text: string) {
    return this.post('/ai/analyze', { text });
  }

  // Configuraciones
  async getSettings() {
    return this.get('/settings');
  }

  async updateSetting(key: string, value: string) {
    return this.put(`/settings/${key}`, { value });
  }

  // Seguridad
  async runSecurityScan() {
    return this.post('/security/scan');
  }
}

export const apiService = new ApiService();
export default apiService; 