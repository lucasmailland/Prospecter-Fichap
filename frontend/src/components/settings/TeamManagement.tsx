'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Pagination,

  Switch,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Selection,
  SortDescriptor,
  ChipProps
} from '@heroui/react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  UserIcon,
  ShieldCheckIcon,
  EyeIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  CogIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSystem from '@/components/ui/LoadingSystem';

// ========================================================================================
// TIPOS Y INTERFACES
// ========================================================================================

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Mantenemos por compatibilidad
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  accountLocked: boolean;
}

interface InviteUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface TeamTableConfig {
  density: 'compact' | 'normal' | 'comfortable';
  view: 'table' | 'grid';
  visibleColumns: Set<string>;
  sortConfig: SortDescriptor;
  filters: {
    global: string;
    role: string;
    status: string;
  };
  pagination: {
    page: number;
    itemsPerPage: number;
  };
}

const ROLE_OPTIONS = [
  { value: 'ALL', label: 'Todos los roles' },
  { value: 'ADMIN', label: 'Administradores' },
  { value: 'MANAGER', label: 'Managers' },
  { value: 'USER', label: 'Usuarios' }
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'LOCKED', label: 'Bloqueados' }
];

const ITEMS_PER_PAGE_OPTIONS = [
  { value: 10, label: '10 por página' },
  { value: 25, label: '25 por página' },
  { value: 50, label: '50 por página' },
  { value: 100, label: '100 por página' }
];

// ========================================================================================
// MODAL DE INVITAR USUARIO
// ========================================================================================

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (userData: InviteUserData) => void;
  loading: boolean;
}

// Función para validar contraseña segura con más detalle
const validatePassword = (password: string): { 
  isValid: boolean; 
  errors: string[]; 
  strength: number; 
  checks: { [key: string]: boolean } 
} => {
  // const _checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  // const _passedChecks = Object.values(checks).filter(Boolean).length;
  // const _strength = (passedChecks / 5) * 100;
  
  const errors: string[] = [];
  if (!checks.length) errors.push('Mínimo 8 caracteres');
  if (!checks.uppercase) errors.push('Al menos una mayúscula');
  if (!checks.lowercase) errors.push('Al menos una minúscula');
  if (!checks.number) errors.push('Al menos un número');
  if (!checks.special) errors.push('Al menos un carácter especial');
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
    checks
  };
};

const InviteUserModal = ({ isOpen, onClose, onInvite, loading }: InviteUserModalProps) => {
  const [formData, setFormData] = useState<InviteUserData>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'USER',
  });

  // const _handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
  };

  // const _resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'USER',
    });
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Invitar Usuario</h3>
          <p className="text-sm text-gray-500">Agrega un nuevo miembro al equipo</p>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Juan"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                variant="bordered"
              />
              <Input
                label="Apellido"
                placeholder="Pérez"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                variant="bordered"
              />
              <Input
                label="Email"
                type="email"
                placeholder="juan@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                variant="bordered"
                className="md:col-span-2"
              />
              <Select
                label="Rol"
                placeholder="Selecciona un rol"
                selectedKeys={[formData.role]}
                onSelectionChange={(keys) => setFormData({ ...formData, role: Array.from(keys)[0] as string })}
                variant="bordered"
                className="md:col-span-2"
              >
                <SelectItem key="USER" value="USER">Usuario</SelectItem>
                <SelectItem key="MANAGER" value="MANAGER">Manager</SelectItem>
                <SelectItem key="ADMIN" value="ADMIN">Administrador</SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button 
              color="primary" 
              type="submit" 
              isLoading={loading}
              startContent={!loading && <UserPlusIcon className="w-4 h-4" />}
            >
              {loading ? 'Invitando...' : 'Invitar Usuario'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

// ========================================================================================
// MODAL DE EDITAR USUARIO
// ========================================================================================

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, userData: Partial<User & { newPassword?: string; confirmPassword?: string }>) => void;
  loading: boolean;
  user: User | null;
  currentUserRole: string;
  currentUser: User | null;
}

