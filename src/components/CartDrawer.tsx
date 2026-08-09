import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => {
    const itemPrice = item.product.priceConfirmed && item.product.price !== null ? item.product.price : 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const hasUnconfirmedPrices = cartItems.some(
    (item) => !item.product.priceConfirmed || item.product.price === null
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#3B2418]/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF3E3] text-[#3B2418] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 bg-[#3B2418] text-[#FAF3E3] flex items-center justify-between border-b border-[#6F4E37]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C49A5A]" />
              <h2 className="font-serif-heading font-bold text-xl tracking-wide">
                Tu Pedido
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#6F4E37] text-[#FAF3E3]/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F3E5C8] flex items-center justify-center text-[#6F4E37]">
                  <ShoppingBag className="w-8 h-8 text-[#C49A5A]" />
                </div>
                <h3 className="font-serif-heading font-semibold text-xl text-[#3B2418]">
                  Tu pedido está vacío
                </h3>
                <p className="text-xs text-[#6F4E37] max-w-xs leading-relaxed">
                  Añade tus cafés favoritos del menú para realizar tu pedido de manera rápida y sencilla.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#3B2418] text-[#FAF3E3] text-xs font-semibold rounded-lg hover:bg-[#6F4E37] transition-all uppercase tracking-wider"
                >
                  Explorar menú
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-[#6F4E37] pb-2 border-b border-[#F3E5C8]">
                  <span>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} seleccionados</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-700 hover:text-red-900 font-medium hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Vaciar
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-[#FFFDF8] p-3.5 rounded-xl border border-[#F3E5C8] shadow-xs flex gap-3.5 items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg border border-[#F3E5C8] shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif-heading font-bold text-sm text-[#3B2418] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#6F4E37] mt-0.5">
                        {item.product.priceConfirmed && item.product.price !== null
                          ? `S/ ${item.product.price.toFixed(2)}`
                          : 'Precio por confirmar'}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-[#FAF3E3] border border-[#F3E5C8] rounded-md">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#F3E5C8] text-[#3B2418] rounded-l-md"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#3B2418]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#F3E5C8] text-[#3B2418] rounded-r-md"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-2 text-[#6F4E37]/60 hover:text-red-700 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-[#F3E5C8] border-t border-[#C49A5A]/30 space-y-4">
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6F4E37]">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#3B2418]">
                    {hasUnconfirmedPrices ? 'A confirmar' : `S/ ${total.toFixed(2)}`}
                  </span>
                </div>
                {hasUnconfirmedPrices && (
                  <p className="text-[11px] text-[#6F4E37] italic">
                    * Hay productos con precio por confirmar al momento del pago.
                  </p>
                )}
                <div className="flex justify-between font-serif-heading font-bold text-lg text-[#3B2418] pt-2 border-t border-[#C49A5A]/30">
                  <span>Total estimado:</span>
                  <span>{hasUnconfirmedPrices ? 'A confirmar' : `S/ ${total.toFixed(2)}`}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#3B2418] text-[#FAF3E3] hover:bg-[#6F4E37] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Confirmar pedido</span>
                <ArrowRight className="w-4 h-4 text-[#C49A5A] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
