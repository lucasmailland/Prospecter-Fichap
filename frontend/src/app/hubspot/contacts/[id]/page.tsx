'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSystem } from '@/components/ui/LoadingSystem';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ContactDetail {
  id: string;
  hubspotId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  industry: string;
  lifecycleStage: string;
  leadStatus: string;
  createDate: string;
  lastModifiedDate: string;
  _count: {
    emails: number;
    calls: number;
    notes: number;
    deals: number;
    tasks: number;
  };
}

interface Email {
  id: string;
  emailSubject: string;
  emailDirection: string;
  emailStatus: string;
  timestamp: string;
  emailFromEmail: string;
  emailToEmail: string;
  emailOpenCount: string;
  emailClickCount: string;
}

interface Call {
  id: string;
  callTitle: string;
  callDirection: string;
  callDisposition: string;
  callDuration: string;
  timestamp: string;
  callFromNumber: string;
  callToNumber: string;
}

interface Note {
  id: string;
  noteBody: string;
  timestamp: string;
}

interface Deal {
  id: string;
  dealName: string;
  amount: string;
  dealStage: string;
  pipeline: string;
  closeDate: string;
  dealType: string;
  description: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  scheduledDate: string;
  createdAt: string;
}

export default function ContactDetailPage() {
  // const _params = useParams();
  // const _contactId = params.id as string;
  
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchContactData();
  }, [contactId]);

  // const _fetchContactData = async () => {
    try {
      setLoading(true);
      
      // Fetch contact details
      const contactResponse = await fetch(`/api/hubspot/contacts/${contactId}`);
      const contactData = await contactResponse.json();
      setContact(contactData);
      
      // Fetch related data in parallel
      const [emailsRes, callsRes, notesRes, dealsRes, tasksRes] = await Promise.all([
        fetch(`/api/hubspot/contacts/${contactId}/emails`),
        fetch(`/api/hubspot/contacts/${contactId}/calls`),
        fetch(`/api/hubspot/contacts/${contactId}/notes`),
        fetch(`/api/hubspot/contacts/${contactId}/deals`),
        fetch(`/api/hubspot/contacts/${contactId}/tasks`)
      ]);
      
      const [emailsData, callsData, notesData, dealsData, tasksData] = await Promise.all([
        emailsRes.json(),
        callsRes.json(),
        notesRes.json(),
        dealsRes.json(),
        tasksRes.json()
      ]);
      
      setEmails(emailsData);
      setCalls(callsData);
      setNotes(notesData);
      setDeals(dealsData);
      setTasks(tasksData);
      
    } catch (_error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSystem />;
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Contacto no encontrado</p>
      </div>
    );
  }

  // const _getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-purple-100 text-purple-800';
      case 'evangelist': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // const _getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // const _formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // const _formatAmount = (amount: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(parseFloat(amount));
  };

  // const _tabs = [
    { id: 'overview', label: 'Resumen', icon: UserIcon },
    { id: 'emails', label: `Emails (${emails.length})`, icon: EnvelopeIcon },
    { id: 'calls', label: `Llamadas (${calls.length})`, icon: PhoneIcon },
    { id: 'deals', label: `Deals (${deals.length})`, icon: CurrencyDollarIcon },
    { id: 'notes', label: `Notas (${notes.length})`, icon: DocumentTextIcon },
    { id: 'tasks', label: `Tareas (${tasks.length})`, icon: CheckCircleIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/hubspot">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h1>
            <p className="text-gray-600">{contact.jobTitle} en {contact.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(contact.lifecycleStage)}>
            {contact.lifecycleStage}
          </Badge>
          <Badge className={getStatusColor(contact.leadStatus)}>
            {contact.leadStatus}
          </Badge>
        </div>
      </div>

      {/* Contact Info Card */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Información de Contacto</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{contact.phone || 'No disponible'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p className="font-medium">{contact.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Industria</p>
                <p className="font-medium">{contact.industry || 'No especificada'}</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{contact._count.emails}</p>
                <p className="text-sm text-gray-500">Emails</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{contact._count.calls}</p>
                <p className="text-sm text-gray-500">Llamadas</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{contact._count.deals}</p>
                <p className="text-sm text-gray-500">Deals</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{contact._count.notes}</p>
                <p className="text-sm text-gray-500">Notas</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-2xl font-bold text-indigo-600">{contact._count.tasks}</p>
                <p className="text-sm text-gray-500">Tareas</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Creado</p>
                <p className="text-xs text-gray-500">{formatDate(contact.createDate)}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <Card.Header>
          <div className="flex space-x-1 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card.Header>
        
        <Card.Content>
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Información General</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">ID HubSpot:</span> {contact.hubspotId}</p>
                    <p><span className="font-medium">Etapa del ciclo de vida:</span> {contact.lifecycleStage}</p>
                    <p><span className="font-medium">Estado del lead:</span> {contact.leadStatus}</p>
                    <p><span className="font-medium">Industria:</span> {contact.industry || 'No especificada'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fechas Importantes</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Creado:</span> {formatDate(contact.createDate)}</p>
                    <p><span className="font-medium">Última modificación:</span> {formatDate(contact.lastModifiedDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="space-y-4">
              {emails.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay emails para mostrar</p>
              ) : (
                emails.map((email) => (
                  <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{email.emailSubject}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          email.emailDirection === 'OUTGOING' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }>
                          {email.emailDirection === 'OUTGOING' ? 'Enviado' : 'Recibido'}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800">
                          {email.emailStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">De:</span> {email.emailFromEmail}</p>
                      <p><span className="font-medium">Para:</span> {email.emailToEmail}</p>
                      <p><span className="font-medium">Fecha:</span> {formatDate(email.timestamp)}</p>
                      <div className="flex space-x-4 mt-2">
                        <span>👀 {email.emailOpenCount} aperturas</span>
                        <span>🔗 {email.emailClickCount} clics</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'calls' && (
            <div className="space-y-4">
              {calls.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay llamadas para mostrar</p>
              ) : (
                calls.map((call) => (
                  <div key={call.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{call.callTitle}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          call.callDirection === 'OUTGOING' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }>
                          {call.callDirection === 'OUTGOING' ? 'Saliente' : 'Entrante'}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800">
                          {call.callDisposition}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">De:</span> {call.callFromNumber}</p>
                      <p><span className="font-medium">Para:</span> {call.callToNumber}</p>
                      <p><span className="font-medium">Duración:</span> {Math.floor(parseInt(call.callDuration) / 60)} minutos</p>
                      <p><span className="font-medium">Fecha:</span> {formatDate(call.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="space-y-4">
              {deals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay deals para mostrar</p>
              ) : (
                deals.map((deal) => (
                  <div key={deal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{deal.dealName}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          {formatAmount(deal.amount)}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          {deal.dealStage}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Pipeline:</span> {deal.pipeline}</p>
                      <p><span className="font-medium">Tipo:</span> {deal.dealType}</p>
                      <p><span className="font-medium">Cierre esperado:</span> {formatDate(deal.closeDate)}</p>
                      <p><span className="font-medium">Descripción:</span> {deal.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay notas para mostrar</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{formatDate(note.timestamp)}</span>
                    </div>
                    <p className="text-gray-900">{note.noteBody}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay tareas para mostrar</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><span className="font-medium">Programado:</span> {formatDate(task.scheduledDate)}</p>
                      <p><span className="font-medium">Creado:</span> {formatDate(task.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
} 