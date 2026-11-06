import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../firebase/config';
import { Note, Expense, Order, Reminder, OperationType, OrderStatus } from '../types';

const LOCAL_STORAGE_KEYS = {
  NOTES: 'mlm_notes_v1',
  EXPENSES: 'mlm_expenses_v1',
  ORDERS: 'mlm_orders_v1',
  REMINDERS: 'mlm_reminders_v1',
  GUEST_ID: 'mlm_guest_user_id',
};

// Initial mining sample data for quick start
function getInitialData(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const inThreeDays = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const initialNotes: Note[] = [
    {
      id: 'note-init-1',
      userId,
      title: 'Reporte de Guardia - Turno Noche Veta Esperanza',
      content: 'Avance de perforación: 14 metros en crucero 240. Se detectó falla menor en el sostenimiento de madera a la altura del pique 2. Se procedió a colocar 4 pernos helicoidales con resina rápida y malla electrosoldada. Ventilación operando normal.',
      date: today,
      category: 'Extracción / Socavón',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'note-init-2',
      userId,
      title: 'Mantenimiento preventivo Compresor Atlas Copco GA75',
      content: 'Cambio de filtros de aceite y separador aire/aceite completado. Nivel de lubricante sintético verificado. Presión de descarga calibrada en 7.5 bar. Próxima inspección en 250 horas.',
      date: yesterday,
      category: 'Taller / Mantenimiento',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  const initialExpenses: Expense[] = [
    {
      id: 'exp-init-1',
      userId,
      item: 'Barrenos integrales 7/8" de 4 pies',
      description: 'Acero de perforación para perforadoras Jackleg en frente de avance',
      quantity: 6,
      unitPrice: 280.00,
      total: 1680.00,
      date: today,
      supplier: 'Aceros Arequipa / Representaciones Mineras',
      miningArea: 'Explosivos & Perforación',
      paymentMethod: 'Transferencia BCP',
      receiptNumber: 'F001-002489',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'exp-init-2',
      userId,
      item: 'Diésel B5 S-50 (Petróleo)',
      description: 'Abastecimiento de 120 galones para generador eléctrico y volquete',
      quantity: 120,
      unitPrice: 18.50,
      total: 2220.00,
      date: today,
      supplier: 'Estación de Servicios El Minero SAC',
      miningArea: 'Transporte & Combustible',
      paymentMethod: 'Factura a Crédito 15 días',
      receiptNumber: 'F004-015822',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'exp-init-3',
      userId,
      item: 'Botas de jebe con puntera de acero y plantilla antiperforante',
      description: 'Calzado de seguridad para personal de interior mina (10 pares)',
      quantity: 10,
      unitPrice: 95.00,
      total: 950.00,
      date: yesterday,
      supplier: 'Comercial EPP del Centro',
      miningArea: 'Seguridad & EPP',
      paymentMethod: 'Yape / Efectivo',
      receiptNumber: 'B002-005112',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'exp-init-4',
      userId,
      item: 'Reactivo Colector Xantato Z-11',
      description: 'Tambores de reactivo para flotación en circuito de beneficio',
      quantity: 2,
      unitPrice: 1450.00,
      total: 2900.00,
      date: yesterday,
      supplier: 'Química Minera Andina',
      miningArea: 'Planta de Beneficio',
      paymentMethod: 'Transferencia Interbank',
      receiptNumber: 'F008-009120',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  const initialOrders: Order[] = [
    {
      id: 'ord-init-1',
      userId,
      productName: 'Dinamita Semigelatina 65% y Fulminantes N° 8',
      quantity: '15 cajas + 2 rollos mecha rápida',
      supplier: 'Famesa Explosivos S.A.',
      orderDate: yesterday,
      deliveryDate: inThreeDays,
      status: 'pendiente',
      notes: 'Requiere guía de tránsito y custodia PNP vigente para despacho a polvorín',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ord-init-2',
      userId,
      productName: 'Manguera de aire comprimido 3/4" alta presión (300 PSI)',
      quantity: '4 rollos de 50 metros',
      supplier: 'Mangueras y Conexiones Industriales',
      orderDate: today,
      deliveryDate: today,
      status: 'en_camino',
      notes: 'Llega en transporte Expreso del Sur a terminal local a las 4:00 PM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ord-init-3',
      userId,
      productName: 'Aceite hidráulico ISO 68 para pala neumática',
      quantity: '2 cilindros de 55 galones',
      supplier: 'Distribuidora Shell Lubritec',
      orderDate: yesterday,
      deliveryDate: today,
      status: 'recibido',
      notes: 'Recibido conforme en almacén de mina. Ingresado a inventario físico.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const initialReminders: Reminder[] = [
    {
      id: 'rem-init-1',
      userId,
      title: 'Pagar factura de combustible Grifo San Pedro',
      type: 'pago',
      dueDate: today,
      dueTime: '17:00',
      completed: false,
      priority: 'alta',
      notes: 'Monto total S/ 2,220.00. Enviar constancia de pago al WhatsApp del proveedor.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rem-init-2',
      userId,
      title: 'Recepcionar mangueras de aire en agencia de transporte',
      type: 'pedido',
      dueDate: today,
      dueTime: '16:00',
      completed: false,
      priority: 'media',
      notes: 'Llevar DNI y orden de compra impresa para retirar el envío.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rem-init-3',
      userId,
      title: 'Inspección de seguridad en chimenea y chimenea de ventilación',
      type: 'tarea',
      dueDate: inThreeDays,
      dueTime: '08:00',
      completed: false,
      priority: 'alta',
      notes: 'Revisión periódica de gases CO/NOx antes del ingreso de cuadrilla.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return { initialNotes, initialExpenses, initialOrders, initialReminders };
}

export function getGuestUserId(): string {
  let guestId = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_ID);
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_ID, guestId);
  }
  return guestId;
}

// Local Storage helpers
function getLocalItems<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setLocalItems<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Initialize local database if empty
export function initLocalStorage(userId: string) {
  const existingNotes = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTES);
  if (!existingNotes) {
    const { initialNotes, initialExpenses, initialOrders, initialReminders } = getInitialData(userId);
    setLocalItems(LOCAL_STORAGE_KEYS.NOTES, initialNotes);
    setLocalItems(LOCAL_STORAGE_KEYS.EXPENSES, initialExpenses);
    setLocalItems(LOCAL_STORAGE_KEYS.ORDERS, initialOrders);
    setLocalItems(LOCAL_STORAGE_KEYS.REMINDERS, initialReminders);
  }
}

/* =========================================================================
   NOTES SERVICE
========================================================================= */

export function subscribeNotes(
  userId: string,
  onUpdate: (notes: Note[]) => void,
  onError?: (err: Error) => void
): () => void {
  initLocalStorage(userId);

  if (auth.currentUser && auth.currentUser.uid === userId) {
    const q = query(collection(db, 'notes'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notes: Note[] = [];
        snapshot.forEach((docSnap) => {
          notes.push({ id: docSnap.id, ...(docSnap.data() as Omit<Note, 'id'>) });
        });
        // Sort by date descending
        notes.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        onUpdate(notes);
        // Also keep local cache in sync
        setLocalItems(LOCAL_STORAGE_KEYS.NOTES, notes);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'notes');
        } catch (wrapped) {
          if (onError) onError(wrapped as Error);
        }
      }
    );
    return unsubscribe;
  }

  // Fallback to local storage
  const localNotes = getLocalItems<Note[]>(LOCAL_STORAGE_KEYS.NOTES, []);
  localNotes.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  onUpdate(localNotes);

  const interval = setInterval(() => {
    const updated = getLocalItems<Note[]>(LOCAL_STORAGE_KEYS.NOTES, []);
    updated.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    onUpdate(updated);
  }, 1000);

  return () => clearInterval(interval);
}

export async function saveNote(note: Note): Promise<void> {
  const now = new Date().toISOString();
  const noteToSave: Note = {
    ...note,
    updatedAt: now,
    createdAt: note.createdAt || now,
  };

  // Local storage update
  const local = getLocalItems<Note[]>(LOCAL_STORAGE_KEYS.NOTES, []);
  const idx = local.findIndex((n) => n.id === note.id);
  if (idx >= 0) {
    local[idx] = noteToSave;
  } else {
    local.unshift(noteToSave);
  }
  setLocalItems(LOCAL_STORAGE_KEYS.NOTES, local);

  // Firestore update if logged in
  if (auth.currentUser && auth.currentUser.uid === note.userId) {
    try {
      const docRef = doc(db, 'notes', note.id);
      await setDoc(docRef, noteToSave);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `notes/${note.id}`);
    }
  }
}

