import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { BehaviorSubject } from 'rxjs';

export interface Coords {
  latitude: number;
  longitude: number;
  city?: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  coords$ = new BehaviorSubject<Coords | null>(null);

  async getCurrentPosition(): Promise<Coords> {
    const cached = this.coords$.getValue();
    if (cached) return cached;

    try {
      // Periksa izin
      const perm = await Geolocation.checkPermissions();
      if (perm.location === 'denied' || perm.location === 'prompt') {
        const req = await Geolocation.requestPermissions();
        if (req.location !== 'granted') {
          throw new Error('Izin lokasi ditolak oleh pengguna.');
        }
      }

      // Ambil posisi
      const pos: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8_000,
      });

      const coords: Coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };

      this.coords$.next(coords);
      return coords;
    } catch (error) {
      console.warn('Gagal mendapatkan koordinat GPS, menggunakan lokasi default.', error);
      
      // Fallback Coordinates (Jakarta / Karawang Area)
      const defaultCoords: Coords = {
        latitude: -6.2088,
        longitude: 106.8456,
        city: 'Jakarta'
      };

      this.coords$.next(defaultCoords);
      return defaultCoords;
    }
  }

  /** Hitung jarak ke Mekkah dalam km menggunakan Haversine */
  distanceToMecca(lat: number, lng: number): number {
    const MECCA = { lat: 21.4225, lng: 39.8262 };
    const R = 6371;
    const dLat = this.toRad(MECCA.lat - lat);
    const dLng = this.toRad(MECCA.lng - lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat)) *
        Math.cos(this.toRad(MECCA.lat)) *
        Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  /** Hitung arah kiblat dalam derajat */
  qiblaDirection(lat: number, lng: number): number {
    const MECCA_LAT = 21.4225;
    const MECCA_LNG = 39.8262;
    const dLng = this.toRad(MECCA_LNG - lng);
    const y = Math.sin(dLng) * Math.cos(this.toRad(MECCA_LAT));
    const x =
      Math.cos(this.toRad(lat)) * Math.sin(this.toRad(MECCA_LAT)) -
      Math.sin(this.toRad(lat)) * Math.cos(this.toRad(MECCA_LAT)) * Math.cos(dLng);
    const bearing = (this.toDeg(Math.atan2(y, x)) + 360) % 360;
    return Math.round(bearing);
  }

  private toRad(deg: number) { return (deg * Math.PI) / 180; }
  private toDeg(rad: number) { return (rad * 180) / Math.PI; }
}