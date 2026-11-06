export type MiningArea = 
  | 'Extracción / Socavón'
  | 'Planta de Beneficio'
  | 'Taller / Mantenimiento'
  | 'Seguridad & EPP'
  | 'Campamento & Alimentos'
  | 'Transporte & Combustible'
  | 'Explosivos & Perforación'
  | 'Administración & Legal'
  | 'Medio Ambiente'
  | 'Otro';

export const MINING_AREAS: MiningArea[] = [
  'Extracción / Socavón',
  'Planta de Beneficio',
  'Taller / Mantenimiento',
  'Seguridad & EPP',
  'Campamento & Alimentos',
  'Transporte & Combustible',
  'Explosivos & Perforación',
  'Administración & Legal',
  'Medio Ambiente',
  'Otro'
];

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  id: string;
  userId: string;
  item: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string; // YYYY-MM-DD
  supplier: string;
  miningArea: MiningArea | string;
  paymentMethod?: string;
  receiptNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'pendiente' | 'en_camino' | 'recibido' | 'cancelado';

export interface Order {
  id: string;
  userId: string;
  productName: string;
  quantity: string;
  supplier: string;
  orderDate: string; // YYYY-MM-DD
  deliveryDate?: string; // YYYY-MM-DD
  status: OrderStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ReminderType = 'pedido' | 'pago' | 'compra' | 'tarea' | 'general';
export type ReminderPriority = 'alta' | 'media' | 'baja';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  type: ReminderType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  completed: boolean;
  priority?: ReminderPriority;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NavigationTab = 'inicio' | 'apuntes' | 'gastos' | 'pedidos' | 'recordatorios' | 'calendario';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}