export async function deleteNote(id: string, userId: string): Promise<void> {
  const local = getLocalItems<Note[]>(LOCAL_STORAGE_KEYS.NOTES, []);
  setLocalItems(LOCAL_STORAGE_KEYS.NOTES, local.filter((n) => n.id !== id));

  if (auth.currentUser && auth.currentUser.uid === userId) {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notes/${id}`);
    }
  }
}

/* =========================================================================
   EXPENSES SERVICE
========================================================================= */

export function subscribeExpenses(
  userId: string,
  onUpdate: (expenses: Expense[]) => void,
  onError?: (err: Error) => void
): () => void {
  initLocalStorage(userId);

  if (auth.currentUser && auth.currentUser.uid === userId) {
    const q = query(collection(db, 'expenses'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const expenses: Expense[] = [];
        snapshot.forEach((docSnap) => {
          expenses.push({ id: docSnap.id, ...(docSnap.data() as Omit<Expense, 'id'>) });
        });
        expenses.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        onUpdate(expenses);
        setLocalItems(LOCAL_STORAGE_KEYS.EXPENSES, expenses);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'expenses');
        } catch (wrapped) {
          if (onError) onError(wrapped as Error);
        }
      }
    );
    return unsubscribe;
  }

  const localExpenses = getLocalItems<Expense[]>(LOCAL_STORAGE_KEYS.EXPENSES, []);
  localExpenses.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  onUpdate(localExpenses);

  const interval = setInterval(() => {
    const updated = getLocalItems<Expense[]>(LOCAL_STORAGE_KEYS.EXPENSES, []);
    updated.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    onUpdate(updated);
  }, 1000);

  return () => clearInterval(interval);
}

export async function saveExpense(expense: Expense): Promise<void> {
  const now = new Date().toISOString();
  const expenseToSave: Expense = {
    ...expense,
    total: Math.round(expense.quantity * expense.unitPrice * 100) / 100,
    updatedAt: now,
    createdAt: expense.createdAt || now,
  };

  const local = getLocalItems<Expense[]>(LOCAL_STORAGE_KEYS.EXPENSES, []);
  const idx = local.findIndex((e) => e.id === expense.id);
  if (idx >= 0) {
    local[idx] = expenseToSave;
  } else {
    local.unshift(expenseToSave);
  }
  setLocalItems(LOCAL_STORAGE_KEYS.EXPENSES, local);

  if (auth.currentUser && auth.currentUser.uid === expense.userId) {
    try {
      const docRef = doc(db, 'expenses', expense.id);
      await setDoc(docRef, expenseToSave);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `expenses/${expense.id}`);
    }
  }
}

export async function deleteExpense(id: string, userId: string): Promise<void> {
  const local = getLocalItems<Expense[]>(LOCAL_STORAGE_KEYS.EXPENSES, []);
  setLocalItems(LOCAL_STORAGE_KEYS.EXPENSES, local.filter((e) => e.id !== id));

  if (auth.currentUser && auth.currentUser.uid === userId) {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `expenses/${id}`);
    }
  }
}

/* =========================================================================
   ORDERS SERVICE
========================================================================= */

export function subscribeOrders(
  userId: string,
  onUpdate: (orders: Order[]) => void,
  onError?: (err: Error) => void
): () => void {
  initLocalStorage(userId);

  if (auth.currentUser && auth.currentUser.uid === userId) {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
        });
        orders.sort((a, b) => (b.orderDate || '').localeCompare(a.orderDate || ''));
        onUpdate(orders);
        setLocalItems(LOCAL_STORAGE_KEYS.ORDERS, orders);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        } catch (wrapped) {
          if (onError) onError(wrapped as Error);
        }
      }
    );
    return unsubscribe;
  }

  const localOrders = getLocalItems<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
  localOrders.sort((a, b) => (b.orderDate || '').localeCompare(a.orderDate || ''));
  onUpdate(localOrders);

  const interval = setInterval(() => {
    const updated = getLocalItems<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
    updated.sort((a, b) => (b.orderDate || '').localeCompare(a.orderDate || ''));
    onUpdate(updated);
  }, 1000);

  return () => clearInterval(interval);
}

export async function saveOrder(order: Order): Promise<void> {
  const now = new Date().toISOString();
  const orderToSave: Order = {
    ...order,
    updatedAt: now,
    createdAt: order.createdAt || now,
  };

  const local = getLocalItems<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
  const idx = local.findIndex((o) => o.id === order.id);
  if (idx >= 0) {
    local[idx] = orderToSave;
  } else {
    local.unshift(orderToSave);
  }
  setLocalItems(LOCAL_STORAGE_KEYS.ORDERS, local);

  if (auth.currentUser && auth.currentUser.uid === order.userId) {
    try {
      const docRef = doc(db, 'orders', order.id);
      await setDoc(docRef, orderToSave);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${order.id}`);
    }
  }
}

