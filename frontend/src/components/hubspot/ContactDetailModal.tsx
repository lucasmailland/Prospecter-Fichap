import { useState, useEffect } from 'react';
import { X, User, Building, Mail, Phone, Globe, MapPin, Calendar, TrendingUp, DollarSign, Activity, Star, ExternalLink } from 'lucide-react';

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
}

interface ContactDetail {
  id: string;
  hubspotId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  website: string;
  linkedinUrl: string;
  country: string;
  state: string;
  city: string;
  industry: string;
  numEmployees: string;
  annualRevenue: string;
  lifecycleStage: string;
  leadStatus: string;
  hubspotCreateDate: string;
  hubspotModifiedDate: string;
  lastActivityDate: string;
  timezone: string;
  syncedAt: string;
  leadScore: number;
  dealsCount: number;
  totalDealAmount: number;
  emailMetrics: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
  } | null;
  deals: {
    id: string;
    name: string;
    amount: number;
    stage: string;
    pipeline: string;
    closeDate: string;
  }[];
  activitySummary: {
    totalActivities: number;
    totalEmails: number;
    totalCalls: number;
    totalMeetings: number;
  };
  recentActivities: {
    id: string;
    subject: string;
    type: string;
    timestamp: string;
    outcome: string;
  }[];
  recentEmails: {
    id: string;
    subject: string;
    direction: 'INCOMING' | 'OUTGOING';
    timestamp: string;
    opens: number;
    clicks: number;
  }[];
  recentCalls: {
    id: string;
    title: string;
    direction: 'INCOMING' | 'OUTGOING';
    timestamp: string;
    duration: string;
  }[];
  recentMeetings: {
    id: string;
    title: string;
    timestamp: string;
    outcome: string;
    duration: string;
  }[];
  recentNotes: {
    id: string;
    content: string;
    timestamp: string;
  }[];
  recentTasks: {
    id: string;
    subject: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    timestamp: string;
  }[];
}

