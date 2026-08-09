import React, { useState } from 'react';
import { Mail, Phone, Send, MessageSquare, Facebook, Instagram, CheckCircle2 } from 'lucide-react';
import { BusinessConfig } from '../types';

interface ContactSectionProps {
  config: BusinessConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  const rawPhone = config.phoneWhatsapp.replace(/\D/g, '');

  return (
    <section id="contacto" className="py-20 bg-[#F3E5C8]/30 text-[#3B2418] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Info & Social Media Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3E5C8] border border-[#C49A5A]/50 text-[#6F4E37] text-xs font-semibold uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-[#C49A5A]" />
              <span>Atención al Cliente</span>
            </div>

            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#3B2418]">
              ¿Tienes alguna consulta?
            </h2>

            <p className="text-sm sm:text-base text-[#3B2418]/80 font-light leading-relaxed">
              Escríbenos directamente o contáctanos por nuestras redes sociales. Estamos siempre gustosos de atenderte.
            </p>

            {/* Quick Links Card */}
            <div className="space-y-3 pt-2">
              
              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${rawPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#FFFDF8] border border-[#F3E5C8] hover:border-[#C49A5A] shadow-xs flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#3B2418]">WhatsApp Cafeking</h4>
                    <p className="text-xs text-[#6F4E37]">{config.phoneWhatsapp}</p>
                  </div>
                </div>
                <span className="text-xs text-[#C49A5A] font-semibold group-hover:translate-x-1 transition-transform">
                  Escribir →
                </span>
              </a>

              {/* Social Icons List */}
              <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#F3E5C8] flex items-center justify-between">
                <span className="text-xs font-bold text-[#6F4E37] uppercase tracking-wider">
                  Síguenos en redes:
                </span>
                
                <div className="flex items-center gap-3">
                  <a
                    href={config.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#3B2418] text-[#FAF3E3] hover:bg-[#6F4E37] transition-colors"
                    title="Facebook Cafeking"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={config.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#3B2418] text-[#FAF3E3] hover:bg-[#6F4E37] transition-colors"
                    title="Instagram Cafeking"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#FFFDF8] p-8 rounded-2xl border border-[#F3E5C8] shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <CheckCircle2 className="w-14 h-14 text-emerald-700 mx-auto" />
                <h3 className="font-serif-heading font-bold text-2xl text-[#3B2418]">
                  ¡Mensaje enviado correctamente!
                </h3>
                <p className="text-xs text-[#6F4E37] max-w-sm mx-auto">
                  Gracias por comunicarte con Cafeking. Nos pondremos en contacto contigo lo antes posible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre completo"
                      className="w-full px-3.5 py-2.5 bg-[#FAF3E3] border border-[#F3E5C8] rounded-xl text-xs text-[#3B2418] placeholder-[#6F4E37]/50 focus:outline-none focus:border-[#C49A5A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3.5 py-2.5 bg-[#FAF3E3] border border-[#F3E5C8] rounded-xl text-xs text-[#3B2418] placeholder-[#6F4E37]/50 focus:outline-none focus:border-[#C49A5A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Número de contacto"
                    className="w-full px-3.5 py-2.5 bg-[#FAF3E3] border border-[#F3E5C8] rounded-xl text-xs text-[#3B2418] placeholder-[#6F4E37]/50 focus:outline-none focus:border-[#C49A5A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6F4E37] mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escribe tu consulta o sugerencia aquí..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF3E3] border border-[#F3E5C8] rounded-xl text-xs text-[#3B2418] placeholder-[#6F4E37]/50 focus:outline-none focus:border-[#C49A5A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#3B2418] hover:bg-[#6F4E37] text-[#FAF3E3] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C49A5A]" />
                  <span>Enviar mensaje</span>
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
