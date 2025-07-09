import React from 'react';
import { Building, Globe, Phone, Users, DollarSign } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  industry?: string;
  city?: string;
  country?: string;
  phone?: string;
  numEmployees?: string;
  annualRevenue?: string;
  dealsCount: number;
  totalRevenue: number;
  lifecycleStage?: string;
  updatedAt: string;
}

interface CompaniesTableProps {
  companies: Company[];
  formatCurrency: (amount: string) => string;
  formatDate: (date: string) => string;
}

export default function CompaniesTable({ companies, formatCurrency, formatDate }: CompaniesTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-6 font-semibold text-gray-700">Empresa</th>
            <th className="text-left p-6 font-semibold text-gray-700">Industria</th>
            <th className="text-left p-6 font-semibold text-gray-700">Ubicación</th>
            <th className="text-left p-6 font-semibold text-gray-700">Empleados</th>
            <th className="text-left p-6 font-semibold text-gray-700">Revenue</th>
            <th className="text-left p-6 font-semibold text-gray-700">Deals</th>
            <th className="text-left p-6 font-semibold text-gray-700">Estado</th>
            <th className="text-left p-6 font-semibold text-gray-700">Actualizado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-6">
                <div>
                  <div className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{company.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">{company.domain}</div>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" 
                       className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-1">
                      <Globe className="w-3 h-3" />
                      <span>Ver sitio web</span>
                    </a>
                  )}
                </div>
              </td>
              <td className="p-6">
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  {company.industry || 'Sin categoría'}
                </span>
              </td>
              <td className="p-6">
                <div className="text-gray-700">
                  {company.city && company.country ? `${company.city}, ${company.country}` : company.country || 'No especificado'}
                </div>
                {company.phone && (
                  <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                    <Phone className="w-3 h-3" />
                    <span>{company.phone}</span>
                  </div>
                )}
              </td>
              <td className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-900">
                    {company.numEmployees || 'N/A'}
                  </span>
                  {company.numEmployees && (
                    <span className="text-xs text-gray-500">empleados</span>
                  )}
                </div>
              </td>
              <td className="p-6">
                <div className="space-y-1">
                  <div className="font-semibold text-green-600 flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{company.annualRevenue ? formatCurrency(company.annualRevenue) : 'N/A'}</span>
                  </div>
                  {company.totalRevenue > 0 && (
                    <div className="text-sm text-gray-500">
                      Pipeline: {formatCurrency(company.totalRevenue.toString())}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-6">
                <div className="font-medium text-gray-900">
                  {company.dealsCount} deals
                </div>
                {company.dealsCount > 0 && (
                  <div className="text-sm text-orange-600">🎯 Pipeline activo</div>
                )}
              </td>
              <td className="p-6">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  company.lifecycleStage === 'customer' 
                    ? 'bg-green-100 text-green-800'
                    : company.lifecycleStage === 'opportunity'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {company.lifecycleStage || 'lead'}
                </span>
              </td>
              <td className="p-6 text-sm text-gray-500">
                {formatDate(company.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 