import { useState, useEffect } from 'react';
import { Globe, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface WebhookInfo {
  webhook: {
    status: string;
    endpoint: string;
    lastEvent: unknown;
    lastEventTime: string;
  };
  syncStats: unknown;
}

export default function WebhookStatus() {
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWebhookInfo();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadWebhookInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  // const _loadWebhookInfo = async () => {
    try {
      const response = await fetch('/api/webhooks/hubspot/contact');
      const data = await response.json();
      
      if (data.success) {
        setWebhookInfo(data);
      }
    } catch (_error) {
      console.error('Error loading webhook info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const _formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (!webhookInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700 text-sm font-medium">Error cargando webhook</span>
        </div>
      </div>
    );
  }

  const { webhook, syncStats } = webhookInfo;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-4">
      {/* Estado del Webhook */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-gray-900">Webhook HubSpot</span>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Activo
          </span>
        </div>
        
        <button 
          onClick={loadWebhookInfo}
          className="flex items-center space-x-1 px-2 py-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
        >
          <Activity className="w-3 h-3" />
          <span className="text-xs">Actualizar</span>
        </button>
      </div>

      {/* Endpoint URL */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-1">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Endpoint:</span>
        </div>
        <code className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
          {webhook.endpoint}
        </code>
        <p className="text-xs text-gray-500 mt-1">
          💡 Configura este endpoint en tu cuenta de HubSpot para recibir eventos automáticamente
        </p>
      </div>

      {/* Último Evento */}
      {webhook.lastEvent && (
        <div className="border-t pt-3">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Último Evento:</span>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {webhook.lastEvent.type === 'contact' ? '📞 Contactos' : webhook.lastEvent.type}
              </span>
              <span className="text-xs text-blue-600">
                {formatDate(webhook.lastEventTime)}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-blue-900">{webhook.lastEvent.eventsReceived}</div>
                <div className="text-blue-600">Recibidos</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-900">{webhook.lastEvent.eventsProcessed}</div>
                <div className="text-green-600">Procesados</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-900">{webhook.lastEvent.errors}</div>
                <div className="text-red-600">Errores</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas Actuales */}
      <div className="border-t pt-3">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Base de Datos:</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center bg-gray-50 rounded p-2">
            <div className="font-semibold text-gray-900">{syncStats.contacts.toLocaleString()}</div>
            <div className="text-gray-600">Contactos</div>
          </div>
          <div className="text-center bg-gray-50 rounded p-2">
            <div className="font-semibold text-gray-900">{syncStats.companies.toLocaleString()}</div>
            <div className="text-gray-600">Empresas</div>
          </div>
          <div className="text-center bg-gray-50 rounded p-2">
            <div className="font-semibold text-gray-900">{syncStats.deals.toLocaleString()}</div>
            <div className="text-gray-600">Deals</div>
          </div>
          <div className="text-center bg-gray-50 rounded p-2">
            <div className="font-semibold text-gray-900">{syncStats.total.toLocaleString()}</div>
            <div className="text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Configuración */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>🔄 Sincronización automática activa</span>
          <span>✅ Sin intervención manual necesaria</span>
        </div>
      </div>
    </div>
  );
} 