import React from 'react';
import { Award, Clock, Heart, Coffee } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="nosotros" className="py-20 bg-[#FAF3E3] text-[#3B2418] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with Highlight Card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F3E5C8]">
              <img
                src="/src/assets/images/cafeking_cusco_ambiance_1786207053396.jpg"
                alt="Ambiente acogedor de Cafeking en Cusco"
                className="w-full h-[400px] sm:h-[480px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B2418]/60 via-transparent to-transparent" />
            </div>

            {/* Floating Highlight Card */}
            <div className="absolute -bottom-6 -right-2 sm:bottom-6 sm:right-6 bg-[#F3E5C8] border border-[#C49A5A]/50 text-[#3B2418] p-5 rounded-xl shadow-xl max-w-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3B2418] flex items-center justify-center text-[#F3E5C8] shrink-0">
                <Coffee className="w-6 h-6 text-[#C49A5A]" />
              </div>
              <div>
                <p className="font-serif-heading font-bold text-lg leading-tight text-[#3B2418]">
                  Más de 20 años
                </p>
                <p className="text-xs text-[#6F4E37] font-medium">
                  compartiendo el mejor café en Cusco
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: History & Narrative */}
          <div className="space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3E5C8] border border-[#C49A5A]/40 text-[#6F4E37] text-xs font-semibold uppercase tracking-wider">
              <span>Tradición Cusqueña</span>
            </div>

            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B2418] leading-tight">
              Nuestra historia
            </h2>

            <p className="text-base sm:text-lg text-[#3B2418]/85 leading-relaxed font-light">
              Cafeking nació en el año 2000 con una pasión sencilla: ofrecer café y crear momentos especiales alrededor de una buena taza. Desde entonces, hemos construido nuestra identidad sobre el sabor, la tradición y la cercanía con nuestros clientes.
            </p>

            {/* Timeline */}
            <div className="pt-4 border-t border-[#6F4E37]/20 space-y-4">
              
              <div className="flex items-start gap-4 p-3 rounded-lg bg-[#F3E5C8]/50 border border-[#C49A5A]/20">
                <div className="w-8 h-8 rounded-full bg-[#3B2418] text-[#FAF3E3] font-bold text-xs flex items-center justify-center shrink-0">
                  2000
                </div>
                <div>
                  <h4 className="font-serif-heading font-semibold text-[#3B2418]">Nace Cafeking</h4>
                  <p className="text-xs text-[#6F4E37]">
                    Iniciamos nuestras puertas en el corazón imperial de Cusco con la firme promesa de servir café recién elaborado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg bg-[#F3E5C8]/50 border border-[#C49A5A]/20">
                <div className="w-8 h-8 rounded-full bg-[#C49A5A] text-[#3B2418] font-bold text-xs flex items-center justify-center shrink-0">
                  Hoy
                </div>
                <div>
                  <h4 className="font-serif-heading font-semibold text-[#3B2418]">
                    Seguimos compartiendo el sabor del café en Cusco
                  </h4>
                  <p className="text-xs text-[#6F4E37]">
                    Uniendo a cusqueños y visitantes con atención cálida, recetas clásicas y la mejor experiencia de cafetería tradicional.
                  </p>
                </div>
              </div>

            </div>

            {/* Values Pill Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs font-medium">
              <div className="py-2.5 px-3 bg-[#FFFDF8] rounded-lg border border-[#F3E5C8] text-[#3B2418]">
                ☕ Calidad Artesanal
              </div>
              <div className="py-2.5 px-3 bg-[#FFFDF8] rounded-lg border border-[#F3E5C8] text-[#3B2418]">
                🏔️ Sabor Cusqueño
              </div>
              <div className="py-2.5 px-3 bg-[#FFFDF8] rounded-lg border border-[#F3E5C8] text-[#3B2418]">
                🤎 Calidez Humana
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
