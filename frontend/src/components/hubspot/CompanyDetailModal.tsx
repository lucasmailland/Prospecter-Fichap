'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import LoadingSystem from '@/components/ui/LoadingSystem';
import { 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  XMarkIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface CompanyDetailModalProps {
  companyId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface CompanyDetail {
  id: string;
  hubspotId: string;
  name: string;
  domain: string;
  industry: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  website: string;
  numEmployees: string;
  annualRevenue: string;
  description: string;
  foundedYear: string;
  companyType: string;
  lifecycleStage: string;
  updatedAt: string;
  createdAt: string;
  contactsCount: number;
  dealsCount: number;
  emailsCount: number;
  callsCount: number;
  notesCount: number;
  ticketsCount: number;
  totalRevenue: number;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  phone: string;
  lifecycleStage: string;
  leadScore: number;
}

interface Deal {
  id: string;
  dealName: string;
  amount: string;
  dealStage: string;
  closeDate: string;
  pipeline: string;
  contactId: string;
}

interface Email {
  id: string;
  emailSubject: string;
  emailDirection: string;
  emailStatus: string;
  timestamp: string;
  contact: {
    firstName: string;
    lastName: string;
  };
}

export default function CompanyDetailModal({ companyId, isOpen, onClose }: CompanyDetailModalProps) {
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyData();
    }
  }, [isOpen, companyId]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      
      // Fetch company details
      const companyResponse = await fetch(`/api/hubspot/companies/${companyId}`);
      const companyData = await companyResponse.json();
      setCompany(companyData);
      
      // Fetch related data in parallel
      const [contactsRes, dealsRes, emailsRes] = await Promise.all([
        fetch(`/api/hubspot/companies/${companyId}/contacts`),
        fetch(`/api/hubspot/companies/${companyId}/deals`),
        fetch(`/api/hubspot/companies/${companyId}/emails`)
      ]);
      
      const [contactsData, dealsData, emailsData] = await Promise.all([
        contactsRes.json(),
        dealsRes.json(),
        emailsRes.json()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setEmails(emailsData);
      
    } catch (_error) {
      console.error('Error fetching company data:', _error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'opportunity': return 'bg-yellow-100 text-yellow-800';
      case 'lead': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BuildingOfficeIcon },
    { id: 'contacts', label: `Contactos (${contacts.length})`, icon: UserGroupIcon },
    { id: 'deals', label: `Deals (${deals.length})`, icon: CurrencyDollarIcon },
    { id: 'emails', label: `Emails (${emails.length})`, icon: EnvelopeIcon }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingSystem />
          </div>
        ) : company ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-gray-600">{company.industry}</p>
                    <Badge className={getStatusColor(company.lifecycleStage)}>
                      {company.lifecycleStage}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Company Info Cards */}
            <div className="p-6 border-b bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg">
                  <UserGroupIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{company.contactsCount}</p>
                    <p className="text-sm text-gray-500">Contactos</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{company.dealsCount}</p>
                    <p className="text-sm text-gray-500">Deals</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg">
                  <EnvelopeIcon className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{company.emailsCount}</p>
                    <p className="text-sm text-gray-500">Emails</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg">
                  <PhoneIcon className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{company.callsCount}</p>
                    <p className="text-sm text-gray-500">Llamadas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-1 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600 bg-green-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Información General</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Sitio web</p>
                            <a href={company.website} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline">
                              {company.website}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium">{company.phone || 'No disponible'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Ubicación</p>
                            <p className="font-medium">
                              {[company.city, company.state, company.country].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Datos Comerciales</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Empleados</p>
                          <p className="font-medium">{company.numEmployees || 'No especificado'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Revenue Anual</p>
                          <p className="font-medium text-green-600">
                            {company.annualRevenue ? formatCurrency(company.annualRevenue) : 'No especificado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Revenue Total Deals</p>
                          <p className="font-medium text-green-600">
                            {formatCurrency(company.totalRevenue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fundada</p>
                          <p className="font-medium">{company.foundedYear || 'No especificado'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {company.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                      <p className="text-gray-700 leading-relaxed">{company.description}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="space-y-4">
                  {contacts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay contactos para mostrar</p>
                  ) : (
                    <div className="grid gap-4">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {contact.firstName} {contact.lastName}
                              </h4>
                              <p className="text-sm text-gray-600">{contact.jobTitle}</p>
                              <p className="text-sm text-gray-500">{contact.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(contact.lifecycleStage)}>
                                {contact.lifecycleStage}
                              </Badge>
                              <div className="text-right">
                                <p className="text-sm font-medium">Score: {contact.leadScore}</p>
                                <p className="text-xs text-gray-500">{contact.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'deals' && (
                <div className="space-y-4">
                  {deals.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay deals para mostrar</p>
                  ) : (
                    <div className="grid gap-4">
                      {deals.map((deal) => (
                        <div key={deal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{deal.dealName}</h4>
                              <p className="text-sm text-gray-600">{deal.pipeline}</p>
                              <p className="text-sm text-gray-500">
                                Cierre: {deal.closeDate ? formatDate(deal.closeDate) : 'No definido'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                {formatCurrency(deal.amount)}
                              </p>
                              <Badge className={getStatusColor(deal.dealStage)}>
                                {deal.dealStage}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'emails' && (
                <div className="space-y-4">
                  {emails.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay emails para mostrar</p>
                  ) : (
                    <div className="grid gap-4">
                      {emails.map((email) => (
                        <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{email.emailSubject}</h4>
                              <p className="text-sm text-gray-600">
                                {email.contact.firstName} {email.contact.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{formatDate(email.timestamp)}</p>
                            </div>
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">Empresa no encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
} 