import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Trash2, 
  Edit3, 
  Receipt, 
  Calendar, 
  Building2, 
  Filter, 
  DollarSign, 
  X,
  FileDown
} from 'lucide-react';
import { Expense, MINING_AREAS, MiningArea } from '../types';
import { formatCurrency, formatDate, getTodayString, getCurrentMonthString } from '../utils/formatters';
import { exportExpensesToExcel, exportExpensesToCSV } from '../services/excelService';
import { Modal } from './Modal';

interface ExpensesSectionProps {
  expenses: Expense[];
  onSaveExpense: (expense: Expense) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
  userId: string;
  initialOpenModal?: boolean;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  expenses,
  onSaveExpense,
  onDeleteExpense,
  userId,
  initialOpenModal = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(initialOpenModal);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('todas');
  const [selectedMonth, setSelectedMonth] = useState<string>(''); // YYYY-MM
  const [selectedSupplier, setSelectedSupplier] = useState<string>('todos');

  // Form state
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [date, setDate] = useState(getTodayString());
  const [supplier, setSupplier] = useState('');
  const [miningArea, setMiningArea] = useState<MiningArea | string>('Extracción / Socavón');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [formError, setFormError] = useState('');

  // Auto-calculated Total
  const calculatedTotal = useMemo(() => {
    const q = typeof quantity === 'number' ? quantity : 0;
    const p = typeof unitPrice === 'number' ? unitPrice : 0;
    return Math.round(q * p * 100) / 100;
  }, [quantity, unitPrice]);

