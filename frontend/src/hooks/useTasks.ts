import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskCategory, TaskType, TaskPriority } from '@prisma/client';

export interface TaskFilters {
  status?: TaskStatus[];
  category?: TaskCategory[];
  type?: TaskType[];
  priority?: TaskPriority[];
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  syncStatus?: 'synced' | 'pending' | 'error';
  searchTerm?: string;
}

export interface TaskCreateInput {
  subject: string;
  description?: string;
  category: TaskCategory;
  type: TaskType;
  priority?: TaskPriority;
  scheduledDate?: Date;
  scheduledTime?: string;
  contactEmail: string;
  contactName?: string;
  companyName?: string;
  leadId?: string;
  templateId?: string;
  customMessage?: string;
  estimatedDuration?: number;
}

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    hasMore: boolean;
  };
  filters: TaskFilters;
  selectedTasks: string[];
  
  // CRUD operations
  createTask: (data: TaskCreateInput) => Promise<Task>;
  updateTask: (id: string, data: Partial<TaskCreateInput>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  
  // Filtering and pagination
  setFilters: (filters: TaskFilters) => void;
  setPage: (page: number) => void;
  refreshTasks: () => Promise<void>;
  
  // Task selection
  selectTask: (id: string) => void;
  deselectTask: (id: string) => void;
  selectAllTasks: () => void;
  deselectAllTasks: () => void;
  
  // Actions
  approveTask: (id: string) => Promise<void>;
  rejectTask: (id: string, reason: string) => Promise<void>;
  syncToHubSpot: (id: string) => Promise<void>;
  bulkAction: (action: string, params?: unknown) => Promise<void>;
  
  // AI features
  generateAISuggestions: (data: TaskCreateInput) => Promise<any>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    hasMore: false
  });
  const [filters, setFilters] = useState<TaskFilters>({});
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Build query string from filters
  // const _buildQueryString = useCallback((currentFilters: TaskFilters, page: number) => {
    const params = new URLSearchParams();
    
    if (currentFilters.status) params.append('status', currentFilters.status.join(','));
    if (currentFilters.category) params.append('category', currentFilters.category.join(','));
    if (currentFilters.type) params.append('type', currentFilters.type.join(','));
    if (currentFilters.priority) params.append('priority', currentFilters.priority.join(','));
    if (currentFilters.assignedTo) params.append('assignedTo', currentFilters.assignedTo);
    if (currentFilters.dateFrom) params.append('dateFrom', currentFilters.dateFrom.toISOString());
    if (currentFilters.dateTo) params.append('dateTo', currentFilters.dateTo.toISOString());
    if (currentFilters.syncStatus) params.append('syncStatus', currentFilters.syncStatus);
    if (currentFilters.searchTerm) params.append('search', currentFilters.searchTerm);
    
    params.append('page', page.toString());
    params.append('limit', '20');
    
    return params.toString();
  }, []);

  // Fetch tasks
  // const _fetchTasks = useCallback(async (currentFilters: TaskFilters, page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryString = buildQueryString(currentFilters, page);
      const response = await fetch(`/api/tasks?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  // Load tasks when filters or page changes
  useEffect(() => {
    fetchTasks(filters, pagination.currentPage);
  }, [filters, pagination.currentPage]);

  // CRUD operations
  // const _createTask = async (data: TaskCreateInput): Promise<Task> => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh tasks to include the new one
        const queryString = buildQueryString(filters, pagination.currentPage);
        const refreshResponse = await fetch(`/api/tasks?${queryString}`);
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            setTasks(refreshData.data);
            setPagination(refreshData.pagination);
          }
        }
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create task');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // const _updateTask = async (id: string, data: Partial<TaskCreateInput>): Promise<Task> => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setTasks(prev => prev.map(task => task.id === id ? result.data : task));
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update task');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // const _deleteTask = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setTasks(prev => prev.filter(task => task.id !== id));
        setSelectedTasks(prev => prev.filter(taskId => taskId !== id));
      } else {
        throw new Error(result.error || 'Failed to delete task');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Actions
  // const _approveTask = async (id: string): Promise<void> => {
    try {
      const response = await fetch('/api/tasks/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve', taskId: id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, status: TaskStatus.APPROVED } : task
        ));
      } else {
        throw new Error(result.error || 'Failed to approve task');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // const _rejectTask = async (id: string, reason: string): Promise<void> => {
    try {
      const response = await fetch('/api/tasks/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject', taskId: id, reason }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, status: TaskStatus.REJECTED, rejectedReason: reason } : task
        ));
      } else {
        throw new Error(result.error || 'Failed to reject task');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // const _syncToHubSpot = async (id: string): Promise<void> => {
    try {
      const response = await fetch('/api/tasks/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'sync', taskId: id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, syncedToHubspot: true, syncedAt: new Date() } : task
        ));
      } else {
        throw new Error(result.error || 'Failed to sync to HubSpot');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // const _bulkAction = async (action: string, params?: unknown): Promise<void> => {
    try {
      const response = await fetch('/api/tasks/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'bulk', 
          taskIds: selectedTasks, 
          bulkAction: action,
          ...params 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh tasks to reflect changes
        const queryString = buildQueryString(filters, pagination.currentPage);
        const refreshResponse = await fetch(`/api/tasks?${queryString}`);
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            setTasks(refreshData.data);
            setPagination(refreshData.pagination);
          }
        }
        // Clear selection
        setSelectedTasks([]);
      } else {
        throw new Error(result.error || 'Failed to perform bulk action');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // const _generateAISuggestions = async (data: TaskCreateInput): Promise<any> => {
    try {
      const response = await fetch('/api/tasks/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to generate AI suggestions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Filtering and pagination
  // const _handleSetFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // const _setPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // const _refreshTasks = useCallback(async () => {
    const queryString = buildQueryString(filters, pagination.currentPage);
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tasks?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [buildQueryString, filters, pagination.currentPage]);

  // Task selection
  // const _selectTask = (id: string) => {
    setSelectedTasks(prev => [...prev, id]);
  };

  // const _deselectTask = (id: string) => {
    setSelectedTasks(prev => prev.filter(taskId => taskId !== id));
  };

  // const _selectAllTasks = () => {
    setSelectedTasks(tasks.map(task => task.id));
  };

  // const _deselectAllTasks = () => {
    setSelectedTasks([]);
  };

  return {
    tasks,
    loading,
    error,
    pagination,
    filters,
    selectedTasks,
    
    // CRUD operations
    createTask,
    updateTask,
    deleteTask,
    
    // Filtering and pagination
    setFilters: handleSetFilters,
    setPage,
    refreshTasks,
    
    // Task selection
    selectTask,
    deselectTask,
    selectAllTasks,
    deselectAllTasks,
    
    // Actions
    approveTask,
    rejectTask,
    syncToHubSpot,
    bulkAction,
    
    // AI features
    generateAISuggestions,
  };
}; 