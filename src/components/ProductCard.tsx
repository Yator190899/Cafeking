import React, { useState } from 'react';
import { Plus, Check, Coffee } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onEditProduct,
}) => {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#F3E5C8] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      
      {/* Product Image & Badge */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-[#F3E5C8]/40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2418]/50 via-transparent to-transparent opacity-60" />
        
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#3B2418] text-[#FAF3E3] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#C49A5A]/50 shadow">
            {product.badge}
          </span>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-[#3B2418]/80 backdrop-blur-xs flex items-center justify-center text-[#F3E5C8] font-bold text-sm">
            Agotado Temporalmente
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-serif-heading font-bold text-xl text-[#3B2418] group-hover:text-[#6F4E37] transition-colors">
              {product.name}
            </h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F3E5C8] text-[#6F4E37]">
              {product.category}
            </span>
          </div>

          <p className="text-sm text-[#3B2418]/75 font-light leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="pt-3 border-t border-[#F3E5C8] flex items-center justify-between gap-3">
          
          <div>
            <span className="block text-[10px] uppercase text-[#6F4E37] font-medium tracking-wider">
              Precio
            </span>
            <span className="font-serif-heading font-bold text-lg text-[#3B2418]">
              {product.priceConfirmed && product.price !== null
                ? `S/ ${product.price.toFixed(2)}`
                : 'Precio por confirmar'}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#3B2418] hover:bg-[#6F4E37] text-[#FAF3E3]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#C49A5A]" />
                <span>Agregar al pedido</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
