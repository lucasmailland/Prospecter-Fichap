"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Avatar,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Lead, UserRole, LeadStatus } from "@/types/common.types";
import LoadingSystem from '@/components/ui/LoadingSystem';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CogIcon
} from '@heroicons/react/24/outline';

// Mapeo de colores para estados
const statusColorMap: Record<string, ChipProps["color"]> = {
  NEW: "default",
  ENRICHED: "primary", 
  VALIDATED: "secondary",
  PRIORITIZED: "warning",
  CONTACTED: "success",
  CONVERTED: "success",
  LOST: "danger",
};

// Mapeo de etiquetas en español
const statusLabels: Record<string, string> = {
  NEW: "Nuevo",
  ENRICHED: "Enriquecido", 
  VALIDATED: "Validado",
  PRIORITIZED: "Priorizado",
  CONTACTED: "Contactado",
  CONVERTED: "Convertido",
  LOST: "Perdido",
};

// Configuración de columnas expandida
const columns = [
  { name: "LEAD", uid: "name", sortable: true },
  { name: "EMPRESA", uid: "company", sortable: true },
  { name: "CARGO", uid: "jobTitle", sortable: true },
  { name: "INDUSTRIA", uid: "industry", sortable: true },
  { name: "PAÍS", uid: "country", sortable: true },
  { name: "ESTADO", uid: "status", sortable: true },
  { name: "SCORE IA", uid: "score", sortable: true },
  { name: "PRIORIDAD", uid: "priority", sortable: true },
  { name: "FUENTE", uid: "source", sortable: true },
  { name: "ÚLTIMO CONTACTO", uid: "lastContactedAt", sortable: true },
  { name: "CREADO", uid: "createdAt", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "company", "jobTitle", "status", "score", "priority", "createdAt", "actions"];

interface HeroUILeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  userRole?: UserRole;
  onLeadSelect?: (lead: Lead) => void;
  onLeadEdit?: (lead: Lead) => void;
  onLeadDelete?: (lead: Lead) => void;
  onBulkAction?: (action: string, selectedLeads: Lead[]) => void;
  onRefresh?: () => void;
}

