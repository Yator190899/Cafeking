import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Receipt, 
  Package, 
  Bell, 
  Pickaxe, 
  CloudCheck, 
  LogOut, 
  LogIn, 
  X,
  Database,
  Download,
  Smartphone,
  QrCode,
  CalendarDays,
  FolderArchive
} from 'lucide-react';
import { NavigationTab } from '../types';
import { User } from 'firebase/auth';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  pendingOrdersCount: number;
  pendingRemindersCount: number;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onOpenInstallModal: () => void;
  onOpenQRModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingOrdersCount,
  pendingRemindersCount,
  user,
  onLogin,
  onLogout,
  mobileMenuOpen,
  onCloseMobileMenu,
  onOpenInstallModal,
  onOpenQRModal,
}) => {
  const { isInstalled } = usePWAInstall();

  const navItems = [
    {
      id: 'inicio' as NavigationTab,
      label: 'Inicio',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'apuntes' as NavigationTab,
      label: 'Mis apuntes',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'gastos' as NavigationTab,
      label: 'Gastos',
      icon: Receipt,
      badge: null,
    },
    {
      id: 'pedidos' as NavigationTab,
      label: 'Pedidos',
      icon: Package,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'recordatorios' as NavigationTab,
      label: 'Recordatorios',
      icon: Bell,
      badge: pendingRemindersCount > 0 ? pendingRemindersCount : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'calendario' as NavigationTab,
      label: 'Calendario',
      icon: CalendarDays,
      badge: null,
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onCloseMobileMenu();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Pickaxe className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-white uppercase flex items-center gap-1.5">
              Mi Libreta <span className="text-amber-400">Minera</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Gestión y Control de Operaciones</p>
          </div>
        </div>
        {mobileMenuOpen && (
          <button
            onClick={onCloseMobileMenu}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Módulos Principales
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-amber-400 scale-105' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Install App Promotional Card inside Sidebar */}
        {!isInstalled && (
          <div className="pt-4 px-1">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-850 to-slate-850 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Instalar como App</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Úsala en tu celular sin conexión y como aplicación nativa desde tu pantalla de inicio.
              </p>
              <button
                onClick={() => {
                  onOpenInstallModal();
                  onCloseMobileMenu();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Instalar en Dispositivo</span>
              </button>

              <button
                onClick={() => {
                  onOpenQRModal();
                  onCloseMobileMenu();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Escanear QR para Celular</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Database & Account Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        {/* Sync Mode Badge */}
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-2">
            {user ? (
              <CloudCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Database className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-slate-300 font-medium">
              {user ? 'Nube Firestore Activa' : 'Almacenamiento Local'}
            </span>
          </div>
          <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        </div>

        {/* User Card / Login Action */}
        {user ? (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuario'}
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 text-amber-400 font-bold flex items-center justify-center text-xs">
                  {(user.displayName || user.email || 'M')[0].toUpperCase()}
                </div>
              )}
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white truncate">
                  {user.displayName || 'Minero'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-400 leading-tight">
              Inicia sesión con Google para sincronizar tus datos en tiempo real entre tus dispositivos.
            </p>
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Conectar con Google</span>
            </button>
          </div>
        )}

        {/* Download Project ZIP */}
        <div className="pt-2 border-t border-slate-800/80">
          <a
            href="/mi-libreta-minera.zip"
            download="mi-libreta-minera.zip"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
            title="Descargar todo el código fuente en formato .ZIP"
          >
            <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
            <span>Descargar Proyecto (.ZIP)</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Mobile slide-over drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
