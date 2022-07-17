import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from './services/event.service';
import { MainService } from './services/main.service';
import { ThemeService } from './services/theme.service';
import { keyBy } from 'lodash';
import { Feeds } from './utils/feeds';
import { logoMaps } from 'src/assets/logo-maps';
import { formatMarketPrice } from './utils/formatter';
import { initializeFirebase } from './utils/firebase';
import { initializeNotification } from './services/service-worker';
import { NavigationEnd, Router } from '@angular/router';
import { get } from 'lodash';
import { HapticService } from './services/haptic.service';
import { fromEvent, Subscription } from 'rxjs';
import { GuidedTour, GuidedTourService, Orientation } from 'ngx-guided-tour';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public isDark = false;
  public isBackAllowed = false;
  public subscriptions: Subscription[] = [];
  public applicationTour: GuidedTour = {
    tourId: 'app-tour',
    useOrb: false,
    steps: [
      {
        title: 'Welcome to Zebpay Ticker',
        content: 'This is the Zebpay application based price ticker for cryptocurrencies'
      },
      {
        title: 'Theme',
        content: 'You can switch the themes between Light Or Night mode.',
        orientation: Orientation.Left,
        selector: '.theme-selector'

      },
      {
        title: 'Bookmark',
        selector: '.bookmark-element',
        content: 'You can bookmark your favorite coins.',
        orientation: Orientation.Right
      },
      {
        title: 'Notification',
        selector: '.coin-logo',
        content: 'You can subscribe to notifications by clicking here for Upper and Lower thresholds, But for that you have to allow notification when asked by browser/app.',
        orientation: Orientation.Right
      },
      {
        title: 'View Price Chart',
        selector: '.buy-price-element',
        content: 'By clicking here you can check the price chart for specific coin.',
        orientation: Orientation.Bottom
      }
    ]
  };

  constructor(
    private eventService: EventService,
    private httpClient: HttpClient,
    private mainService: MainService,
    private theme: ThemeService,
    private haptic: HapticService,
    public router: Router,
    private guidedTourService: GuidedTourService
  ) {
    router.events.subscribe((res) => {
      if (res instanceof NavigationEnd) {
        this.isBackAllowed = get(res, 'urlAfterRedirects', '').includes('chart');
      }
    });
  }

  ngOnInit() {

    // To mark tour as completed
    this.subscriptions.push(this.guidedTourService.guidedTourCurrentStepStream.subscribe((data) => {
      !data && localStorage.setItem('tour', 'completed');
    }));

    this.checkNetworkActivity();

    initializeNotification();

    initializeFirebase();

    const isDark: string = localStorage.getItem('isDark') || '';
    const isDarkTheme = isDark ? JSON.parse(isDark) : false;
    this.isDark = isDarkTheme;
    this.theme.setTheme(isDarkTheme);

    this.getPairs();

    // To initiate a tour if it is not completed earlier
    const isTourDone = localStorage.getItem('tour');
    if (!isTourDone) {
      this.initializeTour();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * @desc To check if app is connected to network or not i.e, `Online` or `Offline` 
   */
  checkNetworkActivity() {
    const onlineEvent = fromEvent(window, 'online');
    const offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(onlineEvent.subscribe(e => {
      // handle online mode
      this.getPairs();
    }));

    this.subscriptions.push(offlineEvent.subscribe(e => {
      // handle offline mode
    }));
  }


  /**
   * @desc Provides the basic tour of app
   */
  initializeTour() {
    setTimeout(() => {
      this.guidedTourService.startTour(this.applicationTour);
      setTimeout(() => {
        const nextButtonEle = document.getElementsByClassName('next-button')[0];
        const skipButtonEle = document.getElementsByClassName('skip-button')[0];
        nextButtonEle.addEventListener('click', () => {
          this.haptic.vibrate(50);
          const backButtonEle = document.getElementsByClassName('back-button')[0];
          backButtonEle.addEventListener('click', () => {
            this.haptic.vibrate(50);
          })
        })
        skipButtonEle.addEventListener('click', () => {
          this.haptic.vibrate(50);
        });
      })
    }, 1000);
  }

  /**
   * @desc Fetch the data first time and register socket feeds
   */
  getPairs() {
    let marketPricePairs: any = {}
    this.httpClient
      .get('https://www.zebapi.com/pro/v1/market')
      .toPromise().then((res: any) => {
        res = res && res.length && res.filter((price: any) => price?.currency === 'INR' && +price?.buy);
        marketPricePairs = keyBy(res, 'virtualCurrency');
        return this.httpClient
          .get('https://www.zebapi.com/api/v1/tradepairs/IN')
          .toPromise();
      }).then((res: any) => {
        let tradePair: any[] = [];
        let bookmarks: string[] = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        let notifications: string[] = JSON.parse(localStorage.getItem('notifications') || '[]');
        tradePair = res?.data?.length ? res.data : [];
        tradePair = tradePair.map((tradePairs: any) => {
          tradePairs.url = logoMaps[tradePairs?.tradeVolumeCurrency];
          tradePairs.code = tradePairs?.tradeVolumeCurrency;
          tradePairs.isNotification = notifications.includes(tradePairs?.tradeVolumeCurrency) || false;
          tradePairs.isBookmarked = bookmarks.includes(tradePairs?.tradeVolumeCurrency) || false;
          tradePairs.prices = formatMarketPrice(marketPricePairs[tradePairs?.tradeVolumeCurrency])
          return tradePairs;
        });

        tradePair = tradePair.filter((pair: any) => pair?.prices && pair?.tradeDenominationCurrency === 'INR');


        this.mainService.tradePairsWithCode = keyBy(
          this.mainService.tradePair,
          'tradeVolumeCurrency'
        );

        this.mainService.tradePair = tradePair;
        const feeds = new Feeds(this.eventService, this.mainService);
        feeds.getFeeds();
        this.eventService.broadcast(
          this.eventService.eventNames.TICKERVALUELOADED,
          {}
        );
      });
  }

  backToHome() {
    this.haptic.vibrate(50);
    this.router.navigate(['home']);
  }

  changeThemeMode() {
    this.theme.setTheme(this.isDark);
  }
}
