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
    this.getPairs();
    this.theme.setTheme();
  }

  getPairs() {
    let marketPricePairs: any = {}
    this.httpClient
      .get('https://www.zebapi.com/pro/v1/market')
      .toPromise().then((res: any) => {
        res = res && res.length && res.filter((price: any) => price?.currency === 'INR' && +price?.buy);
        marketPricePairs = keyBy(res, 'virtualCurrency');
        console.log("🚀 ~ file: app.component.ts ~ line 32 ~ AppComponent ~ .toPromise ~ res", res)
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
        console.log("🚀 ~ file: app.component.ts ~ line 43 ~ AppComponent ~ .toPromise ~ tradePair", tradePair)


        this.mainService.tradePairsWithCode = keyBy(
          this.mainService.tradePair,
          'tradeVolumeCurrency'
        );

        const feeds = new Feeds(this.eventService, this.mainService);
        feeds.getFeeds();
        this.mainService.tradePair = tradePair;
        this.eventService.broadcast(
          this.eventService.eventNames.TICKERVALUELOADED,
          {}
        );
        console.log(
          'tradePairsWithCode - ',
          this.mainService.tradePairsWithCode
        );
      });
  }

  changeThemeMode() {
    this.theme.setTheme(this.isDark);
  }
}
