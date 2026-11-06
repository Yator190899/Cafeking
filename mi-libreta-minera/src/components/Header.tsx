import React, { useState, useEffect } from 'react';
import { Menu, Bell, Volume2, Calendar, Plus, Download, Smartphone, QrCode, Maximize2, Minimize2 } from 'lucide-react';
import { NavigationTab } from '../types';
import { playChimeSound, requestNotificationPermission } from '../services/notificationService';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenMobileMenu: () => void;
  pendingRemindersCount: number;
  onQuickNew: (type: 'gasto' | 'apunte' | 'pedido' | 'recordatorio') => void;
  onOpenInstallModal: () => void;
  onOpenQRModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  pendingRemindersCount,
  onQuickNew,
  onOpenInstallModal,
  onOpenQRModal,
}) => {
  const { isInstalled } = usePWAInstall();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const titles: Record<NavigationTab, { title: string; subtitle: string }> = {
    inicio: {
      title: 'Panel Principal',
      subtitle: 'Resumen financiero, operaciones de guardia y alertas del campamento'
    },
    apuntes: {
      title: 'Bloc de Notas Minero',
      subtitle: 'Registro de guardia, avances de perforación y apuntes de campo'
    },
    gastos: {
      title: 'Control de Gastos (S/)',
      subtitle: 'Registro de compras, insumos, repuestos y exportación a Excel'
    },
    pedidos: {
      title: 'Gestión de Pedidos',
      subtitle: 'Requisiciones a proveedores y seguimiento de entregas'
    },
    recordatorios: {
      title: 'Avisos y Recordatorios',
      subtitle: 'Programación de alertas para pagos, tareas y compras'
    },
    calendario: {
      title: 'Calendario de Operaciones',
      subtitle: 'Cronograma visual de gastos diarios (S/), llegada de pedidos y vencimientos'
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handleTestChime = () => {
    playChimeSound('reminder');
    requestNotificationPermission();
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger (mobile) + Section Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden focus:outline-hidden"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight capitalize">
              {titles[currentTab]?.title || 'Mi Libreta Minera'}
            </h2>
            <p className="hidden sm:block text-xs text-slate-400">
              {titles[currentTab]?.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Date, Install App Button, Sound Test, Quick Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Calendar pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{todayFormatted}</span>
          </div>

          {/* Open on Phone / QR Code button */}
          <button
            onClick={onOpenQRModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            title="Escanear código QR para abrir en tu celular"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">En Celular</span>
          </button>

          {/* Install App Button (prominent in header) */}
          {!isInstalled && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all border border-amber-400/40"
              title="Instalar Mi Libreta Minera en este celular o computadora"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">Instalar App</span>
              <span className="xs:hidden">App</span>
            </button>
          )}

          {/* Fullscreen / Native App mode button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa (Modo App Nativa)'}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 flex items-center gap-1 text-xs"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden xl:inline text-slate-400">
              {isFullscreen ? 'Ventana' : 'Modo App'}
            </span>
          </button>

          {/* Reminder Bell indicator */}
          <div className="relative">
            <button
              onClick={() => onQuickNew('recordatorio')}
              title="Recordatorios activos"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {pendingRemindersCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
              {pendingRemindersCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Quick Add Button */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">Registrar</span>
            </button>

            {/* Dropdown menu on hover/focus */}
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1.5 hidden group-hover:block group-focus-within:block z-30">
              <button
                onClick={() => onQuickNew('gasto')}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Nuevo Gasto (S/)
              </button>
              <button
                onClick={() => onQuickNew('apunte')}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Nuevo Apunte / Nota
              </button>
              <button
                onClick={() => onQuickNew('pedido')}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Nuevo Pedido
              </button>
              <button
                onClick={() => onQuickNew('recordatorio')}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Nuevo Recordatorio
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
