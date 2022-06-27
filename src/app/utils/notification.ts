import { showLocalNotification } from "../services/service-worker";

export class NotificationUpdate {
  public peakType: 'High' | 'Low' | undefined;
  constructor() { }

  checkPeaks(pairPrice: any) {
    const subscribedCoins: string[] = JSON.parse(localStorage.getItem('notifications') || '');
    if (!subscribedCoins.includes(pairPrice?.code)) {
      return;
    }
    console.log("🚀 ~ file: notification.ts ~ line 8 ~ NotificationUpdate ~ checkPeaks ~ pairPrice", pairPrice)
    const { prices } = pairPrice;
    this.peakType = undefined;
    if (prices.high24hr === prices.topBuy) {
      this.peakType = 'High';
    } else if (prices.low24hr === prices.topSell) {
      this.peakType = 'Low';
    }
    if (this.peakType) {
      const title = `${pairPrice.code} is going ${this.peakType === 'High' ? 'High 🚀 ' : 'Low 📉'}`;
      const message = `Current price of ${pairPrice.code} is @${prices.topBuy}`;
      showLocalNotification(title, message);
    }
  }
}