// Función para generar avatar con iniciales
const getAvatarInitials = (firstName?: string, lastName?: string, fullName?: string, email?: string) => {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (fullName) {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return "?";
};

// Función para generar color de avatar basado en el nombre
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500"
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Función para obtener flag de país
const getCountryFlag = (country?: string) => {
  const flags: Record<string, string> = {
    'España': '🇪🇸',
    'Estados Unidos': '🇺🇸',
    'Francia': '🇫🇷',
    'Alemania': '🇩🇪',
    'Italia': '🇮🇹',
    'Reino Unido': '🇬🇧',
    'Japón': '🇯🇵',
    'Brasil': '🇧🇷',
    'México': '🇲🇽',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'Colombia': '🇨🇴',
    'Perú': '🇵🇪',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
  };
  return flags[country || ''] || '🌍';
};

// Función para obtener prioridad con colores
const getPriorityChip = (priority: number) => {
  if (priority >= 4) return { color: "danger" as const, label: "Urgente", icon: "🔥" };
  if (priority >= 3) return { color: "warning" as const, label: "Alta", icon: "⚡" };
  if (priority >= 2) return { color: "primary" as const, label: "Media", icon: "📋" };
  return { color: "default" as const, label: "Baja", icon: "📝" };
};

// Función para obtener fuente con iconos
const getSourceIcon = (source?: string) => {
  const sources: Record<string, { icon: string; label: string }> = {
    'WEBSITE': { icon: 'solar:global-linear', label: 'Web' },
    'API': { icon: 'solar:code-linear', label: 'API' },
    'MANUAL': { icon: 'solar:user-linear', label: 'Manual' },
    'IMPORT': { icon: 'solar:import-linear', label: 'Importado' },
    'REFERRAL': { icon: 'solar:users-group-two-rounded-linear', label: 'Referido' },
    'LINKEDIN': { icon: 'solar:linkedin-linear', label: 'LinkedIn' },
    'EMAIL': { icon: 'solar:letter-linear', label: 'Email' },
  };
  return sources[source || ''] || { icon: 'solar:question-circle-linear', label: source || 'Desconocido' };
};

export const HeroUILeadsTable: React.FC<HeroUILeadsTableProps> = ({
  leads = [],
  loading = false,
  userRole = UserRole.USER,
  onLeadSelect,
  onLeadEdit,
  onLeadDelete,
  onBulkAction,
  onRefresh,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredLeads = [...leads];

    if (hasSearchFilter) {
      filteredLeads = filteredLeads.filter((lead) =>
        lead.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
        lead.fullName?.toLowerCase().includes(filterValue.toLowerCase()) ||
        lead.company?.toLowerCase().includes(filterValue.toLowerCase()) ||
        lead.firstName?.toLowerCase().includes(filterValue.toLowerCase()) ||
        lead.lastName?.toLowerCase().includes(filterValue.toLowerCase()) ||
        lead.jobTitle?.toLowerCase().includes(filterValue.toLowerCase()) ||
        lead.industry?.toLowerCase().includes(filterValue.toLowerCase()) ||
        lead.country?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length !== Object.keys(LeadStatus).length) {
      filteredLeads = filteredLeads.filter((lead) =>
        Array.from(statusFilter).includes(lead.status)
      );
    }

    return filteredLeads;
  }, [leads, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Lead, b: Lead) => {
      const first = a[sortDescriptor.column as keyof Lead] as any;
      const second = b[sortDescriptor.column as keyof Lead] as any;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const selectedLeads = useMemo(() => {
    if (selectedKeys === "all") return filteredItems;
    return filteredItems.filter((lead) => (selectedKeys as Set<string>).has(lead.id));
  }, [selectedKeys, filteredItems]);

  const renderCell = useCallback((lead: Lead, columnKey: React.Key) => {
    const fullName = lead.fullName || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Sin nombre';
    const initials = getAvatarInitials(lead.firstName, lead.lastName, lead.fullName, lead.email);
    const avatarColor = getAvatarColor(fullName);

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm`}>
              {initials}
            </div>
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{fullName}</p>
              <p className="text-bold text-xs text-default-400">{lead.email}</p>
              {lead.phone && (
                <p className="text-xs text-default-400">{lead.phone}</p>
              )}
            </div>
          </div>
        );
      case "company":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{lead.company || 'Sin empresa'}</p>
            {lead.companySize && (
              <p className="text-xs text-default-400">{lead.companySize} empleados</p>
            )}
            {lead.website && (
              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                <Icon icon="solar:link-linear" className="w-3 h-3 inline mr-1" />
                Web
              </a>
            )}
          </div>
        );
      case "jobTitle":
        return (
          <div className="flex flex-col">
            <p className="text-sm">{lead.jobTitle || '-'}</p>
            {lead.linkedinUrl && (
              <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                <Icon icon="solar:linkedin-linear" className="w-3 h-3 inline mr-1" />
                LinkedIn
              </a>
            )}
          </div>
        );
      case "industry":
        return (
          <div className="flex items-center gap-2">
            <Icon icon="solar:buildings-linear" className="w-4 h-4 text-default-400" />
            <span className="text-sm capitalize">{lead.industry || '-'}</span>
          </div>
        );
      case "country":
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCountryFlag(lead.country)}</span>
            <div className="flex flex-col">
              <span className="text-sm">{lead.country || '-'}</span>
              {lead.city && (
                <span className="text-xs text-default-400">{lead.city}</span>
              )}
            </div>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[lead.status] || "default"}
            size="sm"
            variant="flat"
          >
            {statusLabels[lead.status] || lead.status}
          </Chip>
        );
      case "score":
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getScoreColor(lead.score)}`} />
            <span className="text-sm font-medium">{Math.round(lead.score)}/100</span>
            <Chip size="sm" variant="dot" color={getScoreChipColor(lead.score)}>
              {getScoreCategory(lead.score)}
            </Chip>
          </div>
        );
      case "priority":
        const priorityData = getPriorityChip(lead.priority);
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{priorityData.icon}</span>
            <Chip size="sm" color={priorityData.color} variant="flat">
              {priorityData.label}
            </Chip>
          </div>
        );
      case "source":
        const sourceData = getSourceIcon(lead.source);
        return (
          <div className="flex items-center gap-2">
            <Icon icon={sourceData.icon} className="w-4 h-4 text-default-400" />
            <span className="text-sm">{sourceData.label}</span>
          </div>
        );
      case "lastContactedAt":
        return (
          <div className="flex flex-col">
            {lead.lastContactedAt ? (
              <>
                <span className="text-sm">
                  {new Date(lead.lastContactedAt).toLocaleDateString('es-ES', { 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span className="text-xs text-default-400">
                  {new Date(lead.lastContactedAt).toLocaleTimeString('es-ES', { 
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </>
            ) : (
              <span className="text-sm text-default-400">Sin contacto</span>
            )}
          </div>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <span className="text-sm">
              {new Date(lead.createdAt).toLocaleDateString('es-ES', { 
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <span className="text-xs text-default-400">
              {new Date(lead.createdAt).toLocaleTimeString('es-ES', { 
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-1">
            <Tooltip content="Ver detalles">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onLeadSelect?.(lead)}
                className="text-default-400 hover:text-primary"
              >
                <Icon icon="solar:eye-linear" className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Editar lead">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onLeadEdit?.(lead)}
                className="text-default-400 hover:text-primary"
              >
                <Icon icon="solar:pen-linear" className="w-4 h-4" />
              </Button>
            </Tooltip>
            {(userRole === UserRole.ADMIN || userRole === UserRole.MANAGER) && (
              <Tooltip color="danger" content="Eliminar lead">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onLeadDelete?.(lead)}
                  className="text-default-400 hover:text-danger"
                >
                  <Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4" />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      default:
        return lead[columnKey as keyof Lead]?.toString() || '-';
    }
  }, [userRole, onLeadSelect, onLeadEdit, onLeadDelete]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre, empresa, email, país..."
            startContent={<Icon icon="solar:magnifer-linear" className="w-4 h-4" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4" />}
                  variant="flat"
                  size="sm"
                >
                  <Icon icon="solar:filter-linear" className="w-4 h-4" />
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtro de estado"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <DropdownItem key={key} className="capitalize">
                    {label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4" />}
                  variant="flat"
                  size="sm"
                >
                  <Icon icon="solar:eye-linear" className="w-4 h-4" />
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de tabla"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Tooltip content="Actualizar datos">
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                onPress={onRefresh}
              >
                <Icon icon="solar:refresh-linear" className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            <Icon icon="solar:users-group-rounded-linear" className="w-4 h-4 inline mr-1" />
            {filteredItems.length} de {leads.length} leads
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        
        {/* Acciones masivas */}
        {selectedLeads.length > 0 && (
          <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <CardBody className="py-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:check-circle-linear" className="w-5 h-5 text-primary" />
                  <span className="text-small text-primary font-medium">
                    {selectedKeys === "all" ? "Todos los leads seleccionados" : `${selectedLeads.length} leads seleccionados`}
                  </span>
                </div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" color="primary" variant="flat">
                      Acciones seleccionadas
                      <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Acciones masivas"
                    onAction={(key) => {
                      onBulkAction?.(key as string, selectedLeads);
                    }}
                  >
                    <DropdownItem key="mark-contacted" startContent={<Icon icon="solar:phone-linear" className="w-4 h-4" />}>
                      Marcar como contactado
                    </DropdownItem>
                    <DropdownItem key="mark-qualified" startContent={<Icon icon="solar:verified-check-linear" className="w-4 h-4" />}>
                      Marcar como calificado
                    </DropdownItem>
                    <DropdownItem key="change-priority" startContent={<Icon icon="solar:flag-linear" className="w-4 h-4" />}>
                      Cambiar prioridad
                    </DropdownItem>
                    <DropdownItem key="export-csv" startContent={<Icon icon="solar:download-linear" className="w-4 h-4" />}>
                      Exportar a CSV
                    </DropdownItem>
                    <DropdownItem key="copy-data" startContent={<Icon icon="solar:copy-linear" className="w-4 h-4" />}>
                      Copiar datos
                    </DropdownItem>
                    <DropdownItem 
                      key="delete-leads" 
                      className="text-danger" 
                      color="danger"
                      startContent={<Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4" />}
                    >
                      Eliminar seleccionados
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    leads.length,
    filteredItems.length,
    selectedLeads,
    selectedKeys,
    rowsPerPage,
    onSearchChange,
    onClear,
    onRefresh,
    onBulkAction,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Todos los elementos seleccionados"
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={() => setPage(1)}>
            Primero
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={() => setPage(pages)}>
            Último
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center h-64">
          <LoadingSystem variant="inline" message="Cargando leads..." size="md" />
        </CardBody>
      </Card>
    );
  }

  return (
    <Table
      aria-label="Tabla avanzada de leads con gestión completa"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[700px]",
        th: "bg-default-100 text-default-600 text-tiny font-semibold",
        td: "py-4",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        emptyContent={
          <div className="flex flex-col items-center gap-4 py-8">
            <Icon icon="solar:users-group-rounded-linear" className="w-12 h-12 text-default-300" />
            <div className="text-center">
              <p className="text-default-500 font-medium">No se encontraron leads</p>
              <p className="text-default-400 text-small">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
        } 
        items={sortedItems}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

// Funciones auxiliares para score
function getScoreColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  if (score >= 40) return "bg-secondary";
  return "bg-danger";
}

function getScoreChipColor(score: number): ChipProps["color"] {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  if (score >= 40) return "secondary";
  return "danger";
}

function getScoreCategory(score: number): string {
  if (score >= 80) return "HOT";
  if (score >= 60) return "WARM";
  if (score >= 40) return "COLD";
  return "LOW";
} 