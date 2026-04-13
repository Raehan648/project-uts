import { Component, OnInit } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StorageService } from '../../services/storage';
import {
  DZIKIR_PAGI, DZIKIR_PETANG, TASBIH_LIST, DzikirItem,
} from './dzikir.data';

@Component({
  selector: 'app-dzikir',
  templateUrl: './dzikir.page.html',
  styleUrls: ['./dzikir.page.scss'],
  standalone: false,
})
export class DzikirPage implements OnInit {
  activeTab: 'tasbih' | 'pagi' | 'petang' = 'tasbih';

  // Tasbih
  tasbihList = TASBIH_LIST;
  selectedTasbih = TASBIH_LIST[0];
  count = 0;
  totalCount = 0;

  // Dzikir
  dzikirPagi   = DZIKIR_PAGI;
  dzikirPetang = DZIKIR_PETANG;
  doneIds: number[] = [];

  constructor(private storageSvc: StorageService) {}

  async ngOnInit() {
    const savedCount  = await this.storageSvc.get<number>('tasbihCount');
    const savedTotal  = await this.storageSvc.get<number>('tasbihTotal');
    const savedDone   = await this.storageSvc.get<number[]>('dzikirDone');
    const savedTasbih = await this.storageSvc.get<number>('tasbihIndex');

    if (savedCount  !== null) this.count      = savedCount;
    if (savedTotal  !== null) this.totalCount  = savedTotal;
    if (savedDone   !== null) this.doneIds     = savedDone;
    if (savedTasbih !== null) this.selectedTasbih = TASBIH_LIST[savedTasbih] ?? TASBIH_LIST[0];
  }

  async tap() {
    this.count++;
    this.totalCount++;
    await Haptics.impact({ style: ImpactStyle.Light });

    if (this.count >= this.selectedTasbih.target) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      // Auto advance to next
      const idx = TASBIH_LIST.indexOf(this.selectedTasbih);
      if (idx < TASBIH_LIST.length - 1) {
        setTimeout(() => { this.count = 0; this.selectedTasbih = TASBIH_LIST[idx + 1]; }, 400);
      }
    }
    await this.storageSvc.set('tasbihCount', this.count);
    await this.storageSvc.set('tasbihTotal', this.totalCount);
  }

  async resetCount() {
    this.count = 0;
    await this.storageSvc.set('tasbihCount', 0);
  }

  async selectTasbih(t: typeof TASBIH_LIST[0]) {
    this.selectedTasbih = t;
    this.count = 0;
    await this.storageSvc.set('tasbihIndex', TASBIH_LIST.indexOf(t));
    await this.storageSvc.set('tasbihCount', 0);
  }

  get progressPercent(): number {
    return Math.min(100, Math.round((this.count / this.selectedTasbih.target) * 100));
  }

  async toggleDone(item: DzikirItem) {
    const idx = this.doneIds.indexOf(item.id);
    if (idx >= 0) this.doneIds.splice(idx, 1);
    else {
      this.doneIds.push(item.id);
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
    await this.storageSvc.set('dzikirDone', [...this.doneIds]);
  }

  isDone(item: DzikirItem): boolean { return this.doneIds.includes(item.id); }
}