export async function updateOrderStatus(id: string, userId: string, status: OrderStatus): Promise<void> {
  const local = getLocalItems<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
  const idx = local.findIndex((o) => o.id === id);
  if (idx >= 0) {
    local[idx].status = status;
    local[idx].updatedAt = new Date().toISOString();
    setLocalItems(LOCAL_STORAGE_KEYS.ORDERS, local);
  }

  if (auth.currentUser && auth.currentUser.uid === userId) {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  }
}

export async function deleteOrder(id: string, userId: string): Promise<void> {
  const local = getLocalItems<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
  setLocalItems(LOCAL_STORAGE_KEYS.ORDERS, local.filter((o) => o.id !== id));

  if (auth.currentUser && auth.currentUser.uid === userId) {
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${id}`);
    }
  }
}

/* =========================================================================
   REMINDERS SERVICE
========================================================================= */

export function subscribeReminders(
  userId: string,
  onUpdate: (reminders: Reminder[]) => void,
  onError?: (err: Error) => void
): () => void {
  initLocalStorage(userId);

  if (auth.currentUser && auth.currentUser.uid === userId) {
    const q = query(collection(db, 'reminders'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reminders: Reminder[] = [];
        snapshot.forEach((docSnap) => {
          reminders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Reminder, 'id'>) });
        });
        reminders.sort((a, b) => {
          const compA = a.completed ? 1 : 0;
          const compB = b.completed ? 1 : 0;
          if (compA !== compB) return compA - compB;
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        });
        onUpdate(reminders);
        setLocalItems(LOCAL_STORAGE_KEYS.REMINDERS, reminders);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'reminders');
        } catch (wrapped) {
          if (onError) onError(wrapped as Error);
        }
      }
    );
    return unsubscribe;
  }

  const localReminders = getLocalItems<Reminder[]>(LOCAL_STORAGE_KEYS.REMINDERS, []);
  localReminders.sort((a, b) => {
    const compA = a.completed ? 1 : 0;
    const compB = b.completed ? 1 : 0;
    if (compA !== compB) return compA - compB;
    return (a.dueDate || '').localeCompare(b.dueDate || '');
  });
  onUpdate(localReminders);

  const interval = setInterval(() => {
    const updated = getLocalItems<Reminder[]>(LOCAL_STORAGE_KEYS.REMINDERS, []);
    updated.sort((a, b) => {
      const compA = a.completed ? 1 : 0;
      const compB = b.completed ? 1 : 0;
      if (compA !== compB) return compA - compB;
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    });
    onUpdate(updated);
  }, 1000);

  return () => clearInterval(interval);
}

export async function saveReminder(reminder: Reminder): Promise<void> {
  const now = new Date().toISOString();
  const reminderToSave: Reminder = {
    ...reminder,
    updatedAt: now,
    createdAt: reminder.createdAt || now,
  };

  const local = getLocalItems<Reminder[]>(LOCAL_STORAGE_KEYS.REMINDERS, []);
  const idx = local.findIndex((r) => r.id === reminder.id);
  if (idx >= 0) {
    local[idx] = reminderToSave;
  } else {
    local.unshift(reminderToSave);
  }
  setLocalItems(LOCAL_STORAGE_KEYS.REMINDERS, local);

  if (auth.currentUser && auth.currentUser.uid === reminder.userId) {
    try {
      const docRef = doc(db, 'reminders', reminder.id);
      await setDoc(docRef, reminderToSave);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `reminders/${reminder.id}`);
    }
  }
}

export async function toggleReminderComplete(id: string, userId: string, completed: boolean): Promise<void> {
  const local = getLocalItems<Reminder[]>(LOCAL_STORAGE_KEYS.REMINDERS, []);
  const idx = local.findIndex((r) => r.id === id);
  if (idx >= 0) {
    local[idx].completed = completed;
    local[idx].updatedAt = new Date().toISOString();
    setLocalItems(LOCAL_STORAGE_KEYS.REMINDERS, local);
  }

  if (auth.currentUser && auth.currentUser.uid === userId) {
    try {
      await updateDoc(doc(db, 'reminders', id), {
        completed,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `reminders/${id}`);
    }
  }
}

export async function deleteReminder(id: string, userId: string): Promise<void> {
  const local = getLocalItems<Reminder[]>(LOCAL_STORAGE_KEYS.REMINDERS, []);
  setLocalItems(LOCAL_STORAGE_KEYS.REMINDERS, local.filter((r) => r.id !== id));

  if (auth.currentUser && auth.currentUser.uid === userId) {
    try {
      await deleteDoc(doc(db, 'reminders', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reminders/${id}`);
    }
  }
}

