const axios = require('axios');

// Mock axios
jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

const { ApiService } = require('./api.service.js');

describe('ApiService', () => {
  let apiService;
  let mockAxios;

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Crear instancia del servicio
    apiService = new ApiService();
    mockAxios = axios.create();
    
    // Mock de la instancia axios
    axios.create.mockReturnValue(mockAxios);
    
    // Mock de los interceptores
    mockAxios.interceptors = {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    };
    
    // Recrear la instancia después de mockear axios
    apiService = new ApiService();
  });

  describe('Constructor', () => {
    test('should create axios instance with correct config', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:4000/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    test('should set up request interceptor', () => {
      expect(mockAxios.interceptors.request.use).toHaveBeenCalled();
    });

    test('should set up response interceptor', () => {
      expect(mockAxios.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('Request Interceptor', () => {
    test('should add authorization header when token exists', () => {
      localStorage.getItem.mockReturnValue('test-token');
      
      const config = { headers: {} };
      const requestInterceptor = mockAxios.interceptors.request.use.mock.calls[0][0];
      
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    test('should not add authorization header when no token', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const config = { headers: {} };
      const requestInterceptor = mockAxios.interceptors.request.use.mock.calls[0][0];
      
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });

    test('should handle request interceptor error', () => {
      const error = new Error('Request error');
      const errorInterceptor = mockAxios.interceptors.request.use.mock.calls[0][1];
      
      expect(errorInterceptor(error)).rejects.toThrow('Request error');
    });
  });

  describe('Response Interceptor', () => {
    test('should handle 401 error by clearing token and redirecting', () => {
      const error = {
        response: { status: 401 }
      };
      const responseInterceptor = mockAxios.interceptors.response.use.mock.calls[0][1];
      
      responseInterceptor(error);
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token');
      expect(window.location.href).toBe('/auth/signin');
    });

    test('should not handle non-401 errors', () => {
      const error = {
        response: { status: 500 }
      };
      const responseInterceptor = mockAxios.interceptors.response.use.mock.calls[0][1];
      
      expect(responseInterceptor(error)).rejects.toEqual(error);
    });

    test('should pass through successful responses', () => {
      const response = { data: 'success' };
      const successInterceptor = mockAxios.interceptors.response.use.mock.calls[0][0];
      
      const result = successInterceptor(response);
      
      expect(result).toEqual(response);
    });
  });

  describe('HTTP Methods', () => {
    beforeEach(() => {
      // Mock de los métodos HTTP
      mockAxios.get = jest.fn();
      mockAxios.post = jest.fn();
      mockAxios.put = jest.fn();
      mockAxios.delete = jest.fn();
    });

    describe('GET', () => {
      test('should make GET request and return data', async () => {
        const mockResponse = { data: { id: 1, name: 'Test' } };
        mockAxios.get.mockResolvedValue(mockResponse);
        
        const result = await apiService.get('/test');
        
        expect(mockAxios.get).toHaveBeenCalledWith('/test', undefined);
        expect(result).toEqual({ id: 1, name: 'Test' });
      });

      test('should pass config to GET request', async () => {
        const config = { params: { id: 1 } };
        const mockResponse = { data: { id: 1 } };
        mockAxios.get.mockResolvedValue(mockResponse);
        
        await apiService.get('/test', config);
        
        expect(mockAxios.get).toHaveBeenCalledWith('/test', config);
      });
    });

    describe('POST', () => {
      test('should make POST request and return data', async () => {
        const data = { name: 'Test' };
        const mockResponse = { data: { id: 1, name: 'Test' } };
        mockAxios.post.mockResolvedValue(mockResponse);
        
        const result = await apiService.post('/test', data);
        
        expect(mockAxios.post).toHaveBeenCalledWith('/test', data, undefined);
        expect(result).toEqual({ id: 1, name: 'Test' });
      });

      test('should pass config to POST request', async () => {
        const data = { name: 'Test' };
        const config = { headers: { 'Custom-Header': 'value' } };
        const mockResponse = { data: { id: 1 } };
        mockAxios.post.mockResolvedValue(mockResponse);
        
        await apiService.post('/test', data, config);
        
        expect(mockAxios.post).toHaveBeenCalledWith('/test', data, config);
      });
    });

    describe('PUT', () => {
      test('should make PUT request and return data', async () => {
        const data = { name: 'Updated' };
        const mockResponse = { data: { id: 1, name: 'Updated' } };
        mockAxios.put.mockResolvedValue(mockResponse);
        
        const result = await apiService.put('/test', data);
        
        expect(mockAxios.put).toHaveBeenCalledWith('/test', data, undefined);
        expect(result).toEqual({ id: 1, name: 'Updated' });
      });
    });

    describe('DELETE', () => {
      test('should make DELETE request and return data', async () => {
        const mockResponse = { data: { success: true } };
        mockAxios.delete.mockResolvedValue(mockResponse);
        
        const result = await apiService.delete('/test');
        
        expect(mockAxios.delete).toHaveBeenCalledWith('/test', undefined);
        expect(result).toEqual({ success: true });
      });
    });
  });

  describe('Authentication Methods', () => {
    beforeEach(() => {
      mockAxios.post = jest.fn();
    });

    test('should login with credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockResponse = { data: { token: 'test-token' } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.login(credentials);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual({ token: 'test-token' });
    });

    test('should register user', async () => {
      const userData = { email: 'test@example.com', name: 'Test User', password: 'password' };
      const mockResponse = { data: { id: 1, email: 'test@example.com' } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.register(userData);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    test('should get profile', async () => {
      const mockResponse = { data: { id: 1, name: 'Test User' } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.getProfile();
      
      expect(mockAxios.post).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual({ id: 1, name: 'Test User' });
    });
  });

  describe('User Methods', () => {
    beforeEach(() => {
      mockAxios.get = jest.fn();
      mockAxios.post = jest.fn();
      mockAxios.put = jest.fn();
      mockAxios.delete = jest.fn();
    });

    test('should get users', async () => {
      const mockResponse = { data: [{ id: 1, name: 'User 1' }] };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getUsers();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual([{ id: 1, name: 'User 1' }]);
    });

    test('should get user by id', async () => {
      const mockResponse = { data: { id: 1, name: 'User 1' } };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getUserById('1');
      
      expect(mockAxios.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual({ id: 1, name: 'User 1' });
    });

    test('should create user', async () => {
      const userData = { name: 'New User', email: 'new@example.com' };
      const mockResponse = { data: { id: 2, ...userData } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.createUser(userData);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/users', userData);
      expect(result).toEqual({ id: 2, ...userData });
    });

    test('should update user', async () => {
      const userData = { name: 'Updated User' };
      const mockResponse = { data: { id: 1, ...userData } };
      mockAxios.put.mockResolvedValue(mockResponse);
      
      const result = await apiService.updateUser('1', userData);
      
      expect(mockAxios.put).toHaveBeenCalledWith('/users/1', userData);
      expect(result).toEqual({ id: 1, ...userData });
    });

    test('should delete user', async () => {
      const mockResponse = { data: { success: true } };
      mockAxios.delete.mockResolvedValue(mockResponse);
      
      const result = await apiService.deleteUser('1');
      
      expect(mockAxios.delete).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual({ success: true });
    });
  });

  describe('Prospect Methods', () => {
    beforeEach(() => {
      mockAxios.get = jest.fn();
      mockAxios.post = jest.fn();
      mockAxios.put = jest.fn();
      mockAxios.delete = jest.fn();
    });

    test('should get prospects', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Prospect 1' }] };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getProspects();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/prospects');
      expect(result).toEqual([{ id: 1, name: 'Prospect 1' }]);
    });

    test('should get prospect by id', async () => {
      const mockResponse = { data: { id: 1, name: 'Prospect 1' } };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getProspectById('1');
      
      expect(mockAxios.get).toHaveBeenCalledWith('/prospects/1');
      expect(result).toEqual({ id: 1, name: 'Prospect 1' });
    });

    test('should create prospect', async () => {
      const prospectData = { name: 'New Prospect', email: 'prospect@example.com' };
      const mockResponse = { data: { id: 2, ...prospectData } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.createProspect(prospectData);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/prospects', prospectData);
      expect(result).toEqual({ id: 2, ...prospectData });
    });

    test('should update prospect', async () => {
      const prospectData = { name: 'Updated Prospect' };
      const mockResponse = { data: { id: 1, ...prospectData } };
      mockAxios.put.mockResolvedValue(mockResponse);
      
      const result = await apiService.updateProspect('1', prospectData);
      
      expect(mockAxios.put).toHaveBeenCalledWith('/prospects/1', prospectData);
      expect(result).toEqual({ id: 1, ...prospectData });
    });

    test('should delete prospect', async () => {
      const mockResponse = { data: { success: true } };
      mockAxios.delete.mockResolvedValue(mockResponse);
      
      const result = await apiService.deleteProspect('1');
      
      expect(mockAxios.delete).toHaveBeenCalledWith('/prospects/1');
      expect(result).toEqual({ success: true });
    });

    test('should bulk create prospects', async () => {
      const prospects = [{ name: 'Prospect 1' }, { name: 'Prospect 2' }];
      const mockResponse = { data: { created: 2 } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.bulkCreateProspects(prospects);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/prospects/bulk', prospects);
      expect(result).toEqual({ created: 2 });
    });
  });

  describe('HubSpot Methods', () => {
    beforeEach(() => {
      mockAxios.get = jest.fn();
      mockAxios.post = jest.fn();
    });

    test('should get HubSpot contacts', async () => {
      const mockResponse = { data: [{ id: 1, email: 'contact@example.com' }] };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getHubSpotContacts();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/hubspot/contacts');
      expect(result).toEqual([{ id: 1, email: 'contact@example.com' }]);
    });

    test('should sync HubSpot', async () => {
      const mockResponse = { data: { synced: 10 } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.syncHubSpot();
      
      expect(mockAxios.post).toHaveBeenCalledWith('/hubspot/sync');
      expect(result).toEqual({ synced: 10 });
    });
  });

  describe('Task Methods', () => {
    beforeEach(() => {
      mockAxios.get = jest.fn();
      mockAxios.post = jest.fn();
    });

    test('should get tasks', async () => {
      const mockResponse = { data: [{ id: 1, title: 'Task 1' }] };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getTasks();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/tasks');
      expect(result).toEqual([{ id: 1, title: 'Task 1' }]);
    });

    test('should create task', async () => {
      const taskData = { title: 'New Task', description: 'Task description' };
      const mockResponse = { data: { id: 2, ...taskData } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.createTask(taskData);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/tasks', taskData);
      expect(result).toEqual({ id: 2, ...taskData });
    });
  });

  describe('AI Methods', () => {
    beforeEach(() => {
      mockAxios.post = jest.fn();
    });

    test('should generate content', async () => {
      const prompt = 'Write a blog post about AI';
      const mockResponse = { data: { content: 'Generated content...' } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.generateContent(prompt);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/ai/generate', { prompt });
      expect(result).toEqual({ content: 'Generated content...' });
    });

    test('should analyze text', async () => {
      const text = 'Sample text to analyze';
      const mockResponse = { data: { sentiment: 'positive' } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.analyzeText(text);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/ai/analyze', { text });
      expect(result).toEqual({ sentiment: 'positive' });
    });
  });

  describe('Settings Methods', () => {
    beforeEach(() => {
      mockAxios.get = jest.fn();
      mockAxios.put = jest.fn();
    });

    test('should get settings', async () => {
      const mockResponse = { data: { theme: 'dark', language: 'en' } };
      mockAxios.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getSettings();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/settings');
      expect(result).toEqual({ theme: 'dark', language: 'en' });
    });

    test('should update setting', async () => {
      const mockResponse = { data: { success: true } };
      mockAxios.put.mockResolvedValue(mockResponse);
      
      const result = await apiService.updateSetting('theme', 'light');
      
      expect(mockAxios.put).toHaveBeenCalledWith('/settings/theme', { value: 'light' });
      expect(result).toEqual({ success: true });
    });
  });

  describe('Security Methods', () => {
    beforeEach(() => {
      mockAxios.post = jest.fn();
    });

    test('should run security scan', async () => {
      const mockResponse = { data: { vulnerabilities: 0, status: 'secure' } };
      mockAxios.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.runSecurityScan();
      
      expect(mockAxios.post).toHaveBeenCalledWith('/security/scan');
      expect(result).toEqual({ vulnerabilities: 0, status: 'secure' });
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockAxios.get.mockRejectedValue(networkError);
      
      await expect(apiService.get('/test')).rejects.toThrow('Network Error');
    });

    test('should handle API errors', async () => {
      const apiError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      };
      mockAxios.get.mockRejectedValue(apiError);
      
      await expect(apiService.get('/test')).rejects.toEqual(apiError);
    });
  });
}); 