export default function ContactDetailModal({ isOpen, onClose, contactId }: ContactDetailModalProps) {
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (isOpen && contactId) {
      loadContactDetail();
    }
  }, [isOpen, contactId]);

  // const _loadContactDetail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hubspot/contacts/${contactId}`);
      const data = await response.json();
      
      if (data.success) {
        setContact(data.contact);
      }
    } catch (_error) {
      console.error('Error loading contact detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const _formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // const _formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // const _getLifecycleColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'subscriber': 'bg-gray-100 text-gray-800',
      'lead': 'bg-blue-100 text-blue-800',
      'marketingqualifiedlead': 'bg-yellow-100 text-yellow-800',
      'salesqualifiedlead': 'bg-orange-100 text-orange-800',
      'opportunity': 'bg-purple-100 text-purple-800',
      'customer': 'bg-green-100 text-green-800',
      'evangelist': 'bg-pink-100 text-pink-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  // const _tabs = [
    { id: 'overview', name: 'Información General', icon: User },
    { id: 'activity', name: 'Actividad', icon: Activity },
    { id: 'notes', name: 'Notas y Tareas', icon: Star },
    { id: 'deals', name: 'Deals', icon: DollarSign }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-white bg-opacity-30 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-white bg-opacity-20 rounded w-32"></div>
                  </div>
                ) : contact ? (
                  <>
                    <h2 className="text-2xl font-bold">
                      {contact.firstName} {contact.lastName}
                    </h2>
                    <p className="text-blue-100">
                      {contact.jobTitle} {contact.company && `en ${contact.company}`}
                    </p>
                  </>
                ) : (
                  <h2 className="text-xl font-bold">Cargando contacto...</h2>
                )}
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Score y Estado */}
          {contact && (
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Score: {contact.leadScore || 0}/100</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLifecycleColor(contact.lifecycleStage)}`}>
                {contact.lifecycleStage}
              </span>
              {contact.hubspotId && (
                <a 
                  href={`https://app.hubspot.com/contacts/your-hub-id/contact/${contact.hubspotId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-200 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Ver en HubSpot</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tabs content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <p className="text-sm text-gray-900">{contact.firstName} {contact.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900">{contact.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <p className="text-sm text-gray-900">{contact.phone || 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    {contact.linkedinUrl ? (
                      <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                        Ver perfil
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">No disponible</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                    <p className="text-sm text-gray-900">{contact.company || 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    <p className="text-sm text-gray-900">{contact.jobTitle || 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                    <p className="text-sm text-gray-900">
                      {contact.city && contact.country ? `${contact.city}, ${contact.country}` : 'No disponible'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zona horaria</label>
                    <p className="text-sm text-gray-900">{contact.timezone || 'No disponible'}</p>
                  </div>
                </div>
              </div>

              {/* Métricas de email */}
              {contact.emailMetrics && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Métricas de Email</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{contact.emailMetrics.emailsSent}</div>
                      <div className="text-xs text-gray-600">Enviados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{Math.round(contact.emailMetrics.openRate * 100)}%</div>
                      <div className="text-xs text-gray-600">Abiertos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{Math.round(contact.emailMetrics.clickRate * 100)}%</div>
                      <div className="text-xs text-gray-600">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">{Math.round(contact.emailMetrics.replyRate * 100)}%</div>
                      <div className="text-xs text-gray-600">Respuestas</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Deals */}
              {contact.deals && contact.deals.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Deals ({contact.deals.length})</h4>
                  <div className="space-y-2">
                    {contact.deals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className="flex justify-between items-center bg-white p-3 rounded border">
                        <div>
                          <div className="font-medium text-sm">{deal.name}</div>
                          <div className="text-xs text-gray-500">{deal.stage} • {deal.pipeline}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{formatCurrency(deal.amount)}</div>
                          {deal.closeDate && (
                            <div className="text-xs text-gray-500">
                              Cierre: {formatDate(deal.closeDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {contact.deals.length > 3 && (
                      <div className="text-center text-sm text-gray-500">
                        Y {contact.deals.length - 3} deals más...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resumen de actividad */}
              {contact.activitySummary && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Resumen de Actividad</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{contact.activitySummary.totalActivities}</div>
                      <div className="text-xs text-gray-600">Actividades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{contact.activitySummary.totalEmails}</div>
                      <div className="text-xs text-gray-600">Emails</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{contact.activitySummary.totalCalls}</div>
                      <div className="text-xs text-gray-600">Llamadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">{contact.activitySummary.totalMeetings}</div>
                      <div className="text-xs text-gray-600">Reuniones</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="p-6 space-y-6">
              {/* Actividades recientes */}
              {contact.recentActivities && contact.recentActivities.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Actividades Recientes</h4>
                  <div className="space-y-3">
                    {contact.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{activity.subject}</div>
                          <div className="text-xs text-gray-500">{activity.type}</div>
                          <div className="text-xs text-gray-400">{formatDate(activity.timestamp)}</div>
                          {activity.outcome && (
                            <div className="text-xs text-green-600 mt-1">Resultado: {activity.outcome}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emails recientes */}
              {contact.recentEmails && contact.recentEmails.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Emails Recientes</h4>
                  <div className="space-y-3">
                    {contact.recentEmails.map((email) => (
                      <div key={email.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          email.direction === 'OUTGOING' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{email.subject}</div>
                          <div className="text-xs text-gray-500">
                            {email.direction === 'OUTGOING' ? '📤 Enviado' : '📥 Recibido'}
                          </div>
                          <div className="text-xs text-gray-400">{formatDate(email.timestamp)}</div>
                          {(email.opens > 0 || email.clicks > 0) && (
                            <div className="text-xs text-green-600 mt-1">
                              {email.opens > 0 && `${email.opens} aperturas`}
                              {email.clicks > 0 && ` • ${email.clicks} clicks`}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Llamadas recientes */}
              {contact.recentCalls && contact.recentCalls.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Llamadas Recientes</h4>
                  <div className="space-y-3">
                    {contact.recentCalls.map((call) => (
                      <div key={call.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{call.title}</div>
                          <div className="text-xs text-gray-500">
                            {call.direction === 'OUTGOING' ? '📞 Saliente' : '📱 Entrante'}
                          </div>
                          <div className="text-xs text-gray-400">{formatDate(call.timestamp)}</div>
                          {call.duration && (
                            <div className="text-xs text-green-600 mt-1">Duración: {call.duration}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reuniones recientes */}
              {contact.recentMeetings && contact.recentMeetings.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Reuniones Recientes</h4>
                  <div className="space-y-3">
                    {contact.recentMeetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{meeting.title}</div>
                          <div className="text-xs text-gray-400">{formatDate(meeting.timestamp)}</div>
                          {meeting.outcome && (
                            <div className="text-xs text-green-600 mt-1">Resultado: {meeting.outcome}</div>
                          )}
                          {meeting.duration && (
                            <div className="text-xs text-gray-500 mt-1">Duración: {meeting.duration}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="p-6 space-y-6">
              {/* Notas recientes */}
              {contact.recentNotes && contact.recentNotes.length > 0 ? (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notas</h4>
                  <div className="space-y-3">
                    {contact.recentNotes.map((note) => (
                      <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-900">{note.content}</div>
                        <div className="text-xs text-gray-400 mt-2">{formatDate(note.timestamp)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay notas disponibles para este contacto.
                </div>
              )}

              {/* Tareas */}
              {contact.recentTasks && contact.recentTasks.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tareas</h4>
                  <div className="space-y-3">
                    {contact.recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{task.subject}</div>
                          <div className="text-xs text-gray-400">{formatDate(task.timestamp)}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.priority === 'HIGH' 
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 