import React, { useState } from 'react';
import { X, Save, Plus, Edit, Settings, Coffee, QrCode } from 'lucide-react';
import { Product, BusinessConfig } from '../types';

interface AdminConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessConfig;
  onSaveConfig: (updatedConfig: BusinessConfig) => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (newProduct: Product) => void;
}

export const AdminConfigModal: React.FC<AdminConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  products,
  onUpdateProduct,
  onAddProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'precios' | 'yape' | 'nuevo'>('precios');
  const [tempConfig, setTempConfig] = useState<BusinessConfig>(config);

  // New product state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('Clásicos');
  const [newPriceConfirmed, setNewPriceConfirmed] = useState(true);

  if (!isOpen) return null;

  const handleSaveConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(tempConfig);
    onClose();
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newName,
      description: newDesc || 'Preparado con café seleccionado.',
      price: newPrice ? parseFloat(newPrice) : null,
      priceConfirmed: newPriceConfirmed,
      category: newCategory,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
      isAvailable: true,
    };

    onAddProduct(created);
    setNewName('');
    setNewDesc('');
    setNewPrice('');
    setActiveTab('precios');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#3B2418]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF3E3] border border-[#F3E5C8] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fadeIn my-8">
        
        {/* Header */}
        <div className="p-5 bg-[#3B2418] text-[#FAF3E3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#C49A5A]" />
            <h2 className="font-serif-heading font-bold text-xl">
              Administración Cafeking
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#6F4E37] text-[#FAF3E3]/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#F3E5C8] bg-[#F3E5C8]/40 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('precios')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'precios'
                ? 'bg-[#FAF3E3] text-[#3B2418] border-t border-x border-[#F3E5C8]'
                : 'text-[#6F4E37] hover:text-[#3B2418]'
            }`}
          >
            Editar Precios
          </button>
          <button
            onClick={() => setActiveTab('yape')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'yape'
                ? 'bg-[#FAF3E3] text-[#3B2418] border-t border-x border-[#F3E5C8]'
                : 'text-[#6F4E37] hover:text-[#3B2418]'
            }`}
          >
            Configuración Yape & Contacto
          </button>
          <button
            onClick={() => setActiveTab('nuevo')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-1 ${
              activeTab === 'nuevo'
                ? 'bg-[#FAF3E3] text-[#3B2418] border-t border-x border-[#F3E5C8]'
                : 'text-[#6F4E37] hover:text-[#3B2418]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Agregar Producto
          </button>
        </div>

        <div className="p-6">
          
          {/* TAB 1: Edit Prices */}
          {activeTab === 'precios' && (
            <div className="space-y-4">
              <p className="text-xs text-[#6F4E37]">
                Modifica los precios de los productos o activa la opción "Precio por confirmar".
              </p>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 bg-[#FFFDF8] rounded-xl border border-[#F3E5C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-[#F3E5C8]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-serif-heading font-bold text-sm text-[#3B2418]">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-[#6F4E37]">{p.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      
                      {/* Price confirmed checkbox */}
                      <label className="flex items-center gap-1.5 text-xs text-[#6F4E37] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={p.priceConfirmed}
                          onChange={(e) =>
                            onUpdateProduct({
                              ...p,
                              priceConfirmed: e.target.checked,
                            })
                          }
                          className="accent-[#3B2418]"
                        />
                        <span>Confirmado</span>
                      </label>

                      {/* Price input */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#3B2418]">S/</span>
                        <input
                          type="number"
                          step="0.5"
                          disabled={!p.priceConfirmed}
                          value={p.price !== null ? p.price : ''}
                          onChange={(e) =>
                            onUpdateProduct({
                              ...p,
                              price: e.target.value ? parseFloat(e.target.value) : null,
                            })
                          }
                          placeholder="0.00"
                          className="w-20 px-2 py-1 text-xs border border-[#F3E5C8] rounded bg-[#FAF3E3] text-[#3B2418] focus:outline-none"
                        />
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#3B2418] text-[#FAF3E3] font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#6F4E37]"
                >
                  Listo
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Yape & Contact Settings */}
          {activeTab === 'yape' && (
            <form onSubmit={handleSaveConfigSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                  Número de Yape
                </label>
                <input
                  type="text"
                  value={tempConfig.yapeNumber}
                  onChange={(e) => setTempConfig({ ...tempConfig, yapeNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                  Titular de Yape
                </label>
                <input
                  type="text"
                  value={tempConfig.yapeTitular}
                  onChange={(e) => setTempConfig({ ...tempConfig, yapeTitular: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                  Teléfono de WhatsApp para Pedidos
                </label>
                <input
                  type="text"
                  value={tempConfig.phoneWhatsapp}
                  onChange={(e) => setTempConfig({ ...tempConfig, phoneWhatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                  Dirección Física en Cusco
                </label>
                <input
                  type="text"
                  value={tempConfig.address}
                  onChange={(e) => setTempConfig({ ...tempConfig, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#F3E5C8] rounded-lg text-xs font-semibold text-[#6F4E37]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B2418] text-[#FAF3E3] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#6F4E37] flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#C49A5A]" /> Guardar Cambios
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Add New Product */}
          {activeTab === 'nuevo' && (
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                  Nombre del Café / Producto *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Café Espresso Especial"
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Descripción aromática y sabrosa del producto..."
                  className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418]"
                  >
                    <option value="Clásicos">Clásicos</option>
                    <option value="Especiales">Especiales</option>
                    <option value="Bebidas Calientes">Bebidas Calientes</option>
                    <option value="Acompañamientos">Acompañamientos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                    Precio (S/)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Ej. 8.50"
                    className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#F3E5C8] rounded-lg text-xs text-[#3B2418]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('precios')}
                  className="px-4 py-2 border border-[#F3E5C8] rounded-lg text-xs font-semibold text-[#6F4E37]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B2418] text-[#FAF3E3] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#6F4E37] flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C49A5A]" /> Añadir al Menú
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
