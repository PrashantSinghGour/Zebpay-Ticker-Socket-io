import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc, collection, doc, DocumentData, DocumentReference, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { HapticService } from 'src/app/services/haptic.service';
import { MainService } from 'src/app/services/main.service';
import { initializeNotification } from 'src/app/services/service-worker';
import { coinNameFormat } from 'src/app/utils/formatter';
import { NotificationUpdate } from 'src/app/utils/notification';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit, OnDestroy {
  public priceUpdateSubscription: Subscription | undefined;
  public priceLoadedSubscription: Subscription | undefined;
  public screenWidth: number | undefined;
  public coinNameFormat = coinNameFormat
  prices: any[] = [];
  constructor(
    private eventService: EventService,
    private mainService: MainService,
    private haptic: HapticService,
    private loader: LoaderService,
    private router: Router
  ) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.loader.show();
    // all prices subscriptions
    if (this.mainService.tradePair.length) {
      this.prices = this.mainService.tradePair;
      this.sortPrices();
      this.loader.hide();
    } else {
      this.priceLoadedSubscription = this.eventService.subscribe(this.eventService.eventNames.TICKERVALUELOADED, () => {
        this.prices = this.mainService.tradePair;
        this.sortPrices();
        this.loader.hide();
      });
    }


    // const notification = NotificationUpdate.getInstance();

    // prices update subscriptions
    this.priceUpdateSubscription = this.eventService.subscribe(
      this.eventService.eventNames.TICKERVALUEUPDATED,
      (res: any) => {
        const code = res.tickerRecord.split('/')[1].split('-')[0];
        const exist = this.prices.findIndex(
          (price: any) => price.code === code
        );
        if (exist > -1) {
          this.prices[exist] = {
            ...this.prices[exist],
            code,
            prices: res.data,

          };
        } else {
          this.prices.push({
            code,
            isBookmarked: false,
            prices: res.data,
          });
        }
        // notification.checkPeaks(this.prices[exist]);
        this.sortPrices();
      }
    );
  }

  toggleNotification(index: number) {
    if (Notification.permission !== 'granted') {
      initializeNotification();
    }
    this.haptic.vibrate(50);
    let notifications: string[] = [];
    this.prices[index].isNotification = !this.prices[index].isNotification;
    this.prices.forEach((price: any) => {
      if (price.isNotification) {
        notifications.push(price.code);
      }
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    this.addNotificationToServer()
  }

  ngOnDestroy(): void {
    const _that: any = this;
    ['priceLoadedSubscription'].forEach((subscription: string) => {
      if (_that[subscription]) {
        (_that[subscription] as Subscription).unsubscribe();
      }
    });
  }

  setBookmark(index: number) {
    this.haptic.vibrate(50);
    let bookmarks: string[] = [];
    this.prices[index].isBookmarked = !this.prices[index].isBookmarked;
    this.prices.forEach((price: any) => {
      if (price.isBookmarked) {
        bookmarks.push(price.code);
      }
    });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    this.sortPrices();
  }

  sortPrices() {
    this.prices = this.prices.sort((a, b) => b?.prices?.topBuy - a?.prices?.topBuy);
    this.prices = this.prices.sort((a, b) => b?.isBookmarked - a?.isBookmarked);
  }

  checkGraph(coinData: any) {
    this.haptic.vibrate(50);
    this.router.navigate(['/chart'], { queryParams: { pair: coinData.tradePairName } })
  }

  addNotificationToServer() {
    const notification = JSON.parse(localStorage.getItem('notifications') || '[]');
    const app = this.mainService.firebaseInstance;
    const fireStore = getFirestore(app);
    const uniqueId = localStorage.getItem('uId');
    const collectionName = 'Notification';

    getDocs(collection(fireStore, collectionName))
      .then((response) => {
        const data = [...response.docs.map((item) => {
          return { ...item.data(), id: item.id }
        })];
        const device: any = data.find((devices: any) => devices.deviceId === uniqueId);
        let promise: Promise<void> | Promise<DocumentReference<DocumentData>>;
        if (device && Object.keys(device).length) {
          const dataToUpdate = doc(fireStore, collectionName, device.id);
          promise = updateDoc(dataToUpdate, {
            deviceId: uniqueId,
            notifyTo: notification
          })
        } else {
          promise = addDoc(collection(fireStore, collectionName), {
            deviceId: uniqueId,
            notifyTo: notification
          });
        }

        promise.then(() => console.log('Data Sent!')).catch((err) => console.error(err));

      }).catch((err: any) => {
        console.error(err);
      });

  }
}
