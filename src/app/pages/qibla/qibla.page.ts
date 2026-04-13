import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from '../../services/location';

@Component({
  selector: 'app-qibla',
  templateUrl: './qibla.page.html',
  styleUrls: ['./qibla.page.scss'],
  standalone: false,
})
export class QiblaPage implements OnInit, OnDestroy {
  qiblaAngle   = 0;
  compassAngle = 0;
  needleAngle  = 0;
  latitude     = 0;
  longitude    = 0;
  distance     = 0;
  isLoading    = true;
  errorMsg     = '';
  ticks: number[] = Array.from({ length: 12 }, (_, i) => i * 30);
  private motionListener: any;

  constructor(private locationSvc: LocationService) {}

  async ngOnInit() {
    await this.loadLocation();
    this.startCompass();
  }

  async loadLocation() {
    this.isLoading = true;
    this.errorMsg  = '';
    try {
      const coords        = await this.locationSvc.getCurrentPosition();
      this.latitude       = coords.latitude;
      this.longitude      = coords.longitude;
      this.qiblaAngle     = this.locationSvc.qiblaDirection(coords.latitude, coords.longitude);
      this.distance       = this.locationSvc.distanceToMecca(coords.latitude, coords.longitude);
      this.needleAngle    = this.qiblaAngle; // default statis di browser
      this.isLoading      = false;
    } catch {
      this.errorMsg  = 'Izin lokasi diperlukan. Aktifkan GPS dan izinkan akses lokasi di browser.';
      this.isLoading = false;
    }
  }

  async startCompass() {
    try {
      const { Motion } = await import('@capacitor/motion');
      this.motionListener = await Motion.addListener('orientation', (event: any) => {
        this.compassAngle = event.alpha ?? 0;
        this.needleAngle  = this.qiblaAngle - this.compassAngle;
      });
    } catch {
      // Tidak tersedia di browser — tampilan statis sudah cukup
    }
  }

  async refresh() {
    this.locationSvc.coords$.next(null);
    await this.loadLocation();
  }

  ngOnDestroy() {
    this.motionListener?.remove?.();
  }
}