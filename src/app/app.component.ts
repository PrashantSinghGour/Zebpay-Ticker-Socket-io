import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { EventService } from './services/event.service';
import { MainService } from './services/main.service';
import { ThemeService } from './services/theme.service';
import { keyBy } from 'lodash';
import { Feeds } from './utils/feeds';
import { logoMaps } from 'src/assets/logo-maps';
import { formatMarketPrice } from './utils/formatter';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isDark = false;
  constructor(
    private eventService: EventService,
    private httpClient: HttpClient,
    private mainService: MainService,
    private theme: ThemeService
  ) { }

  ngOnInit() {
    const isDark: string = localStorage.getItem('isDark') || '';
    const isDarkTheme = JSON.parse(isDark);
    this.isDark = isDarkTheme;
    this.theme.setTheme(isDarkTheme);
    this.getPairs();
  }

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
        tradePair = res?.data?.length ? res.data : [];
        tradePair = tradePair.map((tradePairs: any) => {
          tradePairs.url = logoMaps[tradePairs?.tradeVolumeCurrency];
          tradePairs.code = tradePairs?.tradeVolumeCurrency;
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

  changeThemeMode() {
    this.theme.setTheme(this.isDark);
  }
}
