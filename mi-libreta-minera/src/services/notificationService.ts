import { Reminder } from '../types';

let notifiedReminderIds = new Set<string>();

// Synthesized sound chime using Web Audio API
export function playChimeSound(type: 'reminder' | 'success' | 'alert' = 'reminder') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'reminder') {
      // Pleasant mining chime (two harmonious tones)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.frequency.setValueAtTime(440, now); // A4
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.85);
      osc2.stop(now + 0.85);
    } else if (type === 'success') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      // Alert tone
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(300, now + 0.15);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (err) {
    console.debug('Web Audio context not initialized yet:', err);
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones de escritorio.');
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error solicitando permisos de notificación:', err);
    return 'denied';
  }
}

export function sendBrowserNotification(title: string, body: string) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(`[Mi Libreta Minera] ${title}`, {
        body,
        icon: '/favicon.ico',
        tag: 'mlm-reminder'
      });
      playChimeSound('reminder');
    } catch (e) {
      console.warn('Error displaying Notification:', e);
    }
  }
}

// Background checker for due reminders
export function checkUpcomingReminders(reminders: Reminder[], onAlert?: (reminder: Reminder) => void) {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  reminders.forEach((r) => {
    if (r.completed) return;
    if (notifiedReminderIds.has(r.id)) return;

    // Check if reminder is today and either due now or overdue
    if (r.dueDate === currentDate) {
      if (!r.dueTime || r.dueTime <= currentTime) {
        notifiedReminderIds.add(r.id);
        sendBrowserNotification(
          `Recordatorio de ${r.type.toUpperCase()}: ${r.title}`,
          r.notes ? `${r.notes} (Hora programada: ${r.dueTime || 'Hoy'})` : `Aviso programado para hoy: ${r.dueTime || 'Durante el día'}`
        );
        if (onAlert) {
          onAlert(r);
        }
      }
    } else if (r.dueDate < currentDate) {
      // Overdue
      if (!notifiedReminderIds.has(r.id)) {
        notifiedReminderIds.add(r.id);
        sendBrowserNotification(
          `Vencido: ${r.title}`,
          `Este recordatorio de ${r.type} estaba programado para el ${r.dueDate}.`
        );
      }
    }
  });
}
