import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, Menu as MenuIcon, X, MapPin, Phone, Settings } from 'lucide-react';
import { BusinessConfig } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  config: BusinessConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenAdmin, config }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Menú', href: '#menu' },
    { name: 'Pedidos', href: '#menu' },
    { name: 'Ubicación', href: '#ubicacion' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#3B2418] text-[#FAF3E3] shadow-lg py-3'
          : 'bg-[#3B2418]/95 backdrop-blur-md text-[#FAF3E3] py-4 border-b border-[#6F4E37]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#inicio" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-[#C49A5A]/20 border border-[#C49A5A] flex items-center justify-center text-[#F3E5C8] group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-heading text-2xl font-bold tracking-wider text-[#FAF3E3]">
                CAFEKING
              </span>
              <span className="text-[10px] tracking-widest text-[#C49A5A] uppercase font-medium">
                Cusco • Desde 2000
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#FAF3E3]/80 hover:text-[#C49A5A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C49A5A] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Quick Admin Settings button */}
            <button
              onClick={onOpenAdmin}
              title="Configuración de Administrador"
              className="p-2 rounded-full text-[#FAF3E3]/70 hover:text-[#C49A5A] hover:bg-[#6F4E37]/30 transition-colors"
              aria-label="Configurar precios y Yape"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#6F4E37]/60 border border-[#C49A5A]/40 text-[#FAF3E3] hover:bg-[#6F4E37] transition-all flex items-center gap-2"
              aria-label="Ver pedido"
            >
              <ShoppingBag className="w-5 h-5 text-[#C49A5A]" />
              <span className="hidden sm:inline text-xs font-semibold pr-1">Mi Pedido</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C49A5A] text-[#3B2418] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu Button (CTA) */}
            <a
              href="#menu"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#3B2418] bg-[#F3E5C8] hover:bg-[#C49A5A] rounded-md transition-all shadow-sm"
            >
              Ver menú
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-[#FAF3E3] hover:bg-[#6F4E37]/40"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#3B2418] border-b border-[#6F4E37] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#FAF3E3] hover:text-[#C49A5A] hover:bg-[#6F4E37]/30 rounded-md"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-[#6F4E37]/40 flex flex-col gap-2">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#3B2418] bg-[#F3E5C8] rounded-md"
            >
              Ver Menú
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-center py-2 text-xs text-[#C49A5A] border border-[#C49A5A]/40 rounded-md flex items-center justify-center gap-1.5"
            >
              <Settings className="w-4 h-4" /> Configuración Cafeking
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
