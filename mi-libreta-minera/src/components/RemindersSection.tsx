import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Volume2, 
  CreditCard, 
  Package, 
  ShoppingCart, 
  CheckSquare, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { Reminder, ReminderType, ReminderPriority } from '../types';
import { formatDate, getTodayString } from '../utils/formatters';
import { playChimeSound, requestNotificationPermission } from '../services/notificationService';
import { Modal } from './Modal';

interface RemindersSectionProps {
  reminders: Reminder[];
  onSaveReminder: (reminder: Reminder) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
  userId: string;
  initialOpenModal?: boolean;
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({
  reminders,
  onSaveReminder,
  onToggleComplete,
  onDeleteReminder,
  userId,
  initialOpenModal = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(initialOpenModal);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'pendientes' | 'completados' | 'todos'>('pendientes');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderType>('pago');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('09:00');
  const [priority, setPriority] = useState<ReminderPriority>('alta');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [notifPermissionState, setNotifPermissionState] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const today = getTodayString();

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermissionState(perm);
    playChimeSound('reminder');
  };

  const filteredReminders = useMemo(() => {
    return reminders.filter((r) => {
      const matchSearch =
        (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.notes || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = typeFilter === 'todos' || r.type === typeFilter;

      const matchStatus =
        statusFilter === 'todos'
          ? true
          : statusFilter === 'pendientes'
          ? !r.completed
          : r.completed;

      return matchSearch && matchType && matchStatus;
    });
  }, [reminders, searchQuery, typeFilter, statusFilter]);

  const openNewReminderModal = () => {
    setEditingReminderId(null);
    setTitle('');
    setType('pago');
    setDueDate(getTodayString());
    setDueTime('09:00');
    setPriority('alta');
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditReminderModal = (rem: Reminder) => {
    setEditingReminderId(rem.id);
    setTitle(rem.title);
    setType(rem.type);
    setDueDate(rem.dueDate || getTodayString());
    setDueTime(rem.dueTime || '09:00');
    setPriority(rem.priority || 'media');
    setNotes(rem.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Por favor ingresa el título o asunto del aviso.');
      return;
    }
    if (!dueDate) {
      setFormError('Por favor selecciona la fecha programada.');
      return;
    }

    const reminderToSave: Reminder = {
      id: editingReminderId || 'recordatorio_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      title: title.trim(),
      type,
      dueDate,
      dueTime: dueTime || undefined,
      completed: false,
      priority,
      notes: notes.trim() || undefined,
    };

    await onSaveReminder(reminderToSave);
    playChimeSound('success');
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el recordatorio "${name}"?`)) {
      await onDeleteReminder(id);
    }
  };

  const getTypeIcon = (t: ReminderType) => {
    switch (t) {
      case 'pago':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'pedido':
        return <Package className="w-4 h-4 text-blue-400" />;
      case 'compra':
        return <ShoppingCart className="w-4 h-4 text-amber-400" />;
      case 'tarea':
        return <CheckSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-rose-400" />;
    }
  };

  const getTypeLabel = (t: ReminderType) => {
    switch (t) {
      case 'pago': return 'Pago';
      case 'pedido': return 'Pedido';
      case 'compra': return 'Compra';
      case 'tarea': return 'Tarea pendiente';
      default: return 'General';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-400" />
            Avisos y Recordatorios de Operación
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Programación de alertas con fecha y hora para pagos a proveedores, llegadas de pedidos y tareas críticas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {notifPermissionState !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>Activar Notificaciones</span>
            </button>
          )}

          <button
            onClick={openNewReminderModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Crear Recordatorio</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar recordatorio..."
              className="w-full pl-9 pr-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Status Segment */}
          <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setStatusFilter('pendientes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'pendientes'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setStatusFilter('completados')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'completados'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completados
            </button>
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'todos'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Tipo de aviso:
          </span>
          {[
            { id: 'todos', label: 'Todos los avisos' },
            { id: 'pago', label: 'Pagos' },
            { id: 'pedido', label: 'Pedidos' },
            { id: 'compra', label: 'Compras' },
            { id: 'tarea', label: 'Tareas pendientes' },
            { id: 'general', label: 'General' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTypeFilter(item.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === item.id
                  ? 'bg-slate-700 text-amber-300 border border-slate-600'
                  : 'bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold">No hay recordatorios con este criterio.</p>
            <button
              onClick={openNewReminderModal}
              className="mt-3 text-xs font-bold text-amber-400 hover:underline"
            >
              + Crear primer recordatorio
            </button>
          </div>
        ) : (
          filteredReminders.map((rem) => {
            const isToday = rem.dueDate === today;
            const isOverdue = rem.dueDate < today && !rem.completed;

            return (
              <div
                key={rem.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  rem.completed
                    ? 'bg-slate-900/60 border-slate-800/60 opacity-60'
                    : isOverdue
                    ? 'bg-slate-900 border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : isToday
                    ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left: Checkbox + Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => {
                      onToggleComplete(rem.id, !rem.completed);
                      if (!rem.completed) playChimeSound('success');
                    }}
                    className={`mt-1 shrink-0 transition-colors ${
                      rem.completed
                        ? 'text-emerald-400'
                        : 'text-slate-500 hover:text-amber-400'
                    }`}
                    title={rem.completed ? 'Marcar como pendiente' : 'Marcar como completado'}
                  >
                    {rem.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Type Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                        {getTypeIcon(rem.type)}
                        <span>{getTypeLabel(rem.type)}</span>
                      </span>

                      {/* Priority Badge */}
                      {rem.priority === 'alta' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Prioridad Alta
                        </span>
                      )}
                      {rem.priority === 'media' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Media
                        </span>
                      )}

                      {/* Due Today / Overdue Flag */}
                      {isOverdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                          Aviso Vencido
                        </span>
                      )}
                      {isToday && !rem.completed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Programado para Hoy
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm sm:text-base font-bold ${
                      rem.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}>
                      {rem.title}
                    </h4>

                    {rem.notes && (
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {rem.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Date, Time & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{formatDate(rem.dueDate)}</span>
                    {rem.dueTime && (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400 ml-1" />
                        <span className="text-amber-400">{rem.dueTime}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditReminderModal(rem)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Editar recordatorio"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rem.id, rem.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Eliminar recordatorio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal para Crear / Editar Recordatorio */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReminderId ? 'Editar Recordatorio' : 'Crear Nuevo Recordatorio'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          {/* 1. Título o Asunto */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Título o Asunto del Aviso *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Pagar diésel Grifo San Pedro, Recepcionar explosivos..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* 2. Tipo de Aviso & Prioridad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Tipo de Recordatorio *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReminderType)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                <option value="pago">Pago (Sueldos, Facturas, Canon)</option>
                <option value="pedido">Pedido (Llegada, Despacho)</option>
                <option value="compra">Compra (Insumos, Repuestos)</option>
                <option value="tarea">Tarea pendiente (Mantenimiento, Seguridad)</option>
                <option value="general">Aviso general</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nivel de Prioridad *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReminderPriority)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                <option value="alta">Alta (Urgente)</option>
                <option value="media">Media (Estándar)</option>
                <option value="baja">Baja (Informativo)</option>
              </select>
            </div>
          </div>

          {/* 3. Fecha y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Fecha del Aviso *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Hora del Aviso (HH:MM)
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* 4. Notas adicionales */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Detalles u observaciones
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles sobre números de cuenta, teléfonos de contacto, etc."
              rows={2}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-md shadow-amber-500/20"
            >
              {editingReminderId ? 'Guardar Cambios' : 'Crear Recordatorio'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
