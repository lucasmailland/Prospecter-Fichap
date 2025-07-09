# 🎯 TASK MANAGEMENT - PRÓXIMOS PASOS

## 📋 **ESTADO ACTUAL**

### ✅ **YA IMPLEMENTADO**
- **Modelos de base de datos**: 8 modelos completos
- **Servicio backend**: TaskManagementService con 30+ métodos
- **API endpoints**: 4 endpoints principales
- **Hook personalizado**: useTasks con todas las operaciones
- **Página principal**: Dashboard completo con tabla
- **Navegación**: Enlace agregado al menú

### 🔄 **PENDIENTE DE IMPLEMENTAR**
- **Modales completos**: Crear, editar, detalles, AI assistant
- **Integración OpenAI**: Reemplazar mock con API real
- **Sincronización HubSpot**: Implementar API real
- **Vista calendario**: Visualización de tareas programadas
- **Sistema de plantillas**: Templates reutilizables
- **A/B testing UI**: Interface para pruebas A/B
- **Analytics dashboard**: Métricas visuales

---

## 🚀 **FASE 1: COMPLETAR MODALES (Esta semana)**

### **1. Modal de Creación de Tareas**
```typescript
// src/components/tasks/CreateTaskModal.tsx
interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (data: TaskCreateInput) => Promise<Task>;
  onGenerateAI: (data: TaskCreateInput) => Promise<any>;
}

// Características:
- Formulario completo con validación
- Selector de tipo y categoría
- Botón "Generate with AI" prominente
- Preview de contenido generado
- Scheduling inteligente sugerido
- Selector de prioridad
- Campo de contacto con autocompletado
```

### **2. Modal de Detalles/Edición**
```typescript
// src/components/tasks/TaskDetailModal.tsx
interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<TaskCreateInput>) => Promise<Task>;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

// Características:
- Vista completa de la tarea
- Edición inline de campos
- Botones de acción (Approve/Reject)
- Timeline de cambios
- AI score con explicación
- Attachments si los hay
```

### **3. Panel de AI Assistant**
```typescript
// src/components/tasks/AIAssistantPanel.tsx
interface AIAssistantPanelProps {
  onClose: () => void;
  tasks: Task[];
  onGenerateSuggestions: (data: TaskCreateInput) => Promise<any>;
}

// Características:
- Chat interface con IA
- Sugerencias de optimización
- Bulk AI generation
- Performance insights
- Best practices recommendations
```

### **Código Base para Modales**
```typescript
// src/components/tasks/CreateTaskModal.tsx
import { useState } from 'react';
import { TaskCategory, TaskType, TaskPriority } from '@prisma/client';

export const CreateTaskModal = ({ onClose, onCreate, onGenerateAI }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: TaskCategory.PROSPECTING,
    type: TaskType.EMAIL,
    priority: TaskPriority.MEDIUM,
    contactEmail: '',
    contactName: '',
    companyName: '',
    customMessage: ''
  });

  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleGenerateAI = async () => {
    setLoadingAI(true);
    try {
      const suggestions = await onGenerateAI(formData);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreate(formData);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Crear Nueva Tarea</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* AI Generation Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={loadingAI}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              {loadingAI ? 'Generando...' : '🧠 Generar con IA'}
            </button>
          </div>

          {/* AI Suggestions Display */}
          {aiSuggestions && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Sugerencias de IA</h3>
              <div className="space-y-2">
                <div>
                  <strong>Email:</strong>
                  <div className="text-sm text-gray-700 mt-1">
                    {aiSuggestions.emailTemplate}
                  </div>
                </div>
                <div>
                  <strong>Mejor momento:</strong> {aiSuggestions.bestDay} a las {aiSuggestions.bestTime}
                </div>
                <div>
                  <strong>Probabilidad de éxito:</strong> {Math.round(aiSuggestions.successProbability * 100)}%
                </div>
              </div>
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

## 🔗 **FASE 2: INTEGRACIONES REALES (Próximas 2 semanas)**

### **1. Integración OpenAI**
```typescript
// src/services/openai-task.service.ts
import OpenAI from 'openai';

