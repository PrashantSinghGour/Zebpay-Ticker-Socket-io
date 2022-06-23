import { Injectable } from '@angular/core';
import { HapticService } from './haptic.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private lightTheme: any = {
    'background-color': '#fcfcfc',
    'text-black': '#111',
    'text-white': '#fff',
    'text-green': '#198754',
    'text-red': '#DC3534',
  };
  private darkTheme: any = {
    'background-color': '#1b2531',
    'text-black': '#fff',
    'text-white': '#111',
    'text-green': '#24c47a',
    'text-red': '#ff4645',
  };
  private themeWrapper = document.querySelector('body');
  constructor(private haptic: HapticService) { }

  setTheme(isDark = false) {
    this.haptic.vibrate(50);
    if (isDark) {
      Object.keys(this.darkTheme).forEach((key) => {
        const value = this.darkTheme[key];
        if (this.themeWrapper) {
          this.themeWrapper.style.setProperty('--' + key, value);
        }
      });
    } else {
      Object.keys(this.lightTheme).forEach((key) => {
        const value = this.lightTheme[key];
        if (this.themeWrapper) {
          this.themeWrapper.style.setProperty('--' + key, value);
        }
      });
    }
  }
}

