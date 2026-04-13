import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerItem {
  name: string;
  nameAr: string;
  time: string;
  done?: boolean;
}

export interface HijriDate {
  day: string;
  month: { en: string; ar: string };
  year: string;
}

@Injectable({ providedIn: 'root' })
export class PrayerService {
  private readonly API = 'https://api.aladhan.com/v1';

  countdown$ = new BehaviorSubject<string>('--:--:--');
  nextPrayer$ = new BehaviorSubject<PrayerItem | null>(null);

  private prayerOrder: { key: keyof PrayerTimes; name: string; nameAr: string }[] = [
    { key: 'Fajr',    name: 'Subuh',   nameAr: 'الفجر'  },
    { key: 'Dhuhr',   name: 'Dzuhur',  nameAr: 'الظهر'  },
    { key: 'Asr',     name: 'Ashar',   nameAr: 'العصر'  },
    { key: 'Maghrib', name: 'Maghrib', nameAr: 'المغرب' },
    { key: 'Isha',    name: 'Isya',    nameAr: 'العشاء' },
  ];

  constructor(private http: HttpClient) {}

  getTodayTimings(lat: number, lng: number): Observable<PrayerTimes> {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const dateStr = `${dd}-${mm}-${yyyy}`;

    return this.http
      .get<any>(`${this.API}/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=20`)
      .pipe(map((res) => res.data.timings as PrayerTimes));
  }

  getWeeklyTimings(lat: number, lng: number): Observable<any[]> {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return this.http
      .get<any>(`${this.API}/calendar/${yyyy}/${mm}?latitude=${lat}&longitude=${lng}&method=20`)
      .pipe(map((res) => res.data.slice(0, 7)));
  }

  getHijriDate(): Observable<HijriDate> {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return this.http
      .get<any>(`${this.API}/gToH/${dd}-${mm}-${yyyy}`)
      .pipe(map((res) => res.data.hijri as HijriDate));
  }

  buildPrayerList(timings: PrayerTimes): PrayerItem[] {
    return this.prayerOrder.map((p) => ({
      name: p.name,
      nameAr: p.nameAr,
      time: timings[p.key],
    }));
  }

  startCountdown(prayerList: PrayerItem[]) {
    const next = this.findNextPrayer(prayerList);
    if (next) this.nextPrayer$.next(next);

    interval(1000).subscribe(() => {
      const n = this.findNextPrayer(prayerList);
      if (!n) return;
      this.nextPrayer$.next(n);

      const now = new Date();
      const [hh, minStr] = n.time.split(':');
      const target = new Date();
      target.setHours(+hh, +minStr, 0, 0);
      if (target < now) target.setDate(target.getDate() + 1);

      const diff = Math.max(0, target.getTime() - now.getTime());
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      this.countdown$.next(
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      );
    });
  }

  private findNextPrayer(list: PrayerItem[]): PrayerItem | null {
    const now = new Date();
    for (const p of list) {
      const [hh, mm] = p.time.split(':');
      const t = new Date();
      t.setHours(+hh, +mm, 0, 0);
      if (t > now) return p;
    }
    return list[0] ?? null;
  }
}