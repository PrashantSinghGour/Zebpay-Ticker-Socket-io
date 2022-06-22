import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { MainService } from 'src/app/services/main.service';
import { logoMaps } from 'src/assets/logo-maps';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
  public subscription: Subscription | undefined;
  prices: any[] = [];
  constructor(
    private eventService: EventService,
    private mainService: MainService,
    private httpClient: HttpClient,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.fetchTradePairs();
    this.subscription = this.eventService.subscribe(
      this.eventService.eventNames.TICKERVALUEUPDATED,
      (res: any) => {
        const code = res.tickerRecord.split('/')[1].split('-')[0];
        const exist = this.prices.findIndex(
          (price: any) => price.code === code
        );
        if (exist > -1) {
          this.prices[exist] = {
            code,
            coinData: this.mainService.tradePairsWithCode[code],
            url: logoMaps[code],
            ...res.data,
          };
        } else {
          this.prices.push({
            code,
            coinData: this.mainService.tradePairsWithCode[code],
            url: logoMaps[code],
            ...res.data,
          });
        }

        this.prices = this.prices.sort((a, b) => b.topBuy - a.topBuy);
      }
    );
  }

  fetchTradePairs() {
    this.httpClient
      .get('https://www.zebapi.com/pro/v1/market')
      .toPromise()
      .then((res: any) => {
        this.prices =
          (res &&
            res.length &&
            res.map((item: any) => {
              item.code = item.pair; //MATIC-INR
              item.url = logoMaps[item.virtualCurrency];
              item.topBuy = item.buy;
              item.topSell = item.sell;
              item.high24hr = item['24hoursHigh'];
              item.low24hr = item['24hoursLow'];
              item.coinData =
                this.mainService.tradePairsWithCode[item.virtualCurrency];
              return item;
            })) ||
          [];
        if (this.prices.length) {
          this.prices = this.prices.filter(
            (item: any) => item.currency === 'INR' && item.topBuy
          );
          this.prices = this.prices.sort((a, b) => b.topBuy - a.topBuy);
          this.prices = this.prices.slice(0, 50);
          console.log(this.prices);
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
