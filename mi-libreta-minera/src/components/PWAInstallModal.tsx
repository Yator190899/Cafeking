import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Laptop, 
  Share, 
  PlusSquare, 
  CheckCircle, 
  ExternalLink, 
  Sparkles,
  Maximize2,
  PackageCheck,
  Check
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Modal } from './Modal';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedApkUrl, setCopiedApkUrl] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  };

  const appUrl = typeof window !== 'undefined' && window.location.href.startsWith('http')
    ? window.location.origin
    : 'https://ais-pre-yibuiuzaufkciop7c3zoaa-105774622607.us-east1.run.app';

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instalar y Convertir en Aplicación"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* App Hero Badge */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-850 border border-amber-500/30">
          <img
            src="/pwa-192x192.png"
            alt="Logo Mi Libreta Minera"
            className="w-14 h-14 rounded-2xl shadow-lg border border-amber-500/40 object-cover"
          />
          <div>
            <h4 className="font-extrabold text-white text-base">Mi Libreta Minera</h4>
            <p className="text-xs text-amber-300 font-semibold">Aplicación Nativa Instalable (PWA / Android APK)</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sin barras de navegador, acceso directo con ícono y modo sin conexión.
            </p>
          </div>
        </div>

        {/* 1-Click Install Button or Fullscreen Action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {isInstallable && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 col-span-full"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Instalar Aplicación Ahora (1 Clic)</span>
            </button>
          )}

          <button
            onClick={handleToggleFullscreen}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 font-bold text-xs transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-amber-400" />
            <span>Modo Pantalla Completa</span>
          </button>

          <a
            href={pwaBuilderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 font-bold text-xs transition-colors"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>Generar APK Android</span>
          </a>
        </div>

        {/* Instructions by Device */}
        <div className="space-y-2.5 pt-1">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            ¿Cómo tenerla como App en tu teléfono?
          </h5>

          {/* Android Option */}
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between text-white font-bold">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                En Celulares Android:
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Automático
              </span>
            </div>
            <p className="leading-relaxed">
              1. Abre el enlace en Google Chrome: <strong>{appUrl}</strong>
            </p>
            <p className="leading-relaxed">
              2. Toca los 3 puntos <strong className="text-amber-400">⋮</strong> arriba a la derecha.
            </p>
            <p className="leading-relaxed">
              3. Elige <strong className="text-amber-400">"Instalar aplicación"</strong> o <strong className="text-amber-400">"Agregar a la pantalla principal"</strong>.
            </p>
            <p className="text-[11px] text-slate-400">
              Android la empaquetará automáticamente como una aplicación de tu teléfono (WebAPK) con su propio ícono en tu menú de aplicaciones.
            </p>
          </div>

          {/* iPhone Safari Option */}
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between text-white font-bold">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-sky-400" />
                En iPhone o iPad (iOS):
              </span>
              <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                Paso a Paso
              </span>
            </div>
            <p className="leading-relaxed">
              1. Ábrela en Safari y toca el botón <strong className="text-sky-400">Compartir</strong> <Share className="w-3.5 h-3.5 inline mx-1" /> abajo.
            </p>
            <p className="leading-relaxed">
              2. Pulsa <strong className="text-amber-400">"Agregar a inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1" /> y luego <strong className="text-white">"Agregar"</strong>.
            </p>
          </div>

          {/* PC Desktop Option */}
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Laptop className="w-4 h-4 text-amber-400" />
              <span>En tu Computadora (Windows / Mac):</span>
            </div>
            <p className="leading-relaxed">
              Haz clic en el ícono de <strong className="text-amber-400">Instalar</strong> que aparece en la barra de direcciones de Chrome o Edge para que se ejecute en su propia ventana sin pestañas.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </Modal>
  );
};
