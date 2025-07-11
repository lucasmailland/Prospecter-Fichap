'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  CheckIcon,
  PencilIcon,
  ChartBarIcon,
  UserIcon,
  GlobeAltIcon,
  MapPinIcon,
  BriefcaseIcon,
  TagIcon,
  TrashIcon,
  StarIcon,
  FlagIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import LoadingSystem from '@/components/ui/LoadingSystem';

interface Lead {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  score: number;
  status: string;
  source: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface EnrichedLeadData {
  lead: Lead;
  hubspot: any;
  conversations: any[];
  activities: any[];
  scoring: any;
  aiAnalysis: any;
  timeline: any[];
}

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
  onEdit?: (lead: Lead) => void;
}

interface AIRecommendation {
  type: 'task' | 'message';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestedDate?: string;
  suggestedTime?: string;
  content?: string;
  icon: React.ElementType;
}

export default function LeadDetailsModal({ isOpen, onClose, leadId, onEdit }: LeadDetailsModalProps) {
  const [enrichedData, setEnrichedData] = useState<EnrichedLeadData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [processingRecommendation, setProcessingRecommendation] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && leadId) {
      fetchEnrichedLeadData();
    }
  }, [isOpen, leadId]);

  const fetchEnrichedLeadData = async () => {
    if (!leadId) return;

    setLoading(true);
    try {
      const [leadResponse, hubspotResponse] = await Promise.all([
        fetch(`/api/prospects/${leadId}`),
        fetch(`/api/hubspot?leadId=${leadId}`)
      ]);

      const leadResult = await leadResponse.json();
      const hubspotResult = await hubspotResponse.json();

      if (leadResult.success) {
        const data = {
          lead: leadResult.data,
          hubspot: hubspotResult.hubspot || null,
          conversations: hubspotResult.conversations || [],
          activities: hubspotResult.activities || [],
          scoring: hubspotResult.scoring || null,
          aiAnalysis: hubspotResult.aiAnalysis || null,
          timeline: hubspotResult.timeline || []
        };
        
        setEnrichedData(data);
        generateRecommendations(data);
      }
    } catch (_error) {
  console.warn('Error fetching enriched data:', _error);
      toast.error('Error al cargar datos del lead');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (data: EnrichedLeadData) => {
    const score = data.lead.score;
    const recs: AIRecommendation[] = [];

    // Generar recomendaciones basadas en el score
    if (score >= 80) {
      // Lead HOT - Acción inmediata
      recs.push({
        type: 'task',
        priority: 'high',
        title: 'Llamada de seguimiento urgente',
        description: 'Este lead tiene alta probabilidad de conversión. Contactar inmediatamente.',
        suggestedDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        suggestedTime: '10:00',
        icon: PhoneIcon
      });

      recs.push({
        type: 'message',
        priority: 'high',
        title: 'Email personalizado de seguimiento',
        description: 'Mensaje directo y personalizado para cerrar la venta.',
        content: `Hola ${data.lead.name || data.lead.fullName},

He estado revisando el perfil de ${data.lead.company} y creo que tenemos una oportunidad perfecta para ayudarles a optimizar sus procesos.

Basándome en su industria y tamaño de empresa, he preparado una propuesta específica que podría generar un ROI del 300% en los primeros 6 meses.

¿Tendría 15 minutos mañana para una breve llamada? Puedo mostrarle exactamente cómo otras empresas similares han logrado estos resultados.

Saludos,
[Tu nombre]`,
        icon: EnvelopeIcon
      });
    } else if (score >= 60) {
      // Lead WARM - Nurturing activo
      recs.push({
        type: 'task',
        priority: 'medium',
        title: 'Reunión de descubrimiento',
        description: 'Programar reunión para entender necesidades específicas.',
        suggestedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        suggestedTime: '14:00',
        icon: CalendarIcon
      });

      recs.push({
        type: 'message',
        priority: 'medium',
        title: 'Compartir caso de éxito relevante',
        description: 'Enviar caso de estudio de empresa similar.',
        content: `Hola ${data.lead.name || data.lead.fullName},

Espero que esté teniendo una excelente semana en ${data.lead.company}.

Quería compartir con usted un caso de éxito reciente que creo que le resultará muy interesante. Trabajamos con una empresa de su sector que logró:

• Reducir costos operativos en un 40%
• Aumentar la eficiencia del equipo en un 60%
• Mejorar la satisfacción del cliente al 95%

Me gustaría mostrarle cómo lograron estos resultados y cómo podríamos adaptar esta estrategia para ${data.lead.company}.

¿Le interesaría una breve conversación esta semana?

Saludos,
[Tu nombre]`,
        icon: ChatBubbleLeftRightIcon
      });
    } else {
      // Lead COLD - Nurturing suave
      recs.push({
        type: 'task',
        priority: 'low',
        title: 'Seguimiento mensual',
        description: 'Mantener contacto regular con contenido de valor.',
        suggestedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        suggestedTime: '09:00',
        icon: ClockIcon
      });

      recs.push({
        type: 'message',
        priority: 'low',
        title: 'Newsletter con contenido educativo',
        description: 'Compartir recursos valiosos sin presión comercial.',
        content: `Hola ${data.lead.name || data.lead.fullName},

Espero que se encuentre muy bien.

He estado preparando algunos recursos que creo que podrían ser de gran valor para profesionales como usted en ${data.lead.company}.

He creado una guía completa sobre "Las 10 mejores prácticas para optimizar procesos en empresas de su sector" que incluye:

• Estrategias probadas por líderes de la industria
• Plantillas descargables
• Casos de estudio reales
• Checklist de implementación

¿Le gustaría que se la envíe? Es completamente gratuita y sin compromiso.

Saludos,
[Tu nombre]`,
        icon: EnvelopeIcon
      });
    }

    setRecommendations(recs);
  };

  const acceptRecommendation = async (recommendation: AIRecommendation, index: number) => {
    setProcessingRecommendation(`${recommendation.type}-${index}`);
    
    try {
      if (recommendation.type === 'task') {
        // Programar tarea
        const response = await fetch('/api/tasks/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: enrichedData?.lead.id,
            type: recommendation.title.toLowerCase().includes('llamada') ? 'call' : 
                  recommendation.title.toLowerCase().includes('reunión') ? 'meeting' : 'follow-up',
            date: recommendation.suggestedDate,
            time: recommendation.suggestedTime,
            notes: recommendation.description,
            scheduledAt: `${recommendation.suggestedDate}T${recommendation.suggestedTime}`
          })
        });

        if (response.ok) {
          toast.success('Tarea programada exitosamente');
        }
      } else {
        // Copiar mensaje al portapapeles
        navigator.clipboard.writeText(recommendation.content || '');
        toast.success('Mensaje copiado al portapapeles');
      }
    } catch (_error) {
      toast.error('Error al procesar recomendación');
    } finally {
      setProcessingRecommendation(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'HOT';
    if (score >= 60) return 'WARM';
    if (score >= 40) return 'QUALIFIED';
    return 'NURTURE';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <LoadingSystem variant="inline" message="Cargando datos del lead..." size="md" />
            </div>
          ) : enrichedData ? (
            <>
              {/* Header minimalista */}
              <div className="bg-white border-b border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Avatar simple */}
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-700">
                        {(enrichedData.lead.name || enrichedData.lead.fullName || 'NN').split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Info básica */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                        {enrichedData.lead.name || enrichedData.lead.fullName || 'Sin nombre'}
                      </h2>
                      <p className="text-gray-600 mb-3">
                        {enrichedData.lead.jobTitle} en {enrichedData.lead.company}
                      </p>
                      
                      {/* Score badge minimalista */}
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(enrichedData.lead.score)}`}>
                        <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                        {getScoreLabel(enrichedData.lead.score)} ({enrichedData.lead.score})
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Tabs minimalistas */}
              <div className="bg-white border-b border-gray-100">
                <nav className="flex">
                  {[
                    { id: 'overview', label: 'Información', icon: UserIcon },
                    { id: 'recommendations', label: 'Recomendaciones IA', icon: SparklesIcon },
                    { id: 'insights', label: 'Insights', icon: ChartBarIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información de contacto */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{enrichedData.lead.email}</p>
                          </div>
                        </div>

                        {enrichedData.lead.phone && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <PhoneIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Teléfono</p>
                              <p className="font-medium text-gray-900">{enrichedData.lead.phone}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Empresa</p>
                            <p className="font-medium text-gray-900">{enrichedData.lead.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {enrichedData.activities?.length || 0}
                          </div>
                          <div className="text-sm text-blue-600">Actividades</div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {enrichedData.conversations?.length || 0}
                          </div>
                          <div className="text-sm text-green-600">Conversaciones</div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {enrichedData.aiAnalysis?.conversionProbability || 0}%
                          </div>
                          <div className="text-sm text-purple-600">Conversión</div>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {enrichedData.aiAnalysis?.buyingSignals || 0}
                          </div>
                          <div className="text-sm text-orange-600">Señales</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <SparklesIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Recomendaciones Inteligentes
                      </h3>
                      <p className="text-gray-600">
                        Basadas en el análisis de IA y scoring del lead
                      </p>
                    </div>

                    <div className="space-y-4">
                      {recommendations.map((rec, _index) => (
                        <motion.div
                          key={_index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: _index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <rec.icon className="w-6 h-6 text-blue-600" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(rec.priority)}`}>
                                    {rec.priority.toUpperCase()}
                                  </span>
                                </div>
                                
                                <p className="text-gray-600 mb-3">{rec.description}</p>
                                
                                {rec.suggestedDate && (
                                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                    <span className="flex items-center space-x-1">
                                      <CalendarIcon className="w-4 h-4" />
                                      <span>{new Date(rec.suggestedDate).toLocaleDateString()}</span>
                                    </span>
                                    {rec.suggestedTime && (
                                      <span className="flex items-center space-x-1">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>{rec.suggestedTime}</span>
                                      </span>
                                    )}
                                  </div>
                                )}

                                {rec.content && (
                                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 font-mono">
                                    {rec.content.substring(0, 100)}...
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => acceptRecommendation(rec, _index)}
                                disabled={processingRecommendation === `${rec.type}-${_index}`}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                {processingRecommendation === `${rec.type}-${_index}` ? (
                                  <LoadingSystem variant="minimal" size="xs" color="primary" />
                                ) : (
                                  <CheckIcon className="w-4 h-4" />
                                )}
                                <span>Aceptar</span>
                              </button>
                              
                              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Análisis de IA</h3>
                    
                    {enrichedData.aiAnalysis ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {Math.round(enrichedData.aiAnalysis.sentimentScore * 100)}%
                          </div>
                          <div className="text-blue-700 font-medium">Sentiment Score</div>
                          <div className="text-sm text-blue-600 mt-1">
                            {enrichedData.aiAnalysis.sentimentScore > 0.5 ? 'Positivo' : 
                             enrichedData.aiAnalysis.sentimentScore > 0 ? 'Neutral' : 'Negativo'}
                          </div>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {enrichedData.aiAnalysis.buyingSignals || 0}
                          </div>
                          <div className="text-green-700 font-medium">Señales de Compra</div>
                          <div className="text-sm text-green-600 mt-1">Detectadas</div>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {enrichedData.aiAnalysis.conversionProbability || 0}%
                          </div>
                          <div className="text-purple-700 font-medium">Probabilidad</div>
                          <div className="text-sm text-purple-600 mt-1">de Conversión</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No hay datos de análisis disponibles</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <XMarkIcon className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-600">No se pudieron cargar los datos del lead</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 