import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { StorageService } from '../../services/storage';
import { ThemeService } from '../../services/theme';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  userName      = 'Ahmad Fauzi';
  cityName      = 'Cikampek, Jawa Barat';
  prayerMethod  = 'Kemenag RI';
  isDarkMode    = true;
  notifAdzan    = true;
  notifDzikir   = true;
  fontSizeLabel = 'Sedang (18px)';
  appVersion    = '1.0.0';

  constructor(
    private storageSvc: StorageService,
    private themeSvc: ThemeService,
    private notifSvc: NotificationService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.userName     = (await this.storageSvc.get<string>('userName'))     ?? 'Ahmad Fauzi';
    this.cityName     = (await this.storageSvc.get<string>('cityName'))     ?? 'Cikampek, Jawa Barat';
    this.prayerMethod = (await this.storageSvc.get<string>('prayerMethod')) ?? 'Kemenag RI';
    this.notifAdzan   = (await this.storageSvc.get<boolean>('notifAdzan'))  ?? true;
    this.notifDzikir  = (await this.storageSvc.get<boolean>('notifDzikir')) ?? true;
    this.isDarkMode   = this.themeSvc.theme$.getValue() === 'dark';
  }

  async editProfile() {
    const alert = await this.alertCtrl.create({
      header: 'Edit Profil',
      cssClass: 'custom-alert',
      inputs: [
        { name: 'name', type: 'text', value: this.userName, placeholder: 'Nama Anda' },
        { name: 'city', type: 'text', value: this.cityName, placeholder: 'Kota Anda' },
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Simpan',
          handler: async (d) => {
            if (d.name?.trim()) { this.userName = d.name.trim(); await this.storageSvc.set('userName', this.userName); }
            if (d.city?.trim()) { this.cityName = d.city.trim(); await this.storageSvc.set('cityName', this.cityName); }
            this.showToast('Profil diperbarui ✓');
          },
        },
      ],
    });
    await alert.present();
  }

  async toggleNotifAdzan() {
    await this.storageSvc.set('notifAdzan', this.notifAdzan);
    if (!this.notifAdzan) await this.notifSvc.cancelAll();
    this.showToast(this.notifAdzan ? 'Adzan aktif ✓' : 'Adzan dinonaktifkan');
  }

  async toggleNotifDzikir() {
    await this.storageSvc.set('notifDzikir', this.notifDzikir);
    this.showToast(this.notifDzikir ? 'Dzikir pagi aktif ✓' : 'Dinonaktifkan');
  }

  async toggleTheme() {
    await this.themeSvc.toggleTheme();
    this.isDarkMode = this.themeSvc.theme$.getValue() === 'dark';
  }

  async changeFontSize() {
    const alert = await this.alertCtrl.create({
      header: 'Ukuran Font Arab',
      cssClass: 'custom-alert',
      inputs: [
        { label: 'Kecil (16px)',  type: 'radio', value: 'small',  checked: this.fontSizeLabel.includes('Kecil') },
        { label: 'Sedang (18px)', type: 'radio', value: 'medium', checked: this.fontSizeLabel.includes('Sedang') },
        { label: 'Besar (24px)',  type: 'radio', value: 'large',  checked: this.fontSizeLabel.includes('Besar') },
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Simpan',
          handler: (val) => {
            const map: any = { small: 'Kecil (16px)', medium: 'Sedang (18px)', large: 'Besar (24px)' };
            const px: any  = { small: '16px', medium: '18px', large: '24px' };
            this.fontSizeLabel = map[val];
            document.documentElement.style.setProperty('--quran-font-size', px[val]);
            this.storageSvc.set('fontSize', val);
            this.showToast('Ukuran font diperbarui ✓');
          },
        },
      ],
    });
    await alert.present();
  }

  async showAbout() {
    const alert = await this.alertCtrl.create({
      header: 'Ibadah Assistant App',
      message: `Versi ${this.appVersion}<br><br>Aplikasi asisten ibadah Muslim.<br><em>UTS Mobile Programming 2025</em>`,
      cssClass: 'custom-alert',
      buttons: ['Tutup'],
    });
    await alert.present();
  }

  private async showToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, position: 'bottom', cssClass: 'custom-toast' });
    await t.present();
  }
}