const EditUserModal = ({ isOpen, onClose, onUpdate, loading, user, currentUserRole, currentUser }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    accountLocked: false,
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
    strength: number;
    checks: { [key: string]: boolean };
  } | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        accountLocked: user.accountLocked || false,
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  // const _handlePasswordChange = (password: string) => {
    setFormData({ ...formData, newPassword: password });
    if (password) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
    
    // Verificar confirmación de contraseña
    if (formData.confirmPassword && password !== formData.confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else {
      setConfirmPasswordError('');
    }
  };

  // const _handleConfirmPasswordChange = (confirmPassword: string) => {
    setFormData({ ...formData, confirmPassword });
    if (confirmPassword && formData.newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else {
      setConfirmPasswordError('');
    }
  };

  // const _getStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // const _getStrengthText = (strength: number) => {
    if (strength < 40) return 'Débil';
    if (strength < 70) return 'Media';
    return 'Fuerte';
  };

  // const _handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      // Validar contraseña si se está cambiando
      if (formData.newPassword) {
        if (!passwordValidation?.isValid) {
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setConfirmPasswordError('Las contraseñas no coinciden');
          return;
        }
      }

      const updateData: unknown = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        accountLocked: formData.accountLocked,
      };

      if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
      }

      onUpdate(user.id, updateData);
    }
  };

  // const _resetForm = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        accountLocked: user.accountLocked || false,
        newPassword: '',
        confirmPassword: '',
      });
    }
    setPasswordValidation(null);
    setConfirmPasswordError('');
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  if (!user) return null;

  // const _isAdmin = currentUserRole === 'ADMIN';
  // const _isManager = currentUserRole === 'MANAGER';
  // const _targetIsAdmin = user.role === 'ADMIN';
  // const _canEditRole = isAdmin; // Solo admins pueden cambiar roles
  // const _canEditStatus = (isAdmin || isManager) && user.id !== currentUser?.id; // No pueden cambiar su propio estado
  // const _canEdit = isAdmin || isManager || user.id === currentUser?.id; // Todos pueden editar su perfil

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Editar Usuario</h3>
          <p className="text-sm text-gray-500">Modifica la información del usuario</p>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Juan"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                variant="bordered"
                isDisabled={!canEdit}
              />
              <Input
                label="Apellido"
                placeholder="Pérez"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                variant="bordered"
                isDisabled={!canEdit}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                variant="bordered"
                isDisabled={!canEdit}
                className="md:col-span-2"
              />
              <Select
                label="Rol"
                placeholder="Selecciona un rol"
                selectedKeys={[formData.role]}
                onSelectionChange={(keys) => setFormData({ ...formData, role: Array.from(keys)[0] as string })}
                variant="bordered"
                isDisabled={!canEditRole}
                description={!canEditRole ? "Solo administradores pueden cambiar roles" : ""}
              >
                <SelectItem key="USER" value="USER">Usuario</SelectItem>
                <SelectItem key="MANAGER" value="MANAGER">Manager</SelectItem>
                {isAdmin && <SelectItem key="ADMIN" value="ADMIN">Administrador</SelectItem>}
              </Select>
              
              {canEditStatus && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado de la cuenta
                  </label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${!formData.accountLocked ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                        {!formData.accountLocked ? (
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {!formData.accountLocked ? 'Cuenta activa' : 'Cuenta bloqueada'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {!formData.accountLocked 
                            ? 'El usuario puede iniciar sesión normalmente' 
                            : 'El usuario no puede iniciar sesión'
                          }
                        </p>
                      </div>
                    </div>
                    <Switch
                      isSelected={!formData.accountLocked}
                      onValueChange={(checked) => setFormData({ ...formData, accountLocked: !checked })}
                      size="sm"
                      color={!formData.accountLocked ? "success" : "danger"}
                      thumbIcon={({ isSelected, className }) =>
                        isSelected ? (
                          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )
                      }
                    />
                  </div>
                  {!canEditStatus && (
                    <p className="text-xs text-gray-500 italic">
                      No puedes cambiar el estado de tu propia cuenta
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sección de cambio de contraseña mejorada */}
            <div className="mt-6 border-t pt-6">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Cambiar contraseña
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Input
                    label="Nueva contraseña"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    variant="bordered"
                    isDisabled={!canEdit}
                    placeholder="Dejar vacío para no cambiar"
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    }
                  />
                  
                  {/* Barra de fuerza de contraseña */}
                  {passwordValidation && formData.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Fuerza de contraseña:</span>
                        <span className={`font-medium ${
                          passwordValidation.strength < 40 ? 'text-red-600' : 
                          passwordValidation.strength < 70 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getStrengthText(passwordValidation.strength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordValidation.strength)}`}
                          style={{ width: `${passwordValidation.strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <Input
                  label="Confirmar contraseña"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  variant="bordered"
                  isDisabled={!canEdit || !formData.newPassword}
                  placeholder="Confirmar nueva contraseña"
                  isInvalid={!!confirmPasswordError}
                  errorMessage={confirmPasswordError}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      disabled={!formData.newPassword}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  }
                />
              </div>

              {/* Checklist de requisitos */}
              {passwordValidation && formData.newPassword && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Requisitos:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'length', label: '8+ caracteres' },
                      { key: 'uppercase', label: 'Mayúscula (A-Z)' },
                      { key: 'lowercase', label: 'Minúscula (a-z)' },
                      { key: 'number', label: 'Número (0-9)' },
                      { key: 'special', label: 'Carácter especial' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        {passwordValidation.checks[key] ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={passwordValidation.checks[key] ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Indicador de coincidencia de contraseñas */}
              {formData.newPassword && formData.confirmPassword && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  {confirmPasswordError ? (
                    <>
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-red-600">Las contraseñas no coinciden</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600">Las contraseñas coinciden</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4">
              <h4 className="font-medium mb-2">Información adicional</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Creado:</span>
                  <p>{new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <span className="text-gray-500">Último acceso:</span>
                  <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}</p>
                </div>
                <div>
                  <span className="text-gray-500">2FA:</span>
                  <p>{user.twoFactorEnabled ? 'Activado' : 'Desactivado'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Estado:</span>
                  <p className={user.accountLocked ? 'text-red-600' : 'text-green-600'}>
                    {user.accountLocked ? 'Bloqueado' : 'Activo'}
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button 
              color="primary" 
              type="submit" 
              isLoading={loading}
              isDisabled={!canEdit || (formData.newPassword && (!passwordValidation?.isValid || !!confirmPasswordError))}
              startContent={!loading && <CheckIcon className="w-4 h-4" />}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================

export default function TeamManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [inviteLoading, setInviteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  
  const { isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfigOpen, onOpen: onConfigOpen, onClose: onConfigClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Configuración de la tabla
  const [config, setConfig] = useState<TeamTableConfig>({
    density: 'normal',
    view: 'table',
    visibleColumns: new Set(['user', 'role', 'status', 'lastLogin', 'actions']),
    sortConfig: { column: 'name', direction: 'ascending' },
    filters: {
      global: '',
      role: 'ALL',
      status: 'ALL'
    },
    pagination: {
      page: 1,
      itemsPerPage: 10
    }
  });

  // ========================================================================================
  // FUNCIONES DE DATOS
  // ========================================================================================

  // const _loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Error cargando usuarios');
      }
    } catch (_error) {
console.warn('Error loading users:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  // const _handleInviteUser = async (userData: InviteUserData) => {
    setInviteLoading(true);
    setError('');
    
    // Debug: verificar los datos que se envían
// console.log('📤 Datos enviados al backend:', userData);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
// console.log('📥 Respuesta del backend:', data);
      
      if (data.success) {
        toast.success(`Usuario invitado exitosamente. Contraseña temporal: ${data.tempPassword}`);
        onInviteClose();
        loadUsers();
      } else {
        setError(data.message || 'Error invitando usuario');
        toast.error(data.message || 'Error invitando usuario');
      }
    } catch (_error) {
console.warn('Error inviting user:', error);
      setError('Error de conexión');
      toast.error('Error de conexión');
    } finally {
      setInviteLoading(false);
    }
  };

  // const _handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Usuario eliminado exitosamente');
        loadUsers();
        onDeleteClose();
      } else {
        setError(data.message || 'Error eliminando usuario');
      }
    } catch (_error) {
console.warn('Error deleting user:', error);
      setError('Error de conexión');
    }
  };

  // const _handleUpdateUser = async (userId: string, userData: Partial<User & { newPassword?: string; confirmPassword?: string }>) => {
    setEditLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Usuario actualizado exitosamente');
        onEditClose();
        loadUsers();
      } else {
        setError(data.message || 'Error actualizando usuario');
        toast.error(data.message || 'Error actualizando usuario');
      }
    } catch (_error) {
console.warn('Error updating user:', error);
      setError('Error de conexión');
      toast.error('Error de conexión');
    } finally {
      setEditLoading(false);
    }
  };

  // const _handleBulkAction = async (action: string, selectedUsers: User[]) => {
    if (selectedUsers.length === 0) return;

    try {
      const response = await fetch('/api/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userIds: selectedUsers.map(u => u.id)
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Acción ${action} aplicada a ${selectedUsers.length} usuarios`);
        loadUsers();
        setSelectedKeys(new Set([]));
      } else {
        setError(data.message || 'Error en acción masiva');
      }
    } catch (_error) {
console.warn('Error in bulk action:', error);
      setError('Error de conexión');
    }
  };

  // ========================================================================================
  // UTILIDADES
  // ========================================================================================

  // const _getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <ShieldCheckIcon className="w-4 h-4" />;
      case 'MANAGER': return <EyeIcon className="w-4 h-4" />;
      default: return <UserIcon className="w-4 h-4" />;
    }
  };

  // const _getRoleColor = (role: string): ChipProps['color'] => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'MANAGER': return 'primary';
      default: return 'default';
    }
  };

  // const _getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Manager';
      default: return 'Usuario';
    }
  };

  // const _getInitials = useCallback((user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email[0].toUpperCase();
  }, []);

  // const _getDisplayName = useCallback((user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.name) {
      return user.name;
    }
    return user.email;
  }, []);

  // const _isAdmin = currentUser?.role === 'ADMIN';
  // const _isManager = currentUser?.role === 'MANAGER';
  // const _canManageUsers = isAdmin || isManager;

  // ========================================================================================
  // FILTROS Y ORDENAMIENTO
  // ========================================================================================

  // const _filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Filtro global
    if (config.filters.global) {
      const search = config.filters.global.toLowerCase();
      filtered = filtered.filter(user => {
        // Crear displayName inline para evitar dependencias
        const displayName = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`.toLowerCase()
          : user.name?.toLowerCase() || user.email.toLowerCase();
        
        return displayName.includes(search) ||
               user.email.toLowerCase().includes(search) ||
               (user.firstName && user.firstName.toLowerCase().includes(search)) ||
               (user.lastName && user.lastName.toLowerCase().includes(search));
      });
    }

    // Filtro por rol
    if (config.filters.role !== 'ALL') {
      filtered = filtered.filter(user => user.role === config.filters.role);
    }

    // Filtro por estado
    if (config.filters.status !== 'ALL') {
      if (config.filters.status === 'ACTIVE') {
        filtered = filtered.filter(user => !user.accountLocked);
      } else if (config.filters.status === 'LOCKED') {
        filtered = filtered.filter(user => user.accountLocked);
      }
    }

    // Ordenamiento
    if (config.sortConfig.column) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        if (config.sortConfig.column === 'name') {
          aValue = a.firstName && a.lastName 
            ? `${a.firstName} ${a.lastName}`
            : a.name || a.email;
          bValue = b.firstName && b.lastName 
            ? `${b.firstName} ${b.lastName}`
            : b.name || b.email;
        } else {
          aValue = a[config.sortConfig.column as keyof User] || '';
          bValue = b[config.sortConfig.column as keyof User] || '';
        }
        
        if (config.sortConfig.direction === 'ascending') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [users, config.filters, config.sortConfig]);

  // Paginación
  // const _paginatedUsers = useMemo(() => {
    const start = (config.pagination.page - 1) * config.pagination.itemsPerPage;
    const end = start + config.pagination.itemsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, config.pagination]);

  // const _totalPages = Math.ceil(filteredUsers.length / config.pagination.itemsPerPage);

  // const _selectedUsers = useMemo(() => {
    if (selectedKeys === 'all') return paginatedUsers;
    return paginatedUsers.filter(user => selectedKeys.has(user.id));
  }, [selectedKeys, paginatedUsers]);

  // ========================================================================================
  // RENDERIZADO DE CELDAS
  // ========================================================================================

  // const _renderCell = useCallback((user: User, columnKey: React.Key) => {
    switch (columnKey) {
      case 'user':
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={getInitials(user)}
              size="sm"
              className="flex-shrink-0"
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{getDisplayName(user)}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        );
      
      case 'role':
        return (
          <Chip
            color={getRoleColor(user.role)}
            variant="flat"
            size="sm"
            startContent={getRoleIcon(user.role)}
          >
            {getRoleLabel(user.role)}
          </Chip>
        );
      
      case 'status':
        return (
          <div className="flex items-center gap-2">
            <Chip
              color={user.accountLocked ? 'danger' : 'success'}
              variant="flat"
              size="sm"
            >
              {user.accountLocked ? 'Bloqueado' : 'Activo'}
            </Chip>
            {user.twoFactorEnabled && (
              <Tooltip content="2FA Activado">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
              </Tooltip>
            )}
          </div>
        );
      
      case 'lastLogin':
        return (
          <span className="text-sm text-gray-500">
            {user.lastLogin 
              ? new Date(user.lastLogin).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              : 'Nunca'
            }
          </span>
        );
      
      case 'actions':
        return canManageUsers ? (
          <div className="flex items-center gap-2 justify-end">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="primary"
              onPress={() => {
                setUserToEdit(user);
                onEditOpen();
              }}
              aria-label="Editar usuario"
            >
              <CogIcon className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => {
                setUserToDelete(user);
                onDeleteOpen();
              }}
              aria-label="Eliminar usuario"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm text-gray-400 text-center">-</span>
        );
      
      default:
        return null;
    }
  }, [canManageUsers, onDeleteOpen, onEditOpen]);

  // ========================================================================================
  // EFECTOS
  // ========================================================================================

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // ========================================================================================
  // COLUMNAS DE LA TABLA
  // ========================================================================================

  // const _columns = [
    { key: 'user', label: 'Usuario', sortable: true },
    { key: 'role', label: 'Rol', sortable: true },
    { key: 'status', label: 'Estado', sortable: false },
    { key: 'lastLogin', label: 'Último acceso', sortable: true },
    ...(canManageUsers ? [{ key: 'actions', label: 'Acciones', sortable: false }] : [])
  ];

  // const _headerColumns = useMemo(() => {
    return columns.filter(column => config.visibleColumns.has(column.key));
  }, [columns, config.visibleColumns]);

  // ========================================================================================
  // RENDERIZADO PRINCIPAL
  // ========================================================================================

  if (loading) {
    return <LoadingSystem variant="page" message="Cargando equipo..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gestión de Equipo
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Administra los miembros de tu equipo y sus permisos
          </p>
        </div>
        {canManageUsers && (
          <Button
            color="primary"
            onPress={onInviteOpen}
            startContent={<PlusIcon className="w-4 h-4" />}
          >
            Invitar Usuario
          </Button>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Input
            placeholder="Buscar usuarios..."
            value={config.filters.global}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              filters: { ...prev.filters, global: e.target.value }
            }))}
            startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
            className="w-full sm:max-w-xs"
            variant="bordered"
          />
          <Select
            placeholder="Filtrar por rol"
            selectedKeys={[config.filters.role]}
            onSelectionChange={(keys) => setConfig(prev => ({
              ...prev,
              filters: { ...prev.filters, role: Array.from(keys)[0] as string }
            }))}
            className="w-full sm:w-48"
            variant="bordered"
          >
            {ROLE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            placeholder="Filtrar por estado"
            selectedKeys={[config.filters.status]}
            onSelectionChange={(keys) => setConfig(prev => ({
              ...prev,
              filters: { ...prev.filters, status: Array.from(keys)[0] as string }
            }))}
            className="w-full sm:w-48"
            variant="bordered"
          >
            {STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          {selectedUsers.length > 0 && canManageUsers && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {selectedUsers.length} seleccionados
              </span>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" size="sm">
                    Acciones
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem 
                    key="activate"
                    onPress={() => handleBulkAction('activate', selectedUsers)}
                  >
                    Activar usuarios
                  </DropdownItem>
                  <DropdownItem 
                    key="deactivate"
                    onPress={() => handleBulkAction('deactivate', selectedUsers)}
                  >
                    Desactivar usuarios
                  </DropdownItem>
                  <DropdownItem 
                    key="export"
                    onPress={() => handleBulkAction('export', selectedUsers)}
                  >
                    Exportar selección
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}

          {/* Config Button */}
          <Button
            isIconOnly
            variant="light"
            onPress={onConfigOpen}
          >
            <CogIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {users.length}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Total usuarios
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {users.filter(u => !u.accountLocked).length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Usuarios activos
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {users.filter(u => u.role === 'ADMIN').length}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">
            Administradores
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {users.filter(u => u.twoFactorEnabled).length}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400">
            Con 2FA activo
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table
          aria-label="Tabla de gestión de equipo"
          selectionMode={canManageUsers ? "multiple" : "none"}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          sortDescriptor={config.sortConfig}
          onSortChange={(descriptor) => setConfig(prev => ({
            ...prev,
            sortConfig: descriptor
          }))}
          className="min-h-[400px]"
          classNames={{
            wrapper: "min-h-[400px] p-0 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800",
            table: "table-auto",
            th: "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold text-sm border-b border-gray-200 dark:border-gray-600",
            td: config.density === 'compact' ? "py-3 px-4" : config.density === 'comfortable' ? "py-5 px-4" : "py-4 px-4",
            tr: "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 last:border-b-0",
          }}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.key}
                allowsSorting={column.sortable}
                className={`${column.key === 'actions' ? 'text-center w-48' : ''} ${column.key === 'user' ? 'min-w-[250px]' : ''}`}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={paginatedUsers}
            emptyContent={
              <div className="text-center py-12">
                <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {config.filters.global || config.filters.role !== 'ALL' || config.filters.status !== 'ALL'
                    ? 'No se encontraron usuarios'
                    : 'No hay usuarios en el equipo'
                  }
                </h3>
                <p className="text-gray-500">
                  {config.filters.global || config.filters.role !== 'ALL' || config.filters.status !== 'ALL'
                    ? 'Intenta ajustar los filtros para encontrar lo que buscas'
                    : 'Invita a tu primer miembro del equipo para comenzar'
                  }
                </p>
              </div>
            }
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Mostrando {((config.pagination.page - 1) * config.pagination.itemsPerPage) + 1} a{' '}
                {Math.min(config.pagination.page * config.pagination.itemsPerPage, filteredUsers.length)} de{' '}
                {filteredUsers.length} usuarios
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Select
                size="sm"
                variant="bordered"
                selectedKeys={[config.pagination.itemsPerPage.toString()]}
                onSelectionChange={(keys) => {
                  const newItemsPerPage = parseInt(Array.from(keys)[0] as string);
                  setConfig(prev => ({
                    ...prev,
                    pagination: { ...prev.pagination, itemsPerPage: newItemsPerPage, page: 1 }
                  }));
                }}
                className="w-40"
                aria-label="Elementos por página"
              >
                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                  <SelectItem key={option.value.toString()} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Pagination
                total={totalPages}
                page={config.pagination.page}
                onChange={(page) => setConfig(prev => ({
                  ...prev,
                  pagination: { ...prev.pagination, page }
                }))}
                size="sm"
                showControls
                showShadow
                color="primary"
                className="gap-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={onInviteClose}
        onInvite={handleInviteUser}
        loading={inviteLoading}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        onUpdate={handleUpdateUser}
        loading={editLoading}
        user={userToEdit}
        currentUserRole={currentUser?.role || 'USER'}
        currentUser={currentUser}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
              <span>Confirmar eliminación</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro de que deseas eliminar a{' '}
              <strong>{userToDelete ? getDisplayName(userToDelete) : ''}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete.id);
                }
              }}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Configuration Modal */}
      <Modal isOpen={isConfigOpen} onClose={onConfigClose}>
        <ModalContent>
          <ModalHeader>Configuración de tabla</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Densidad</label>
                <Select
                  selectedKeys={[config.density]}
                  onSelectionChange={(keys) => setConfig(prev => ({
                    ...prev,
                    density: Array.from(keys)[0] as 'compact' | 'normal' | 'comfortable'
                  }))}
                  variant="bordered"
                >
                  <SelectItem key="compact">Compacta</SelectItem>
                  <SelectItem key="normal">Normal</SelectItem>
                  <SelectItem key="comfortable">Cómoda</SelectItem>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Columnas visibles</label>
                <div className="space-y-2">
                  {columns.map(column => (
                    <div key={column.key} className="flex items-center">
                      <Switch
                        size="sm"
                        isSelected={config.visibleColumns.has(column.key)}
                        onValueChange={(checked) => {
                          const newColumns = new Set(config.visibleColumns);
                          if (checked) {
                            newColumns.add(column.key);
                          } else {
                            newColumns.delete(column.key);
                          }
                          setConfig(prev => ({
                            ...prev,
                            visibleColumns: newColumns
                          }));
                        }}
                      />
                      <span className="ml-2 text-sm">{column.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onConfigClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
} 