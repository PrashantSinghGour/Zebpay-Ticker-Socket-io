import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HapticService {

  constructor() { }
  /**
   * 
   * @param timeInMillisecond 
   * @description create a vibration
   */
  public vibrate(timeInMillisecond: number) {
    if (typeof window.navigator.vibrate !== "function") {
      console.error("Vibration API unavailable for this device");
      return;
    }
    window.navigator.vibrate([timeInMillisecond]);
  }
}
