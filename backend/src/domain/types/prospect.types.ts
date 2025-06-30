// Tipos compartidos para prospects
export interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  score: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  jobTitle?: string;
  priority: number;
  isEmailValid: boolean;
  isHighPriority: boolean;
  isReadyForContact: boolean;
  createdAt: string;
  updatedAt: string;
} 