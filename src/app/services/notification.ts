import { Injectable } from '@angular/core';
import {
  LocalNotifications,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import { PrayerItem } from './prayer';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  async requestPermission(): Promise<boolean> {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  async schedulePrayerReminders(prayerList: PrayerItem[], minutesBefore = 5) {
    // Batalkan notifikasi lama dulu
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    const notifications: ScheduleOptions['notifications'] = prayerList
      .map((p, idx) => {
        const [hh, mm] = p.time.split(':').map(Number);
        const scheduleDate = new Date();
        scheduleDate.setHours(hh, mm - minutesBefore, 0, 0);
        if (scheduleDate < new Date()) {
          scheduleDate.setDate(scheduleDate.getDate() + 1);
        }
        return {
          id: idx + 1,
          title: `🕌 Waktu ${p.name} Segera Tiba`,
          body: `${minutesBefore} menit lagi — ${p.time}`,
          schedule: { at: scheduleDate, repeats: true },
          sound: 'adzan.wav',
          smallIcon: 'ic_adzan',
          iconColor: '#C9973A',
        };
      });

    await LocalNotifications.schedule({ notifications });
  }

  async cancelAll() {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }
  }
}