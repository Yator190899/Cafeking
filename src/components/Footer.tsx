import React from 'react';
import { Coffee, Heart } from 'lucide-react';
import { BusinessConfig } from '../types';

interface FooterProps {
  config: BusinessConfig;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAdmin }) => {
  return (
    <footer className="bg-[#3B2418] text-[#FAF3E3] border-t border-[#6F4E37]/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#6F4E37]/50">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#C49A5A]/20 border border-[#C49A5A] flex items-center justify-center text-[#F3E5C8]">
                <Coffee className="w-5 h-5 text-[#C49A5A]" />
              </div>
              <span className="font-serif-heading text-2xl font-bold tracking-wider text-[#FAF3E3]">
                CAFEKING
              </span>
            </div>

            <p className="text-sm text-[#F3E5C8]/80 font-light max-w-sm italic">
              "El sabor que acompaña tus mejores momentos."
            </p>

            <div className="text-xs text-[#C49A5A] font-medium space-y-1">
              <p>📍 {config.city}, {config.country} — Fundada en {config.yearFounded}</p>
              <p>💳 Métodos de pago aceptados: <span className="text-[#FAF3E3] font-semibold">Yape | Efectivo</span></p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif-heading font-bold text-[#C49A5A] uppercase text-xs tracking-wider">
              Navegación
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-[#F3E5C8]/80">
              <li>
                <a href="#inicio" className="hover:text-[#C49A5A] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-[#C49A5A] transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#C49A5A] transition-colors">
                  Menú
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#C49A5A] transition-colors">
                  Pedidos
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="hover:text-[#C49A5A] transition-colors">
                  Ubicación
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-[#C49A5A] transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Admin shortcut & Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif-heading font-bold text-[#C49A5A] uppercase text-xs tracking-wider">
              Atención
            </h4>
            <p className="text-xs text-[#F3E5C8]/80">{config.hours}</p>
            <p className="text-xs text-[#F3E5C8]/80">{config.phoneWhatsapp}</p>

            <button
              onClick={onOpenAdmin}
              className="mt-2 text-[11px] text-[#C49A5A] hover:underline block opacity-80 hover:opacity-100"
            >
              ⚙️ Administrar Precios y Yape
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F3E5C8]/60 gap-4">
          <p>© 2026 Cafeking. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Elaborado con dedicación para Cusco</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
          </p>
        </div>

      </div>
    </footer>
  );
};
