import React from 'react';
import { MapPin, Clock, Phone, Navigation, Compass, Coffee } from 'lucide-react';
import { BusinessConfig } from '../types';

interface LocationSectionProps {
  config: BusinessConfig;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ config }) => {
  return (
    <section id="ubicacion" className="py-20 bg-[#FAF3E3] text-[#3B2418] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3E5C8] border border-[#C49A5A]/50 text-[#6F4E37] text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#C49A5A]" />
            <span>En el centro de Cusco</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B2418]">
            Visítanos en Cusco
          </h2>

          <p className="text-base sm:text-lg text-[#3B2418]/80 font-light">
            Te esperamos con los brazos abiertos en un ambiente cálido y tradicional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left info panel */}
          <div className="lg:col-span-5 bg-[#3B2418] text-[#FAF3E3] p-8 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#6F4E37] pb-4">
                <div className="w-12 h-12 rounded-full bg-[#6F4E37] flex items-center justify-center text-[#C49A5A]">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-2xl font-bold text-[#FAF3E3]">
                    {config.name}
                  </h3>
                  <p className="text-xs text-[#C49A5A] uppercase font-semibold tracking-wider">
                    {config.city}, {config.country}
                  </p>
                </div>
              </div>

              {/* Address detail */}
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#C49A5A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-bold text-[#C49A5A]">Dirección</h4>
                  <p className="text-sm text-[#F3E5C8] font-light mt-0.5">
                    {config.address}
                  </p>
                </div>
              </div>

              {/* Hours detail */}
              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#C49A5A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-bold text-[#C49A5A]">Horario de Atención</h4>
                  <p className="text-sm text-[#F3E5C8] font-light mt-0.5">
                    {config.hours}
                  </p>
                </div>
              </div>

              {/* Phone detail */}
              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#C49A5A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-bold text-[#C49A5A]">Teléfono / WhatsApp</h4>
                  <p className="text-sm text-[#F3E5C8] font-light mt-0.5">
                    {config.phoneWhatsapp}
                  </p>
                </div>
              </div>
            </div>

            {/* Directions Action button */}
            <div className="pt-4 border-t border-[#6F4E37]">
              <a
                href={config.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#F3E5C8] hover:bg-[#C49A5A] text-[#3B2418] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <Navigation className="w-4 h-4 text-[#3B2418] group-hover:rotate-45 transition-transform" />
                <span>Cómo llegar</span>
              </a>
            </div>

          </div>

          {/* Right Map Embed / Interactive View */}
          <div className="lg:col-span-7 bg-[#FFFDF8] rounded-2xl overflow-hidden border border-[#F3E5C8] shadow-xl min-h-[360px] relative">
            <iframe
              title="Cafeking Cusco Mapa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.172900762955!2d-71.9806!3d-13.5167!2m3!1f0!0f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd67389a42f65%3A0xb1a9c12217c0df!2sPlaza%20de%20Armas%20de%20Cusco!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter saturate-120"
            />
            <div className="absolute top-4 left-4 bg-[#3B2418] text-[#FAF3E3] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md border border-[#C49A5A]/40 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C49A5A]" />
              <span>Plaza de Armas de Cusco</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