export class OpenAITaskService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateTaskContent(context: any): Promise<any> {
    const prompt = `
      Genera contenido para una tarea de ${context.type} dirigida a ${context.contactName} de ${context.companyName}.
      
      Contexto:
      - Tipo: ${context.type}
      - Categoría: ${context.category}
      - Asunto: ${context.subject}
      - Historial: ${context.leadContext || 'Primera interacción'}
      
      Genera:
      1. Email personalizado (máximo 150 palabras)
      2. Script de llamada (5 puntos clave)
      3. Comentario para CRM
      4. Mejor día de la semana para contactar
      5. Mejor hora del día
      6. Probabilidad de éxito (0-1)
      7. Razón de la probabilidad
      
      Responde en JSON con esta estructura:
      {
        "subject": "string",
        "emailTemplate": "string",
        "callScript": "string",
        "comment": "string",
        "bestDay": "string",
        "bestTime": "string",
        "successProbability": number,
        "reasoning": "string"
      }
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content);
  }
}
```

### **2. Sincronización HubSpot Real**
```typescript
// src/services/hubspot-task-sync.service.ts
import { HubSpotService } from './hubspot.service';

export class HubSpotTaskSyncService {
  private hubspot: HubSpotService;

  constructor() {
    this.hubspot = new HubSpotService();
  }

  async syncTaskToHubSpot(task: Task): Promise<string> {
    try {
      // Create task in HubSpot
      const hubspotTask = await this.hubspot.createTask({
        subject: task.subject,
        body: task.aiGeneratedComment || task.customMessage,
        type: this.mapTaskType(task.type),
        priority: this.mapPriority(task.priority),
        timestamp: task.scheduledDate?.getTime(),
        forObjectType: 'CONTACT',
        forObjectId: await this.findHubSpotContactId(task.contactEmail),
        taskType: this.mapTaskType(task.type),
        status: 'NOT_STARTED'
      });

      // Update local task
      await prisma.task.update({
        where: { id: task.id },
        data: {
          hubspotTaskId: hubspotTask.id,
          syncedToHubspot: true,
          syncedAt: new Date()
        }
      });

      return hubspotTask.id;
    } catch (error) {
      // Log error and update task
      await prisma.task.update({
        where: { id: task.id },
        data: {
          syncError: error.message
        }
      });
      throw error;
    }
  }

  private mapTaskType(type: TaskType): string {
    const mapping = {
      EMAIL: 'EMAIL',
      CALL: 'CALL',
      MEETING: 'MEETING',
      FOLLOW_UP: 'CALL',
      LINKEDIN_MESSAGE: 'EMAIL'
    };
    return mapping[type] || 'CALL';
  }

  private mapPriority(priority: TaskPriority): string {
    const mapping = {
      LOW: 'LOW',
      MEDIUM: 'MEDIUM',
      HIGH: 'HIGH',
      URGENT: 'HIGH',
      CRITICAL: 'HIGH'
    };
    return mapping[priority] || 'MEDIUM';
  }

  private async findHubSpotContactId(email: string): Promise<string> {
    const contact = await this.hubspot.getContactByEmail(email);
    if (!contact) {
      // Create contact if doesn't exist
      const newContact = await this.hubspot.createContact({
        email,
        properties: { email }
      });
      return newContact.id;
    }
    return contact.id;
  }
}
```

---

## 📅 **FASE 3: FEATURES AVANZADAS (Próximo mes)**

### **1. Vista de Calendario**
```typescript
// src/components/tasks/TaskCalendar.tsx
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

export const TaskCalendar = ({ tasks, onSelectTask }) => {
  const events = tasks.map(task => ({
    id: task.id,
    title: task.subject,
    start: new Date(task.scheduledDate),
    end: new Date(task.scheduledDate + (task.estimatedDuration * 60000)),
    resource: task
  }));

  return (
    <div className="h-96">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectTask}
        views={['month', 'week', 'day']}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
};
```

### **2. Sistema de Plantillas**
```typescript
// src/components/tasks/TaskTemplates.tsx
export const TaskTemplates = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);

  const defaultTemplates = [
    {
      name: 'Prospecting Cold Email',
      category: 'PROSPECTING',
      type: 'EMAIL',
      subject: 'Quick question about {{companyName}}',
      emailTemplate: 'Hi {{contactName}},\n\nI noticed...',
      callScript: '1. Warm introduction\n2. Mention specific company insight...'
    },
    {
      name: 'Follow-up Call',
      category: 'FOLLOW_UP',
      type: 'CALL',
      subject: 'Follow-up call - {{companyName}}',
      callScript: '1. Reference previous conversation\n2. Ask about progress...'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {defaultTemplates.map(template => (
        <div key={template.name} className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {template.type}
            </span>
            <button
              onClick={() => onSelectTemplate(template)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Usar Template
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### **3. A/B Testing UI**
```typescript
// src/components/tasks/ABTestManager.tsx
export const ABTestManager = () => {
  const [tests, setTests] = useState([]);
  const [showCreateTest, setShowCreateTest] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">A/B Tests</h2>
        <button
          onClick={() => setShowCreateTest(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Crear Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map(test => (
          <div key={test.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900">{test.name}</h3>
              <span className={`px-2 py-1 text-xs rounded ${
                test.status === 'RUNNING' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {test.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Variant A</span>
                  <span>{test.variantAConversions}/{test.variantASent}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(test.variantAConversions/test.variantASent)*100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Variant B</span>
                  <span>{test.variantBConversions}/{test.variantBSent}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(test.variantBConversions/test.variantBSent)*100}%` }}
                  ></div>
                </div>
              </div>

              {test.winningVariant && (
                <div className="text-center text-sm font-medium text-green-600">
                  Winner: Variant {test.winningVariant}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 📊 **FASE 4: ANALYTICS DASHBOARD (Siguiente mes)**

### **1. Dashboard de Métricas**
```typescript
// src/components/tasks/TaskAnalytics.tsx
export const TaskAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState('30d');

  const fetchAnalytics = async () => {
    const response = await fetch(`/api/tasks/analytics?dateRange=${dateRange}`);
    const data = await response.json();
    setAnalytics(data.data);
  };

  const charts = [
    {
      title: 'Conversion Rate by Task Type',
      type: 'bar',
      data: analytics?.conversionByType || []
    },
    {
      title: 'Performance Over Time',
      type: 'line',
      data: analytics?.performanceOverTime || []
    },
    {
      title: 'AI Success Rate',
      type: 'gauge',
      data: analytics?.aiSuccessRate || 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics?.totalTasks || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold text-green-600">
            {analytics?.conversionRate ? `${(analytics.conversionRate * 100).toFixed(1)}%` : '0%'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
          <p className="text-2xl font-bold text-blue-600">
            {analytics?.avgResponseTime ? `${analytics.avgResponseTime.toFixed(1)}h` : '0h'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Revenue Generated</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${analytics?.totalRevenue?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map(chart => (
          <div key={chart.title} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{chart.title}</h3>
            {/* Chart component would go here */}
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart: {chart.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎯 **CRONOGRAMA DE IMPLEMENTACIÓN**

### **Semana 1**
- [ ] Implementar CreateTaskModal completo
- [ ] Implementar TaskDetailModal
- [ ] Implementar AIAssistantPanel básico
- [ ] Testing de modales

### **Semana 2**
- [ ] Integración OpenAI real
- [ ] Sincronización HubSpot real
- [ ] Webhooks para updates
- [ ] Testing de integraciones

### **Semana 3**
- [ ] Vista de calendario
- [ ] Sistema de plantillas
- [ ] A/B testing UI
- [ ] Performance optimization

### **Semana 4**
- [ ] Analytics dashboard
- [ ] Reportes avanzados
- [ ] Mobile optimization
- [ ] Documentation completa

---

## 🏆 **RESULTADO ESPERADO**

Al completar estas fases tendrás:

✅ **Sistema 100% funcional** con todas las características
✅ **Integraciones reales** con OpenAI y HubSpot
✅ **UI/UX completa** con todos los modales y vistas
✅ **Analytics avanzados** con dashboards visuales
✅ **Optimización continua** con A/B testing
✅ **Escalabilidad** para miles de tareas
✅ **ROI medible** con métricas detalladas

**¡Tu Task Management System estará listo para competir con soluciones enterprise de $50K+/año!** 🚀 