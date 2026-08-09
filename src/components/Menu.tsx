import React, { useState } from 'react';
import { Coffee, Search, PlusCircle, Settings, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface MenuProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenAdmin: () => void;
}

export const Menu: React.FC<MenuProps> = ({ products, onAddToCart, onOpenAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Todos', 'Clásicos', 'Especiales', 'Bebidas Calientes'];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-20 bg-[#F3E5C8]/40 text-[#3B2418] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3E5C8] border border-[#C49A5A]/50 text-[#6F4E37] text-xs font-semibold uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5 text-[#C49A5A]" />
            <span>Selección Artesanal</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B2418]">
            Nuestro menú
          </h2>

          <p className="text-base sm:text-lg text-[#3B2418]/80 font-light">
            Disfruta nuestros clásicos preparados con dedicación.
          </p>

        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-[#FFFDF8] p-4 rounded-2xl border border-[#F3E5C8] shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#3B2418] text-[#FAF3E3] shadow-sm'
                    : 'bg-[#FAF3E3] text-[#6F4E37] hover:bg-[#F3E5C8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Admin Quick Link */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F4E37]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en el menú..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF3E3] border border-[#F3E5C8] rounded-xl text-xs text-[#3B2418] placeholder-[#6F4E37]/50 focus:outline-none focus:border-[#C49A5A]"
              />
            </div>

            <button
              onClick={onOpenAdmin}
              className="p-2.5 rounded-xl bg-[#F3E5C8] text-[#3B2418] hover:bg-[#C49A5A] transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold"
              title="Administrar precios y productos"
            >
              <Settings className="w-4 h-4 text-[#3B2418]" />
              <span className="hidden md:inline">Editar Precios</span>
            </button>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFDF8] rounded-2xl border border-[#F3E5C8] max-w-md mx-auto p-6">
            <Coffee className="w-12 h-12 text-[#6F4E37]/40 mx-auto mb-3" />
            <h3 className="font-serif-heading font-semibold text-lg text-[#3B2418]">
              No se encontraron productos
            </h3>
            <p className="text-xs text-[#6F4E37] mt-1">
              Prueba buscando con otro término o seleccionando otra categoría.
            </p>
          </div>
        )}

        {/* Information Callout */}
        <div className="mt-12 p-4 rounded-xl bg-[#FFFDF8] border border-[#C49A5A]/30 text-center max-w-2xl mx-auto flex items-center justify-center gap-3 text-xs text-[#6F4E37]">
          <CheckCircle2 className="w-5 h-5 text-[#C49A5A] shrink-0" />
          <span>
            Todos nuestros cafés son elaborados al momento con agua filtrada y granos seleccionados.
          </span>
        </div>

      </div>
    </section>
  );
};
