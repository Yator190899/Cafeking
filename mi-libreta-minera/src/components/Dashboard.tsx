import React from 'react';
import { 
  TrendingUp, 
  CalendarDays, 
  Package, 
  Bell, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Receipt,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Smartphone
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Note, Expense, Order, Reminder, NavigationTab } from '../types';
import { formatCurrency, formatDate, getTodayString, getCurrentMonthString } from '../utils/formatters';

interface DashboardProps {
  notes: Note[];
  expenses: Expense[];
  orders: Order[];
  reminders: Reminder[];
  onNavigate: (tab: NavigationTab) => void;
  onQuickNew: (type: 'gasto' | 'apunte' | 'pedido' | 'recordatorio') => void;
  onToggleReminder: (id: string, completed: boolean) => void;
  onReceiveOrder: (id: string) => void;
  onExportExcel: () => void;
  onOpenInstallModal?: () => void;
  onOpenQRModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  notes,
  expenses,
  orders,
  reminders,
  onNavigate,
  onQuickNew,
  onToggleReminder,
  onReceiveOrder,
  onExportExcel,
  onOpenInstallModal,
  onOpenQRModal,
}) => {
  const { isInstalled } = usePWAInstall();
  const today = getTodayString();
  const currentMonth = getCurrentMonthString(); // YYYY-MM

  // 1. Calculations for Expenses
  const expensesThisMonth = expenses.filter((e) => e.date && e.date.startsWith(currentMonth));
  const monthTotal = expensesThisMonth.reduce((sum, e) => sum + (e.total || 0), 0);

  const expensesToday = expenses.filter((e) => e.date === today);
  const dayTotal = expensesToday.reduce((sum, e) => sum + (e.total || 0), 0);

  // Expenses by Mining Area (distribution)
  const expensesByArea: Record<string, number> = {};
  expenses.forEach((e) => {
    const area = e.miningArea || 'Otros';
    expensesByArea[area] = (expensesByArea[area] || 0) + (e.total || 0);
  });
  const allExpensesTotal = expenses.reduce((sum, e) => sum + (e.total || 0), 0) || 1;
  const sortedAreas = Object.entries(expensesByArea)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // 2. Calculations for Orders
  const pendingOrders = orders.filter((o) => o.status === 'pendiente' || o.status === 'en_camino');
  const recentOrders = [...orders].slice(0, 4);

  // 3. Calculations for Reminders
  const activeReminders = reminders.filter((r) => !r.completed);
  // Sort: Today's reminders first, then closest upcoming
  const upcomingReminders = [...activeReminders].sort((a, b) => {
    return (a.dueDate || '').localeCompare(b.dueDate || '');
  }).slice(0, 4);

  // 4. Latest Notes
  const latestNotes = [...notes].slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/70 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            Control de Mina & Operaciones
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Resumen de Operación y Finanzas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Monitoreo diario de costos en soles, control de compras de campo y requisiciones de insumos mineros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onQuickNew('gasto')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-900/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Gasto</span>
          </button>
          <button
            onClick={() => onNavigate('calendario')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs sm:text-sm transition-all"
          >
            <CalendarDays className="w-4 h-4 text-amber-400" />
            <span>Calendario</span>
          </button>
          <button
            onClick={onExportExcel}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs sm:text-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Install PWA Callout Banner */}
      {!isInstalled && onOpenInstallModal && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                ¿Deseas usar Mi Libreta Minera como una aplicación en tu celular?
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Instálala directamente en tu pantalla de inicio para usarla a diario a pantalla completa.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenQRModal && (
              <button
                onClick={onOpenQRModal}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors"
              >
                <span>📱 Escanear QR</span>
              </button>
            )}
            <button
              onClick={onOpenInstallModal}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Instalar Aplicación</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gastos del Mes */}
        <div 
          onClick={() => onNavigate('gastos')}
          className="cursor-pointer group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gastos del Mes
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {formatCurrency(monthTotal)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>{expensesThisMonth.length} compras este mes</span>
              <span className="text-amber-400 font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Ver detalle <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Gastos del Día */}
        <div 
          onClick={() => onNavigate('gastos')}
          className="cursor-pointer group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gastos del Día
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
              {formatCurrency(dayTotal)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>{expensesToday.length} compras hoy</span>
              <span className="text-amber-400 font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                + Añadir <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Pedidos Pendientes */}
        <div 
          onClick={() => onNavigate('pedidos')}
          className="cursor-pointer group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pedidos Pendientes
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight flex items-baseline gap-2">
              {pendingOrders.length}
              <span className="text-xs font-normal text-slate-400">por recibir</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>{orders.length} pedidos totales</span>
              <span className="text-blue-400 font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Revisar <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Recordatorios Próximos */}
        <div 
          onClick={() => onNavigate('recordatorios')}
          className="cursor-pointer group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recordatorios Activos
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight flex items-baseline gap-2">
              {activeReminders.length}
              <span className="text-xs font-normal text-slate-400">pendientes</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>Alertas con hora</span>
              <span className="text-rose-400 font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Ver avisos <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Mining Areas Expense Distribution */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              Distribución de Gastos por Área de Minería
            </h3>
            <p className="text-xs text-slate-400">Principales partidas de inversión en campamento y operación</p>
          </div>
          <button
            onClick={() => onNavigate('gastos')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Ver todos los gastos <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {sortedAreas.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-full py-4 text-center">
              No hay gastos registrados todavía.
            </p>
          ) : (
            sortedAreas.map(([area, amount]) => {
              const percentage = Math.round((amount / allExpensesTotal) * 100);
              return (
                <div key={area} className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-200 truncate">{area}</span>
                    <span className="font-bold text-amber-400">{percentage}%</span>
                  </div>
                  <div className="text-base font-black text-white">
                    {formatCurrency(amount)}
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-300 h-1.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Two Column Grid: Recent Notes & Pending Orders/Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Últimos Apuntes Registrados */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Últimos Apuntes Registrados</h3>
                <p className="text-[11px] text-slate-400">Cuaderno de campo y novedades de guardia</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('apuntes')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Ir a notas <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3 flex-1">
            {latestNotes.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-xs">No tienes apuntes guardados.</p>
                <button
                  onClick={() => onQuickNew('apunte')}
                  className="mt-2 text-xs font-semibold text-amber-400 hover:underline"
                >
                  + Escribir primer apunte
                </button>
              </div>
            ) : (
              latestNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onNavigate('apuntes')}
                  className="p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {note.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {formatDate(note.date)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                  {note.category && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-300/90 border border-slate-700/60 font-medium">
                        {note.category}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Recordatorios Próximos & Pedidos por Recibir */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-6">
          {/* Sub-block A: Recordatorios Próximos */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Recordatorios Próximos</h3>
                  <p className="text-[11px] text-slate-400">Pagos, trámites y avisos programados</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('recordatorios')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {upcomingReminders.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No hay recordatorios pendientes. ¡Todo al día!
                </p>
              ) : (
                upcomingReminders.map((rem) => {
                  const isToday = rem.dueDate === today;
                  const isOverdue = rem.dueDate < today;
                  return (
                    <div
                      key={rem.id}
                      className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <button
                          onClick={() => onToggleReminder(rem.id, true)}
                          title="Marcar como cumplido"
                          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                            {rem.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="capitalize font-medium text-amber-400/90">{rem.type}</span>
                            <span>•</span>
                            <span className={`flex items-center gap-1 font-semibold ${
                              isOverdue ? 'text-rose-400' : isToday ? 'text-amber-400' : 'text-slate-400'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {formatDate(rem.dueDate)} {rem.dueTime ? `a las ${rem.dueTime}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      {rem.priority === 'alta' && (
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Urgente
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sub-block B: Pedidos Pendientes de Entrega */}
          <div className="pt-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Pedidos por Recibir</h3>
                  <p className="text-[11px] text-slate-400">Seguimiento rápido de despachos de insumos</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('pedidos')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Ver pedidos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {pendingOrders.slice(0, 3).length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No hay pedidos pendientes de entrega.
                </p>
              ) : (
                pendingOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                        {order.productName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        Cant: <span className="text-slate-200 font-medium">{order.quantity}</span> | Prov: {order.supplier}
                      </p>
                    </div>

                    <button
                      onClick={() => onReceiveOrder(order.id)}
                      className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
                    >
                      Recibido
                    </button>
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