// Upload local guest data to user's Firestore cloud account when logging in
export async function syncLocalDataToFirestore(targetUserId: string) {
  const notes = getLocalItems<Note[]>(LOCAL_STORAGE_KEYS.NOTES, []);
  const expenses = getLocalItems<Expense[]>(LOCAL_STORAGE_KEYS.EXPENSES, []);
  const orders = getLocalItems<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
  const reminders = getLocalItems<Reminder[]>(LOCAL_STORAGE_KEYS.REMINDERS, []);

  for (const n of notes) {
    const updatedNote = { ...n, userId: targetUserId };
    await setDoc(doc(db, 'notes', n.id), updatedNote);
  }
  for (const e of expenses) {
    const updatedExp = { ...e, userId: targetUserId };
    await setDoc(doc(db, 'expenses', e.id), updatedExp);
  }
  for (const o of orders) {
    const updatedOrd = { ...o, userId: targetUserId };
    await setDoc(doc(db, 'orders', o.id), updatedOrd);
  }
  for (const r of reminders) {
    const updatedRem = { ...r, userId: targetUserId };
    await setDoc(doc(db, 'reminders', r.id), updatedRem);
  }
}

export async function clearAllData(userId: string) {
  setLocalItems(LOCAL_STORAGE_KEYS.NOTES, []);
  setLocalItems(LOCAL_STORAGE_KEYS.EXPENSES, []);
  setLocalItems(LOCAL_STORAGE_KEYS.ORDERS, []);
  setLocalItems(LOCAL_STORAGE_KEYS.REMINDERS, []);

  if (auth.currentUser && auth.currentUser.uid === userId) {
    // Delete documents for current user
    const noteDocs = getLocalItems<Note[]>(LOCAL_STORAGE_KEYS.NOTES, []);
    for (const n of noteDocs) {
      await deleteDoc(doc(db, 'notes', n.id)).catch(() => {});
    }
  }
}

