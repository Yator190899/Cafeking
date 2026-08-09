import React from 'react';
import { CheckCircle2, MessageSquare, Home, Coffee, Receipt, ExternalLink } from 'lucide-react';
import { Order, BusinessConfig } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  config: BusinessConfig;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  config,
  onClose,
}) => {
  if (!order) return null;

  // Generate WhatsApp message string
  const itemsText = order.items
    .map((item) => `- ${item.quantity}x ${item.product.name}`)
    .join('%0A');

  const rawPhone = config.phoneWhatsapp.replace(/\D/g, '');
  const whatsappMessage = `Hola Cafeking! ☕ Quisiera confirmar mi pedido:%0A%0A*Número de pedido:* ${order.id}%0A*Cliente:* ${order.customerName}%0A*Teléfono:* ${order.customerPhone}%0A*Método de pago:* ${order.paymentMethod}%0A${order.cashAmountNeeded ? `*Vuelto con:* S/ ${order.cashAmountNeeded.toFixed(2)}%0A` : ''}%0A*Detalle de Productos:*%0A${itemsText}%0A%0A*Total Estimado:* S/ ${order.total.toFixed(2)}%0A%0A¡Muchas gracias!`;

  const whatsappUrl = `https://wa.me/${rawPhone}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#3B2418]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF3E3] border border-[#F3E5C8] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fadeIn my-8 text-center p-6 space-y-6">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#F3E5C8] border-2 border-[#C49A5A] flex items-center justify-center text-[#3B2418] mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9 text-emerald-700" />
        </div>

        {/* Header Title */}
        <div>
          <h2 className="font-serif-heading font-bold text-2xl text-[#3B2418]">
            ¡Pedido recibido!
          </h2>
          <p className="text-sm text-[#6F4E37] mt-1">
            Gracias por elegir Cafeking. Hemos recibido tu pedido correctamente.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#FFFDF8] p-4 rounded-xl border border-[#F3E5C8] text-left space-y-3">
          
          <div className="flex justify-between items-center border-b border-[#F3E5C8] pb-2 text-xs">
            <span className="text-[#6F4E37] font-medium">Número de pedido:</span>
            <span className="font-mono font-bold text-[#3B2418] bg-[#F3E5C8] px-2 py-0.5 rounded">
              {order.id}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-[#3B2418]">
            <p className="font-bold text-[#6F4E37] uppercase tracking-wider text-[10px]">
              Productos:
            </p>
            {order.items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span>
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-medium text-[#6F4E37]">
                  {item.product.priceConfirmed && item.product.price !== null
                    ? `S/ ${(item.product.price * item.quantity).toFixed(2)}`
                    : 'Por confirmar'}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F3E5C8] pt-2 flex justify-between text-xs font-bold text-[#3B2418]">
            <span>Método de Pago:</span>
            <span className="text-[#6F4E37]">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between text-sm font-serif-heading font-bold text-[#3B2418] pt-1">
            <span>Total:</span>
            <span>S/ {order.total.toFixed(2)}</span>
          </div>

        </div>

        {/* WhatsApp Direct Action Button */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Enviar WhatsApp a Cafeking</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#3B2418] hover:bg-[#6F4E37] text-[#FAF3E3] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-[#C49A5A]" />
            <span>Volver al inicio</span>
          </button>
        </div>

      </div>
    </div>
  );
};
