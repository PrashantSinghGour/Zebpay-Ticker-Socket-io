import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { HapticService } from 'src/app/services/haptic.service';
import { MainService } from 'src/app/services/main.service';
import { logoMaps } from 'src/assets/logo-maps';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit, OnDestroy {
  public priceUpdateSubscription: Subscription | undefined;
  public priceLoadedSubscription: Subscription | undefined;
  prices: any[] = [];
  constructor(
    private eventService: EventService,
    private mainService: MainService,
    private httpClient: HttpClient,
    private loader: LoaderService,
    private haptic: HapticService
  ) { }

  ngOnInit() {

    // all prices subscriptions
    this.priceLoadedSubscription = this.eventService.subscribe(this.eventService.eventNames.TICKERVALUELOADED, () => {
      this.prices = this.mainService.tradePair;
      this.sortPrices();
    });

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
            code,
            url: logoMaps[code],
            prices: res.data,
          };
        } else {
          this.prices.push({
            code,
            isBookmarked: false,
            url: logoMaps[code],
            prices: res.data,
          });
        }

        this.sortPrices();
      }
    );
  }

  ngOnDestroy(): void {
    const _that: any = this;
    ['priceLoadedSubscription', 'priceUpdateSubscription'].forEach((subscription: string) => {
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
}
