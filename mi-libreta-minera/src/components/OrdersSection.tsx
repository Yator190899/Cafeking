import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Filter, 
  Calendar,
  XCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatDate, getTodayString } from '../utils/formatters';
import { Modal } from './Modal';

interface OrdersSectionProps {
  orders: Order[];
  onSaveOrder: (order: Order) => Promise<void>;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  userId: string;
  initialOpenModal?: boolean;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  onSaveOrder,
  onUpdateStatus,
  onDeleteOrder,
  userId,
  initialOpenModal = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(initialOpenModal);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [orderDate, setOrderDate] = useState(getTodayString());
  const [deliveryDate, setDeliveryDate] = useState('');
  const [status, setStatus] = useState<OrderStatus>('pendiente');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const today = getTodayString();

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        (o.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.supplier || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.notes || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'todos' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.status === 'pendiente' || o.status === 'en_camino').length;
  }, [orders]);

  const openNewOrderModal = () => {
    setEditingOrderId(null);
    setProductName('');
    setQuantity('');
    setSupplier('');
    setOrderDate(getTodayString());
    setDeliveryDate('');
    setStatus('pendiente');
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditOrderModal = (order: Order) => {
    setEditingOrderId(order.id);
    setProductName(order.productName);
    setQuantity(order.quantity);
    setSupplier(order.supplier);
    setOrderDate(order.orderDate || getTodayString());
    setDeliveryDate(order.deliveryDate || '');
    setStatus(order.status);
    setNotes(order.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setFormError('Por favor ingresa el nombre del producto.');
      return;
    }
    if (!quantity.trim()) {
      setFormError('Por favor ingresa la cantidad solicitada.');
      return;
    }
    if (!supplier.trim()) {
      setFormError('Por favor ingresa el proveedor.');
      return;
    }

    const orderToSave: Order = {
      id: editingOrderId || 'pedido_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      productName: productName.trim(),
      quantity: quantity.trim(),
      supplier: supplier.trim(),
      orderDate,
      deliveryDate: deliveryDate || undefined,
      status,
      notes: notes.trim(),
    };

    await onSaveOrder(orderToSave);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el pedido "${name}"?`)) {
      await onDeleteOrder(id);
    }
  };

  const getStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Pendiente
          </span>
        );
      case 'en_camino':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Truck className="w-3.5 h-3.5" />
            En camino
          </span>
        );
      case 'recibido':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Recibido
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-400 border border-slate-600">
            <XCircle className="w-3.5 h-3.5" />
            Cancelado
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            Control y Seguimiento de Pedidos
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Requisición de insumos a proveedores y confirmación de recepción en almacén
          </p>
        </div>

        <button
          onClick={openNewOrderModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Pedido</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por producto, proveedor o nota..."
            className="w-full pl-9 pr-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        {/* Status Tab Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-850 p-1 rounded-xl border border-slate-700/80">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'pendiente', label: 'Pendientes' },
            { id: 'en_camino', label: 'En camino' },
            { id: 'recibido', label: 'Recibidos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.id === 'pendiente' && pendingCount > 0 && (
                <span className="ml-1.5 text-[10px] bg-slate-900/60 px-1.5 py-0.2 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold">No hay pedidos registrados con este filtro.</p>
            <button
              onClick={openNewOrderModal}
              className="mt-3 text-xs font-bold text-amber-400 hover:underline"
            >
              + Registrar primer pedido
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isDueSoon =
              order.deliveryDate &&
              (order.deliveryDate === today || order.deliveryDate < today) &&
              order.status !== 'recibido' &&
              order.status !== 'cancelado';

            return (
              <div
                key={order.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                  isDueSoon
                    ? 'border-amber-500/50 bg-slate-900/95'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Status & Delivery Alert Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getStatusBadge(order.status)}

                    {isDueSoon && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <AlertCircle className="w-3 h-3" />
                        {order.deliveryDate === today ? 'Entrega Hoy' : 'Fecha Vencida'}
                      </span>
                    )}
                  </div>

                  {/* Product & Quantity */}
                  <h4 className="text-base font-bold text-white leading-snug">
                    {order.productName}
                  </h4>
                  <div className="mt-2 text-xs font-semibold text-amber-400 bg-slate-850 px-2.5 py-1.5 rounded-lg border border-slate-800 inline-block">
                    Cantidad solicitada: {order.quantity}
                  </div>

                  {/* Supplier & Dates */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Proveedor:</span>
                      <span className="font-semibold text-slate-100 truncate max-w-[170px]">
                        {order.supplier}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Fecha de Pedido:</span>
                      <span>{formatDate(order.orderDate)}</span>
                    </p>
                    {order.deliveryDate && (
                      <p className="flex items-center justify-between">
                        <span className="text-slate-400">Entrega Estimada:</span>
                        <span className={`font-semibold ${isDueSoon ? 'text-amber-400' : 'text-slate-200'}`}>
                          {formatDate(order.deliveryDate)}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-850 text-xs text-slate-300 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-bold mb-0.5">Nota:</span>
                      {order.notes}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {order.status !== 'recibido' ? (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'recibido')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Marcar Recibido</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'pendiente')}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Reabrir Pedido
                    </button>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditOrderModal(order)}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Editar pedido"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id, order.productName)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Eliminar pedido"
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

      {/* Modal para Registrar / Editar Pedido */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOrderId ? 'Editar Pedido de Suministros' : 'Registrar Nuevo Pedido Minero'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          {/* 1. Nombre del Producto */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Nombre del Producto o Insumo *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ej. Barrenos 7/8, Diésel, Fulminantes, Manguera 3/4..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* 2. Cantidad Solicitada */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Cantidad Solicitada *
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ej. 10 cajas, 200 galones, 5 rollos..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* 3. Proveedor */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Proveedor / Casa Comercial *
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Ej. Famesa, Ferreyros, Grifo San Pedro..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* 4. Fechas de Pedido y Entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Fecha del Pedido *
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Fecha de Entrega Estimada
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* 5. Estado */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Estado del Pedido *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-500"
            >
              <option value="pendiente">Pendiente (Por despachar)</option>
              <option value="en_camino">En camino (En transporte/agencia)</option>
              <option value="recibido">Recibido (En campamento/almacén)</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* 6. Observaciones */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Observaciones adicionales
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Llega por Expreso Civa, guía remitente pendiente..."
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
              {editingOrderId ? 'Guardar Cambios' : 'Registrar Pedido'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
