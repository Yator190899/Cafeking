import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Receipt, 
  Bell, 
  Package, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Clock, 
  CalendarDays,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Note, Expense, Order, Reminder, NavigationTab } from '../types';
import { formatCurrency, formatDate, getTodayString } from '../utils/formatters';

interface CalendarSectionProps {
  notes: Note[];
  expenses: Expense[];
  orders: Order[];
  reminders: Reminder[];
  onQuickNew: (type: 'gasto' | 'apunte' | 'pedido' | 'recordatorio', defaultDate?: string) => void;
  onToggleReminder: (id: string, completed: boolean) => void;
  onReceiveOrder: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  notes,
  expenses,
  orders,
  reminders,
  onQuickNew,
  onToggleReminder,
  onReceiveOrder,
  onNavigate,
}) => {
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // Calendar month/year navigation state
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); // 0-11

  // Filter toggles
  const [showExpenses, setShowExpenses] = useState(true);
  const [showReminders, setShowReminders] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [showNotes, setShowNotes] = useState(true);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(today);
  };

  // Build calendar matrix (Monday through Sunday)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Day of week: 0 is Sunday, so convert to 0 = Monday ... 6 = Sunday
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const totalDays = lastDayOfMonth.getDate();
    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      const m = String(prevDate.getMonth() + 1).padStart(2, '0');
      const d = String(dayNum).padStart(2, '0');
      days.push({
        dateStr: `${prevDate.getFullYear()}-${m}-${d}`,
        dayNumber: dayNum,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const m = String(currentMonth + 1).padStart(2, '0');
      const d = String(day).padStart(2, '0');
      days.push({
        dateStr: `${currentYear}-${m}-${d}`,
        dayNumber: day,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill out 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(currentYear, currentMonth + 1, day);
      const m = String(nextDate.getMonth() + 1).padStart(2, '0');
      const d = String(day).padStart(2, '0');
      days.push({
        dateStr: `${nextDate.getFullYear()}-${m}-${d}`,
        dayNumber: day,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Aggregate items by date (YYYY-MM-DD)
  const itemsByDate = useMemo(() => {
    const map = new Map<string, {
      expensesTotal: number;
      expensesCount: number;
      remindersCount: number;
      ordersCount: number;
      notesCount: number;
    }>();

    const getEntry = (dateKey: string) => {
      let entry = map.get(dateKey);
      if (!entry) {
        entry = {
          expensesTotal: 0,
          expensesCount: 0,
          remindersCount: 0,
          ordersCount: 0,
          notesCount: 0,
        };
        map.set(dateKey, entry);
      }
      return entry;
    };

    expenses.forEach((e) => {
      if (e.date) {
        const entry = getEntry(e.date);
        entry.expensesTotal += (e.total || 0);
        entry.expensesCount += 1;
      }
    });

    reminders.forEach((r) => {
      if (r.dueDate) {
        const entry = getEntry(r.dueDate);
        entry.remindersCount += 1;
      }
    });

    orders.forEach((o) => {
      const targetDate = o.deliveryDate || o.orderDate;
      if (targetDate) {
        const entry = getEntry(targetDate);
        entry.ordersCount += 1;
      }
    });

    notes.forEach((n) => {
      if (n.date) {
        const entry = getEntry(n.date);
        entry.notesCount += 1;
      }
    });

    return map;
  }, [expenses, reminders, orders, notes]);

  // Month totals
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthTotalExpenses = expenses
    .filter((e) => e.date && e.date.startsWith(currentMonthPrefix))
    .reduce((sum, e) => sum + (e.total || 0), 0);

  const monthOrdersCount = orders.filter((o) => 
    (o.deliveryDate && o.deliveryDate.startsWith(currentMonthPrefix)) || 
    (o.orderDate && o.orderDate.startsWith(currentMonthPrefix))
  ).length;

  const monthRemindersCount = reminders.filter((r) => 
    r.dueDate && r.dueDate.startsWith(currentMonthPrefix)
  ).length;

  // Selected Day Details
  const selectedDayExpenses = useMemo(() => {
    return expenses.filter((e) => e.date === selectedDate);
  }, [expenses, selectedDate]);

  const selectedDayTotal = selectedDayExpenses.reduce((sum, e) => sum + (e.total || 0), 0);

  const selectedDayReminders = useMemo(() => {
    return reminders.filter((r) => r.dueDate === selectedDate);
  }, [reminders, selectedDate]);

  const selectedDayOrders = useMemo(() => {
    return orders.filter((o) => o.deliveryDate === selectedDate || o.orderDate === selectedDate);
  }, [orders, selectedDate]);

  const selectedDayNotes = useMemo(() => {
    return notes.filter((n) => n.date === selectedDate);
  }, [notes, selectedDate]);

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Cronograma de Mina
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            Calendario de Operaciones y Finanzas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Visualiza en un solo mapa temporal los gastos diarios en soles, llegada de pedidos, pagos programados y notas de guardia.
          </p>
        </div>

        {/* Month Summary KPI Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Gastos del Mes</span>
            <span className="text-sm font-black text-amber-400">{formatCurrency(monthTotalExpenses)}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pedidos Previstos</span>
            <span className="text-sm font-black text-blue-400">{monthOrdersCount} pedidos</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Avisos Programados</span>
            <span className="text-sm font-black text-rose-400">{monthRemindersCount} avisos</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar (Left/Center) + Day Agenda (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Month Calendar */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
          {/* Calendar Toolbar: Month Selector & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            {/* Month & Year Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                title="Mes anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <h3 className="text-base sm:text-lg font-extrabold text-white min-w-[170px] text-center capitalize">
                {monthNames[currentMonth]} {currentYear}
              </h3>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                title="Mes siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleGoToday}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors ml-1"
              >
                Hoy
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <button
                onClick={() => setShowExpenses(!showExpenses)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                  showExpenses
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700/50'
                }`}
              >
                💰 Gastos
              </button>
              <button
                onClick={() => setShowReminders(!showReminders)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                  showReminders
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700/50'
                }`}
              >
                ⏰ Avisos
              </button>
              <button
                onClick={() => setShowOrders(!showOrders)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                  showOrders
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700/50'
                }`}
              >
                📦 Pedidos
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                  showNotes
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700/50'
                }`}
              >
                📝 Apuntes
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 py-1 uppercase tracking-wider">
            {weekDayNames.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((cell) => {
              const isSelected = cell.dateStr === selectedDate;
              const isToday = cell.dateStr === today;
              const data = itemsByDate.get(cell.dateStr);

              const hasExpenses = showExpenses && data && data.expensesCount > 0;
              const hasReminders = showReminders && data && data.remindersCount > 0;
              const hasOrders = showOrders && data && data.ordersCount > 0;
              const hasNotes = showNotes && data && data.notesCount > 0;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[72px] sm:min-h-[85px] p-1.5 sm:p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/30 shadow-lg'
                      : isToday
                      ? 'bg-slate-850 border-amber-500/50'
                      : cell.isCurrentMonth
                      ? 'bg-slate-850/90 hover:bg-slate-800 border-slate-800'
                      : 'bg-slate-900/40 border-slate-850/60 opacity-40 hover:opacity-75'
                  }`}
                >
                  {/* Day Number + Today Tag */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isSelected
                          ? 'text-amber-300 font-black'
                          : isToday
                          ? 'text-amber-400 font-extrabold'
                          : cell.isCurrentMonth
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Hoy" />
                    )}
                  </div>

                  {/* Operational Event Indicators in Cell */}
                  <div className="mt-1 space-y-1">
                    {/* Expenses badge */}
                    {hasExpenses && (
                      <div className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1 rounded truncate leading-tight">
                        {formatCurrency(data!.expensesTotal)}
                      </div>
                    )}

                    {/* Dots / Counters for reminders, orders, notes */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {hasReminders && (
                        <span 
                          className="w-2 h-2 rounded-full bg-rose-500" 
                          title={`${data!.remindersCount} avisos programados`} 
                        />
                      )}
                      {hasOrders && (
                        <span 
                          className="w-2 h-2 rounded-full bg-blue-500" 
                          title={`${data!.ordersCount} pedidos`} 
                        />
                      )}
                      {hasNotes && (
                        <span 
                          className="w-2 h-2 rounded-full bg-sky-400" 
                          title={`${data!.notesCount} notas de guardia`} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Agenda & Details */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4">
          {/* Header for Day Agenda */}
          <div className="pb-3 border-b border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Agenda Seleccionada
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-1 capitalize">
              {formatDate(selectedDate)}
            </h3>
            {selectedDate === today && (
              <span className="text-xs font-semibold text-amber-400">Hoy (Fecha actual de operación)</span>
            )}

            {/* Quick Add Buttons for this Date */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => onQuickNew('gasto', selectedDate)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                title="Registrar gasto en este día"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Gasto</span>
              </button>
              <button
                onClick={() => onQuickNew('recordatorio', selectedDate)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                title="Crear recordatorio en este día"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Aviso</span>
              </button>
              <button
                onClick={() => onQuickNew('apunte', selectedDate)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs transition-colors"
                title="Nuevo apunte en este día"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apunte</span>
              </button>
            </div>
          </div>

          {/* Agenda Items List */}
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {/* Total gastado en el día */}
            {selectedDayExpenses.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Total Gastos del Día
                  </span>
                  <span className="text-lg font-black text-emerald-300">
                    {formatCurrency(selectedDayTotal)}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('gastos')}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  Ver lista <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Sub-block: Gastos */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gastos ({selectedDayExpenses.length})</span>
              </h4>
              {selectedDayExpenses.length === 0 ? (
                <p className="text-xs text-slate-500 pl-5">Sin compras registradas este día.</p>
              ) : (
                selectedDayExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-white truncate">{exp.item}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {exp.quantity} unid. • {exp.supplier} ({exp.miningArea})
                      </p>
                    </div>
                    <span className="font-black text-amber-400 shrink-0">
                      {formatCurrency(exp.total)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Sub-block: Recordatorios */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-rose-400" />
                <span>Recordatorios & Pagos ({selectedDayReminders.length})</span>
              </h4>
              {selectedDayReminders.length === 0 ? (
                <p className="text-xs text-slate-500 pl-5">No hay avisos programados.</p>
              ) : (
                selectedDayReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <button
                        onClick={() => onToggleReminder(rem.id, !rem.completed)}
                        className={`transition-colors ${
                          rem.completed ? 'text-emerald-400' : 'text-slate-500 hover:text-amber-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div className="min-w-0">
                        <p className={`font-bold truncate ${rem.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                          {rem.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {rem.dueTime ? `Hora: ${rem.dueTime} • ` : ''}Tipo: {rem.type}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sub-block: Pedidos */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-blue-400" />
                <span>Pedidos ({selectedDayOrders.length})</span>
              </h4>
              {selectedDayOrders.length === 0 ? (
                <p className="text-xs text-slate-500 pl-5">No hay entregas para esta fecha.</p>
              ) : (
                selectedDayOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-white truncate">{ord.productName}</p>
                      <p className="text-[10px] text-slate-400">
                        Cant: {ord.quantity} • Prov: {ord.supplier}
                      </p>
                    </div>
                    {ord.status !== 'recibido' ? (
                      <button
                        onClick={() => onReceiveOrder(ord.id)}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold"
                      >
                        Recibido
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold">Recibido ✓</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Sub-block: Apuntes */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Apuntes de Guardia ({selectedDayNotes.length})</span>
              </h4>
              {selectedDayNotes.length === 0 ? (
                <p className="text-xs text-slate-500 pl-5">Sin notas en esta fecha.</p>
              ) : (
                selectedDayNotes.map((nt) => (
                  <div
                    key={nt.id}
                    onClick={() => onNavigate('apuntes')}
                    className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-xs cursor-pointer transition-colors"
                  >
                    <p className="font-bold text-white truncate">{nt.title}</p>
                    <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                      {nt.content || 'Sin contenido adicional'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
