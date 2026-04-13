import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Surah {
  number: number;
  name: string;           // Arab
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string; // Meccan | Medinan
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;           // Arab
  translation?: string;
  audio?: string;
}

export interface SurahDetail {
  surah: Surah;
  ayahs: Ayah[];
}

@Injectable({ providedIn: 'root' })
export class QuranService {
  private readonly API = 'https://api.alquran.cloud/v1';
  private readonly AUDIO_BASE = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy';

  constructor(private http: HttpClient) {}

  getAllSurahs(): Observable<Surah[]> {
    return this.http
      .get<any>(`${this.API}/surah`)
      .pipe(map((res) => res.data as Surah[]));
  }

  getSurahWithTranslation(number: number): Observable<SurahDetail> {
    // Fetch Arabic + Indonesian translation in parallel via editions
    return this.http
      .get<any>(`${this.API}/surah/${number}/editions/quran-simple,id.indonesian`)
      .pipe(
        map((res) => {
          const arabic: any = res.data[0];
          const indo: any   = res.data[1];
          const ayahs: Ayah[] = arabic.ayahs.map((a: any, i: number) => ({
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: a.text,
            translation: indo.ayahs[i]?.text ?? '',
            audio: `${this.AUDIO_BASE}/${a.number}.mp3`,
          }));
          return { surah: arabic as Surah, ayahs };
        })
      );
  }
}