/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, testConnection } from './firebase/config';
import { 
  NavigationTab, 
  Note, 
  Expense, 
  Order, 
  Reminder, 
  OrderStatus 
} from './types';
import { 
  subscribeNotes, 
  saveNote, 
  deleteNote,
  subscribeExpenses, 
  saveExpense, 
  deleteExpense,
  subscribeOrders, 
  saveOrder, 
  updateOrderStatus, 
  deleteOrder,
  subscribeReminders, 
  saveReminder, 
  toggleReminderComplete, 
  deleteReminder,
  getGuestUserId,
  syncLocalDataToFirestore
} from './services/dataService';
import { checkUpcomingReminders } from './services/notificationService';
import { exportExpensesToExcel } from './services/excelService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { NotesSection } from './components/NotesSection';
import { ExpensesSection } from './components/ExpensesSection';
import { OrdersSection } from './components/OrdersSection';
import { RemindersSection } from './components/RemindersSection';
import { CalendarSection } from './components/CalendarSection';
import { PWAInstallModal } from './components/PWAInstallModal';
import { MobileQRModal } from './components/MobileQRModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [guestId, setGuestId] = useState<string>(getGuestUserId());

  // Domain data state
  const [notes, setNotes] = useState<Note[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Trigger states for quick register modals
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openReminderModal, setOpenReminderModal] = useState(false);

  // Active user ID (authenticated user or local guest ID)
  const activeUserId = user ? user.uid : guestId;

  // Listen to Firebase Auth state
  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync any local data created while offline or guest into user's cloud account
        try {
          await syncLocalDataToFirestore(currentUser.uid);
        } catch (err) {
          console.debug('Local sync skipped or completed:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to collections for the active user
  useEffect(() => {
    const unsubNotes = subscribeNotes(activeUserId, setNotes);
    const unsubExpenses = subscribeExpenses(activeUserId, setExpenses);
    const unsubOrders = subscribeOrders(activeUserId, setOrders);
    const unsubReminders = subscribeReminders(activeUserId, setReminders);

    return () => {
      unsubNotes();
      unsubExpenses();
      unsubOrders();
      unsubReminders();
    };
  }, [activeUserId]);

  // Periodic reminder notification check (every 30 seconds)
  useEffect(() => {
    checkUpcomingReminders(reminders);
    const interval = setInterval(() => {
      checkUpcomingReminders(reminders);
    }, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  // Quick Action Dispatcher
  const handleQuickNew = (type: 'gasto' | 'apunte' | 'pedido' | 'recordatorio', defaultDate?: string) => {
    switch (type) {
      case 'gasto':
        setCurrentTab('gastos');
        setOpenExpenseModal(true);
        break;
      case 'apunte':
        setCurrentTab('apuntes');
        break;
      case 'pedido':
        setCurrentTab('pedidos');
        setOpenOrderModal(true);
        break;
      case 'recordatorio':
        setCurrentTab('recordatorios');
        setOpenReminderModal(true);
        break;
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.warn('Login canceled or error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Badge counts
  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'pendiente' || o.status === 'en_camino').length;
  }, [orders]);

  const pendingRemindersCount = useMemo(() => {
    return reminders.filter((r) => !r.completed).length;
  }, [reminders]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Desktop / Mobile Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setOpenExpenseModal(false);
          setOpenOrderModal(false);
          setOpenReminderModal(false);
        }}
        pendingOrdersCount={pendingOrdersCount}
        pendingRemindersCount={pendingRemindersCount}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenQRModal={() => setIsQRModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-16 lg:pb-8">
        {/* Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          pendingRemindersCount={pendingRemindersCount}
          onQuickNew={handleQuickNew}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenQRModal={() => setIsQRModalOpen(true)}
        />

        {/* Workspace body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'inicio' && (
            <Dashboard
              notes={notes}
              expenses={expenses}
              orders={orders}
              reminders={reminders}
              onNavigate={(tab) => {
                setCurrentTab(tab);
                setOpenExpenseModal(false);
                setOpenOrderModal(false);
                setOpenReminderModal(false);
              }}
              onQuickNew={handleQuickNew}
              onToggleReminder={(id, comp) => toggleReminderComplete(id, activeUserId, comp)}
              onReceiveOrder={(id) => updateOrderStatus(id, activeUserId, 'recibido')}
              onExportExcel={() => exportExpensesToExcel(expenses, 'General')}
              onOpenInstallModal={() => setIsInstallModalOpen(true)}
              onOpenQRModal={() => setIsQRModalOpen(true)}
            />
          )}

          {currentTab === 'apuntes' && (
            <NotesSection
              notes={notes}
              onSaveNote={(note) => saveNote(note)}
              onDeleteNote={(id) => deleteNote(id, activeUserId)}
              userId={activeUserId}
            />
          )}

          {currentTab === 'gastos' && (
            <ExpensesSection
              expenses={expenses}
              onSaveExpense={(exp) => saveExpense(exp)}
              onDeleteExpense={(id) => deleteExpense(id, activeUserId)}
              userId={activeUserId}
              initialOpenModal={openExpenseModal}
            />
          )}

          {currentTab === 'pedidos' && (
            <OrdersSection
              orders={orders}
              onSaveOrder={(order) => saveOrder(order)}
              onUpdateStatus={(id, st) => updateOrderStatus(id, activeUserId, st)}
              onDeleteOrder={(id) => deleteOrder(id, activeUserId)}
              userId={activeUserId}
              initialOpenModal={openOrderModal}
            />
          )}

          {currentTab === 'recordatorios' && (
            <RemindersSection
              reminders={reminders}
              onSaveReminder={(rem) => saveReminder(rem)}
              onToggleComplete={(id, comp) => toggleReminderComplete(id, activeUserId, comp)}
              onDeleteReminder={(id) => deleteReminder(id, activeUserId)}
              userId={activeUserId}
              initialOpenModal={openReminderModal}
            />
          )}

          {currentTab === 'calendario' && (
            <CalendarSection
              notes={notes}
              expenses={expenses}
              orders={orders}
              reminders={reminders}
              onQuickNew={handleQuickNew}
              onToggleReminder={(id, comp) => toggleReminderComplete(id, activeUserId, comp)}
              onReceiveOrder={(id) => updateOrderStatus(id, activeUserId, 'recibido')}
              onNavigate={(tab) => {
                setCurrentTab(tab);
                setOpenExpenseModal(false);
                setOpenOrderModal(false);
                setOpenReminderModal(false);
              }}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setOpenExpenseModal(false);
          setOpenOrderModal(false);
          setOpenReminderModal(false);
        }}
        pendingOrdersCount={pendingOrdersCount}
        pendingRemindersCount={pendingRemindersCount}
      />

      {/* PWA Install Modal with 1-click install and device instructions */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Mobile QR Code Modal */}
      <MobileQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
