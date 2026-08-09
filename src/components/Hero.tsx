import React from 'react';
import { Coffee, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#3B2418]">
      
      {/* Background Image with Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/cafeking_hero_coffee_1786207020319.jpg"
          alt="Cafeking Cusco Coffee"
          className="w-full h-full object-cover object-center opacity-35 scale-105 filter brightness-90 saturate-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2418] via-[#3B2418]/70 to-[#3B2418]/40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Heritage Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6F4E37]/60 border border-[#C49A5A]/50 text-[#F3E5C8] text-xs font-medium mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C49A5A]" />
          <span>Tradición y Calidad en Cusco desde el año 2000</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#FAF3E3] tracking-tight leading-tight mb-6">
          El sabor que acompaña <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#F3E5C8] text-opacity-95">tus mejores momentos</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#F3E5C8]/90 font-light leading-relaxed mb-10">
          Desde Cusco, compartiendo el aroma y sabor del buen café desde el año 2000.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href="#menu"
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-[#3B2418] bg-[#F3E5C8] hover:bg-[#C49A5A] rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>Ver nuestro menú</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#3B2418]" />
          </a>

          <a
            href="#menu"
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-[#FAF3E3] bg-[#6F4E37]/80 hover:bg-[#6F4E37] border border-[#C49A5A]/40 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Coffee className="w-4 h-4 text-[#C49A5A]" />
            <span>Hacer pedido</span>
          </a>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-[#6F4E37]/40 text-[#F3E5C8]/80 text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-2 py-2">
            <MapPin className="w-4 h-4 text-[#C49A5A]" />
            <span>Cusco, Perú</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-2 border-y sm:border-y-0 sm:border-x border-[#6F4E37]/40">
            <Coffee className="w-4 h-4 text-[#C49A5A]" />
            <span>Café Tradicional</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-2">
            <ShieldCheck className="w-4 h-4 text-[#C49A5A]" />
            <span>Pago con Yape & Efectivo</span>
          </div>
        </div>

      </div>
    </section>
  );
};
