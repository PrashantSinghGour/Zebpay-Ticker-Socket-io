import { showLocalNotification } from "../services/service-worker";
import * as dayjs from 'dayjs';
export class NotificationUpdate {
  private static instance: NotificationUpdate;
  private peakType: 'High' | 'Low' | undefined;
  private notificationMap: any = {};
  private constructor() { }

  public static getInstance(): NotificationUpdate {
    if (!NotificationUpdate.instance) {
      NotificationUpdate.instance = new NotificationUpdate();
    }

    return NotificationUpdate.instance;
  }

  public checkPeaks(pairPrice: any) {
    const subscribedCoins: string[] = JSON.parse(localStorage.getItem('notifications') || '');
    if (!subscribedCoins.includes(pairPrice?.code)) {
      return;
    }
    const { prices } = pairPrice;
    this.peakType = undefined;
    // this.peakType = 'High';

    if (prices.high24hr <= prices.topBuy) {
      this.peakType = 'High';
    } else if (prices.low24hr === prices.topBuy || prices.low24hr > prices.topSell) {
      this.peakType = 'Low';
    }

    if (this.peakType) {
      const currentTime = dayjs().format('YYYY-MM-DD hh:mm:ss');
      if (this.notificationMap[pairPrice.code] && !dayjs(currentTime).isAfter(this.notificationMap[pairPrice.code])) {
        return;
      }

      const title = `${pairPrice.code} is going ${this.peakType === 'High' ? 'High 🚀 ' : 'Low 📉'}`;
      const message = `Current price of ${pairPrice.code} is @${prices.topBuy}`;
      showLocalNotification(title, message);

      this.notificationMap = {
        ...this.notificationMap,
        [pairPrice.code]: dayjs().add(3, 'minute').format('YYYY-MM-DD hh:mm:ss')
      }
    }
  }
}


