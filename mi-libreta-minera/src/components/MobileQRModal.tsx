import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Share2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Modal } from './Modal';

interface MobileQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileQRModal: React.FC<MobileQRModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // App URL: Use current window URL or shared production URL
  const appUrl = typeof window !== 'undefined' && window.location.href.startsWith('http')
    ? window.location.origin
    : 'https://ais-pre-yibuiuzaufkciop7c3zoaa-105774622607.us-east1.run.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#090d16',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [isOpen, appUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Abrir Mi Libreta Minera en tu Celular"
      maxWidth="md"
    >
      <div className="space-y-5 text-center sm:text-left">
        {/* Intro */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Para poner en funcionamiento y usar la aplicación en tu teléfono móvil o compartirla con tu equipo de mina:
        </p>

        {/* QR Code Card */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-white rounded-2xl shadow-2xl">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Código QR para abrir en celular"
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-800">
                <QrCode className="w-12 h-12 animate-pulse" />
              </div>
            )}
          </div>

          <div className="text-center">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
              📱 Escanea con la cámara de tu celular
            </span>
            <p className="text-[11px] text-slate-400 mt-2 max-w-xs mx-auto">
              Apunta la cámara de tu smartphone (Android o iPhone) hacia la pantalla y toca el enlace que aparecerá.
            </p>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider text-left">
            O copia el enlace directo:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 px-3 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-slate-300 font-mono truncate focus:outline-hidden"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md shadow-amber-500/20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-left">
            Puedes pegarlo en WhatsApp y enviártelo para abrirlo con un toque en tu celular.
          </p>
        </div>

        {/* 3 Simple Steps */}
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2.5 text-left">
          <h5 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Paso a Paso para usarla:
          </h5>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1">
            <li>
              <strong>Abre el enlace</strong> en tu celular o computador.
            </li>
            <li>
              Toca <strong>"Instalar App"</strong> para que se guarde en tu pantalla de inicio como una aplicación normal.
            </li>
            <li>
              Pulsa <strong>"Conectar con Google"</strong> si deseas sincronizar tus datos en la nube para verlos tanto en tu celular como en tu computadora.
            </li>
          </ol>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};