  // List of unique suppliers for filter
  const uniqueSuppliers = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => {
      if (e.supplier && e.supplier.trim()) set.add(e.supplier.trim());
    });
    return Array.from(set).sort();
  }, [expenses]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        (e.item || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.supplier || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.receiptNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchArea = selectedArea === 'todas' || e.miningArea === selectedArea;
      const matchMonth = !selectedMonth || (e.date && e.date.startsWith(selectedMonth));
      const matchSupplier = selectedSupplier === 'todos' || e.supplier === selectedSupplier;

      return matchSearch && matchArea && matchMonth && matchSupplier;
    });
  }, [expenses, searchQuery, selectedArea, selectedMonth, selectedSupplier]);

  // Automatically calculate totals
  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (e.total || 0), 0);
  }, [filteredExpenses]);

  const totalAllAmount = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.total || 0), 0);
  }, [expenses]);

  const openNewExpenseModal = () => {
    setEditingExpenseId(null);
    setItem('');
    setDescription('');
    setQuantity(1);
    setUnitPrice('');
    setDate(getTodayString());
    setSupplier('');
    setMiningArea('Extracción / Socavón');
    setPaymentMethod('Efectivo');
    setReceiptNumber('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditExpenseModal = (exp: Expense) => {
    setEditingExpenseId(exp.id);
    setItem(exp.item || '');
    setDescription(exp.description || '');
    setQuantity(exp.quantity);
    setUnitPrice(exp.unitPrice);
    setDate(exp.date || getTodayString());
    setSupplier(exp.supplier || '');
    setMiningArea(exp.miningArea || 'Extracción / Socavón');
    setPaymentMethod(exp.paymentMethod || 'Efectivo');
    setReceiptNumber(exp.receiptNumber || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) {
      setFormError('Por favor ingresa qué se compró.');
      return;
    }
    const q = typeof quantity === 'number' ? quantity : parseFloat(String(quantity));
    const p = typeof unitPrice === 'number' ? unitPrice : parseFloat(String(unitPrice));

    if (isNaN(q) || q <= 0) {
      setFormError('La cantidad debe ser mayor a 0.');
      return;
    }
    if (isNaN(p) || p < 0) {
      setFormError('El precio unitario debe ser válido.');
      return;
    }
    if (!supplier.trim()) {
      setFormError('Ingresa el nombre del proveedor.');
      return;
    }

    const expenseToSave: Expense = {
      id: editingExpenseId || 'gasto_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      item: item.trim(),
      description: description.trim(),
      quantity: q,
      unitPrice: p,
      total: Math.round(q * p * 100) / 100,
      date,
      supplier: supplier.trim(),
      miningArea,
      paymentMethod,
      receiptNumber: receiptNumber.trim(),
    };

    await onSaveExpense(expenseToSave);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el gasto "${name}"?`)) {
      await onDeleteExpense(id);
    }
  };

  const handleExportExcel = () => {
    const filterTag = selectedArea !== 'todas' ? selectedArea : selectedMonth || 'Filtrado';
    exportExpensesToExcel(filteredExpenses, filterTag);
  };

  const handleExportCSV = () => {
    const filterTag = selectedArea !== 'todas' ? selectedArea : selectedMonth || 'Filtrado';
    exportExpensesToCSV(filteredExpenses, filterTag);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            Registro y Control de Gastos Mineros
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cálculo automático de importes en Soles (S/) y exportación a Excel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openNewExpenseModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Registrar Gasto</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-900/30"
            title="Descargar archivo Excel .xlsx"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Descargar archivo CSV"
          >
            <FileDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Stat Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Filtrado
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
              {formatCurrency(totalFilteredAmount)}
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {filteredExpenses.length} compras
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Acumulado
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
              {formatCurrency(totalAllAmount)}
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {expenses.length} totales
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Promedio por Compra
            </span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {filteredExpenses.length > 0
                ? formatCurrency(totalFilteredAmount / filteredExpenses.length)
                : 'S/ 0.00'}
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            Estadística
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Filtros y Búsqueda de Gastos</span>
          {(searchQuery || selectedArea !== 'todas' || selectedMonth || selectedSupplier !== 'todos') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedArea('todas');
                setSelectedMonth('');
                setSelectedSupplier('todos');
              }}
              className="ml-auto text-[11px] text-amber-400 hover:underline font-normal"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar producto, proveedor..."
              className="w-full pl-9 pr-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full py-2 px-3 bg-slate-850 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-amber-500"
          >
            <option value="todas">Todas las áreas mineras</option>
            {MINING_AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Month Filter */}
          <div className="relative">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full py-2 px-3 bg-slate-850 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Supplier Filter */}
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full py-2 px-3 bg-slate-850 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-amber-500"
          >
            <option value="todos">Todos los proveedores</option>
            {uniqueSuppliers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table (Desktop) & Cards (Mobile) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Table for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-200">
            <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Qué compré / Descripción</th>
                <th className="py-3 px-4 text-center">Cant.</th>
                <th className="py-3 px-4 text-right">Precio Unit. (S/)</th>
                <th className="py-3 px-4 text-right">Total (S/)</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">Área Minera</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No se encontraron gastos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-850/80 transition-colors">
                    <td className="py-3 px-4 text-xs whitespace-nowrap font-medium text-slate-400">
                      {formatDate(exp.date)}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-white truncate">{exp.item}</div>
                      {exp.description && (
                        <div className="text-[11px] text-slate-400 truncate">{exp.description}</div>
                      )}
                      {exp.receiptNumber && (
                        <div className="text-[10px] text-amber-400/90 font-mono">
                          Doc: {exp.receiptNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-300">
                      {exp.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {formatCurrency(exp.unitPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-amber-400">
                      {formatCurrency(exp.total)}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-[150px] truncate">
                      {exp.supplier}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-amber-300 border border-slate-700">
                        {exp.miningArea}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditExpenseModal(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          title="Editar gasto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Eliminar gasto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer with Grand Total */}
            {filteredExpenses.length > 0 && (
              <tfoot className="bg-slate-950 font-bold border-t-2 border-slate-700 text-slate-100">
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-right uppercase text-xs tracking-wider text-slate-400">
                    Total Gastos Filtrados:
                  </td>
                  <td className="py-3 px-4 text-right text-base font-black text-amber-400">
                    {formatCurrency(totalFilteredAmount)}
                  </td>
                  <td colSpan={3} className="py-3 px-4 text-xs text-slate-400">
                    ({filteredExpenses.length} compras)
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Card View for Mobile Devices */}
        <div className="block md:hidden divide-y divide-slate-800 p-3 space-y-3">
          {filteredExpenses.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No hay gastos que coincidan con la búsqueda.
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div key={exp.id} className="pt-3 first:pt-0 bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatDate(exp.date)}
                    </span>
                    <h4 className="font-bold text-sm text-white truncate">{exp.item}</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-amber-400">
                      {formatCurrency(exp.total)}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {exp.quantity} x {formatCurrency(exp.unitPrice)}
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {exp.description}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-slate-700">
                      {exp.miningArea}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {exp.supplier}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditExpenseModal(exp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id, exp.item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Formulario para Registrar / Editar Gasto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpenseId ? 'Editar Gasto Minero' : 'Registrar Nuevo Gasto Minero'}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          {/* 1. Qué compré */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              ¿Qué compraste? *
            </label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Ej. Barrenos de 4 pies, Diésel B5, Guantes de badana..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* 2. Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Descripción / Detalle técnico
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Para perforación en crucero 240, repuesto de bomba..."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* 3. Cantidad y Precio unitario (Automatic total calculation) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Cantidad *
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : parseFloat(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Precio Unit. (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="0.00"
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                Importe Total (S/)
              </label>
              <div className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-sm font-black text-amber-400 flex items-center justify-between">
                <span>{formatCurrency(calculatedTotal)}</span>
                <span className="text-[10px] text-slate-500 font-normal">Automático</span>
              </div>
            </div>
          </div>

          {/* 4. Fecha y Proveedor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Fecha del Gasto *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Proveedor / Empresa *
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Ej. Aceros Arequipa, Grifo San Pedro..."
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* 5. Área de la Minería */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Área de la Minería *
            </label>
            <select
              value={miningArea}
              onChange={(e) => setMiningArea(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
            >
              {MINING_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* 6. Método de Pago y N° Comprobante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia BCP">Transferencia BCP</option>
                <option value="Transferencia BBVA">Transferencia BBVA</option>
                <option value="Transferencia Interbank">Transferencia Interbank</option>
                <option value="Transferencia Banco de la Nación">Transferencia Banco de la Nación</option>
                <option value="Yape / Plin">Yape / Plin</option>
                <option value="Factura a Crédito">Factura a Crédito</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                N° Boleta / Factura / Guía
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="Ej. F001-004523"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>
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
              {editingExpenseId ? 'Guardar Cambios' : 'Registrar Gasto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
