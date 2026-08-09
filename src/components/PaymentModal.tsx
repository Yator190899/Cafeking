import React, { useState } from 'react';
import { X, CheckCircle, QrCode, Banknote, User, Phone, AlertCircle, ArrowLeft } from 'lucide-react';
import { CartItem, PaymentMethod, BusinessConfig, Order } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  config: BusinessConfig;
  onCompleteOrder: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  config,
  onCompleteOrder,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Yape');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cashAmountNeeded, setCashAmountNeeded] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => {
    const itemPrice = item.product.priceConfirmed && item.product.price !== null ? item.product.price : 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string } = {};

    if (!customerName.trim()) {
      newErrors.name = 'Por favor ingresa tu nombre';
    }
    if (!customerPhone.trim()) {
      newErrors.phone = 'Por favor ingresa tu teléfono';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const orderId = `CK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      items: cartItems,
      subtotal: total,
      total: total,
      paymentMethod,
      customerName,
      customerPhone,
      notes,
      cashAmountNeeded: paymentMethod === 'Efectivo' && cashAmountNeeded ? parseFloat(cashAmountNeeded) : undefined,
      createdAt: new Date().toISOString(),
      status: 'Pendiente',
    };

    onCompleteOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#3B2418]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF3E3] border border-[#F3E5C8] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-fadeIn my-8">
        
        {/* Header */}
        <div className="p-5 bg-[#3B2418] text-[#FAF3E3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[#6F4E37] text-[#FAF3E3]/80"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-serif-heading font-bold text-xl">
              Confirmación de Pedido
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#6F4E37] text-[#FAF3E3]/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-serif-heading font-bold text-base text-[#3B2418] border-b border-[#F3E5C8] pb-1">
              1. Datos de Contacto
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                Nombre completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F4E37]/60" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className={`w-full pl-9 pr-3 py-2 bg-[#FFFDF8] border rounded-lg text-sm text-[#3B2418] focus:outline-none focus:border-[#C49A5A] ${
                    errors.name ? 'border-red-500' : 'border-[#F3E5C8]'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                Teléfono / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F4E37]/60" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ej. 984 123 456"
                  className={`w-full pl-9 pr-3 py-2 bg-[#FFFDF8] border rounded-lg text-sm text-[#3B2418] focus:outline-none focus:border-[#C49A5A] ${
                    errors.phone ? 'border-red-500' : 'border-[#F3E5C8]'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-4">
            <h3 className="font-serif-heading font-bold text-base text-[#3B2418] border-b border-[#F3E5C8] pb-1">
              2. Método de Pago
            </h3>

            <div className="grid grid-cols-2 gap-3">
              
              {/* Option Yape */}
              <label
                className={`p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Yape'
                    ? 'border-[#3B2418] bg-[#F3E5C8]/80 font-bold'
                    : 'border-[#F3E5C8] bg-[#FFFDF8] hover:border-[#C49A5A]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Yape"
                  checked={paymentMethod === 'Yape'}
                  onChange={() => setPaymentMethod('Yape')}
                  className="accent-[#3B2418]"
                />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Y
                  </div>
                  <span className="text-sm text-[#3B2418]">Yape</span>
                </div>
              </label>

              {/* Option Cash */}
              <label
                className={`p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Efectivo'
                    ? 'border-[#3B2418] bg-[#F3E5C8]/80 font-bold'
                    : 'border-[#F3E5C8] bg-[#FFFDF8] hover:border-[#C49A5A]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Efectivo"
                  checked={paymentMethod === 'Efectivo'}
                  onChange={() => setPaymentMethod('Efectivo')}
                  className="accent-[#3B2418]"
                />
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-800" />
                  <span className="text-sm text-[#3B2418]">Efectivo</span>
                </div>
              </label>

            </div>

            {/* Yape Details Display */}
            {paymentMethod === 'Yape' && (
              <div className="p-4 bg-[#FFFDF8] border border-[#F3E5C8] rounded-xl space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 p-1 bg-white border border-[#F3E5C8] rounded-lg shadow-sm shrink-0">
                    <img
                      src={config.yapeQrImage}
                      alt="Código QR Yape Cafeking"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-[#3B2418]">
                    <div className="inline-block px-2 py-0.5 bg-purple-100 text-purple-900 font-semibold rounded text-[11px]">
                      Yape Cafeking
                    </div>
                    <p className="font-bold text-sm">
                      Titular: <span className="font-normal">{config.yapeTitular}</span>
                    </p>
                    <p className="font-bold text-sm">
                      Número: <span className="text-[#3B2418] bg-[#F3E5C8] px-2 py-0.5 rounded font-mono">{config.yapeNumber}</span>
                    </p>
                    <p className="text-[#6F4E37] text-[11px] leading-snug pt-1">
                      Realiza el pago mediante Yape y confirma tu pedido.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cash Details Display */}
            {paymentMethod === 'Efectivo' && (
              <div className="p-4 bg-[#FFFDF8] border border-[#F3E5C8] rounded-xl space-y-3 animate-fadeIn">
                <p className="text-xs text-[#3B2418] font-medium leading-relaxed">
                  El pago se realizará en efectivo al momento de recoger o recibir el pedido.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6F4E37] mb-1">
                    ¿Con cuánto pagarás? (Para llevar vuelto)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    placeholder="Ej. S/ 20.00"
                    value={cashAmountNeeded}
                    onChange={(e) => setCashAmountNeeded(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FAF3E3] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418] focus:outline-none"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#3B2418] hover:bg-[#6F4E37] text-[#FAF3E3] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-[#C49A5A]" />
              <span>Enviar mi pedido</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
