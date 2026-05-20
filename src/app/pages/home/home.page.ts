import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrayerService, PrayerItem } from '../../services/prayer';
import { LocationService } from '../../services/location';
import { StorageService } from '../../services/storage';
import { NotificationService } from '../../services/notification';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  userName = 'Sahabat';
  hijriDate = '';
  prayerList: PrayerItem[] = [];
  nextPrayer: PrayerItem | null = null;
  countdown = '--:--:--';
  isLoading = true;
  errorMsg = '';

  private subs: Subscription[] = [];

  constructor(
    private prayerSvc: PrayerService,
    private locationSvc: LocationService,
    private storageSvc: StorageService,
    private notifSvc: NotificationService,
    private router: Router
  ) {}

  async ngOnInit() {
    const savedName = await this.storageSvc.get<string>('userName');
    if (savedName) this.userName = savedName;

    // 1. Pastikan izin lokasi diperiksa/diminta terlebih dahulu saat aplikasi dimuat
    await this.checkLocation();

    await this.loadPrayerData();
    this.loadHijriDate();

    this.subs.push(
      this.prayerSvc.countdown$.subscribe((v) => (this.countdown = v)),
      this.prayerSvc.nextPrayer$.subscribe((v) => (this.nextPrayer = v))
    );
  }

  async loadPrayerData() {
    this.isLoading = true;
    this.errorMsg = '';
    try {
      // 2. Tangani jika lokasi ditolak agar aplikasi tidak crash
      const coords = await this.locationSvc.getCurrentPosition().catch(() => {
        return { latitude: -6.2088, longitude: 106.8456 }; // Koordinat fallback (Jakarta)
      });

      this.prayerSvc.getTodayTimings(coords.latitude, coords.longitude).pipe(
        catchError((err) => {
          console.error('Gagal mengambil jadwal:', err);
          return of(null);
        })
      ).subscribe({
        next: (timings) => {
          if (timings) {
            this.prayerList = this.prayerSvc.buildPrayerList(timings);
            this.prayerSvc.startCountdown(this.prayerList);
            this.notifSvc.schedulePrayerReminders(this.prayerList);
          } else {
            this.errorMsg = 'Jadwal sholat tidak dapat dimuat, menggunakan data perkiraan.';
          }
          this.isLoading = false;
        },
        error: () => {
          this.errorMsg = 'Gagal memuat jadwal sholat. Periksa koneksi internet.';
          this.isLoading = false;
        },
      });
    } catch {
      this.errorMsg = 'Izin lokasi diperlukan untuk menampilkan jadwal sholat.';
      this.isLoading = false;
    }
  }

  async checkLocation() {
    try {
      const check = await Geolocation.checkPermissions();
      if (check.location === 'prompt' || check.location === 'denied') {
        await Geolocation.requestPermissions();
      }
    } catch (e) {
      console.warn('Gagal meminta izin lokasi:', e);
    }
  }

  loadHijriDate() {
    this.prayerSvc.getHijriDate().subscribe({
      next: (h) => {
        this.hijriDate = `${h.day} ${h.month.en} ${h.year} H`;
      },
    });
  }

  isPassed(time: string): boolean {
    const [hh, mm] = time.split(':').map(Number);
    const t = new Date();
    t.setHours(hh, mm, 0, 0);
    return t < new Date();
  }

  isNext(prayer: PrayerItem): boolean {
    return this.nextPrayer?.name === prayer.name;
  }

  getProgressWidth(): string {
    if (!this.nextPrayer || this.prayerList.length === 0) return '0%';
    const idx = this.prayerList.findIndex((p) => p.name === this.nextPrayer?.name);
    return `${(idx / this.prayerList.length) * 100}%`;
  }

  greetingText(): string {
    const h = new Date().getHours();
    if (h < 5)  return 'Selamat dini hari';
    if (h < 11) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 18) return 'Selamat sore';
    return 'Selamat malam';
  }

  navigateTo(path: string) {
    this.router.navigate(['/tabs', path]);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}