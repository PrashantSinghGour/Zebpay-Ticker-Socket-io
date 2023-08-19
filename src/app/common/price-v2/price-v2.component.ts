import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnType, PacificGridConfig } from 'src/app/lib/pacific-grid/pacific-grid.component';
import { LoaderService } from '../loader/loader.service';
import { MainService } from 'src/app/services/main.service';
import { EventService } from 'src/app/services/event.service';
import { Subscription } from 'rxjs';
import { coinNameFormat } from 'src/app/utils/formatter';
import { HapticService } from 'src/app/services/haptic.service';

@Component({
  selector: 'app-price-v2',
  templateUrl: './price-v2.component.html',
  styleUrls: ['./price-v2.component.css']
})
export class PriceV2Component implements OnInit, OnDestroy {
  public prices: any[] = [];
  public priceLoadedSubscription!: Subscription;
  public isGridVisible = false;
  public gridConfig: PacificGridConfig = {
    columns: [
      // {
      //   label: 'Name',
      //   name: 'name',
      //   type: ColumnType.Text,
      // },
      {
        label: 'High',
        name: 'high24hr',
        type: ColumnType.Currency,
      },
      {
        label: 'Low',
        name: 'low24hr',
        type: ColumnType.Currency,
      },
      {
        label: 'Buy',
        name: 'topBuy',
        class: 'text-green cursor-pointer',
        type: ColumnType.Currency,
      },
      {
        label: 'Sell',
        name: 'topSell',
        class: 'text-red',
        type: ColumnType.Currency,
      },
      {
        label: 'Change',
        name: 'change',
        class: '',
        type: ColumnType.Currency,
      }
    ],
    data: [
      {
        name: 'Matic',
        high: '23',
        low: '15',
        buy: '33',
        sell: '2',
        change: '34'
      },
      {
        name: 'SRS',
        high: '23',
        low: '15',
        buy: '33',
        sell: '2',
        change: '34'
      }
    ]
  };
  constructor(
    private loader: LoaderService,
    private mainService: MainService,
    private eventService: EventService,
    private haptic: HapticService,
  ) { }

  ngOnInit(): void {
    // all prices subscriptions
    if (this.mainService.tradePair.length) {
      this.prices = this.mainService.tradePair;
      this.initializePrices();

    } else {
      this.priceLoadedSubscription = this.eventService.subscribe(this.eventService.eventNames.TICKERVALUELOADED, () => {
        this.prices = this.mainService.tradePair;
        this.initializePrices();
      });
    }
  }

  initializePrices() {
    this.spreadPrices();
    this.loadGrid();
  }

  spreadPrices() {
    this.prices = this.prices.map((price: any) => {
      return {
        ...price,
        ...price.prices,
        name: coinNameFormat(price),
        change: (price.prices?.high24hr - price?.prices?.low24hr)
      }
    });
    this.gridConfig.data = this.prices;
    console.log("🚀 ~ file: price-v2.component.ts:97 ~ PriceV2Component ~ this.prices=this.prices.map ~ this.prices:", this.prices)
  }

  loadGrid() {
    this.isGridVisible = true;
    this.sortPrices();
    this.loader.hide();
  }

  setBookmark(index: number) {
    console.log("🚀 ~ file: price-v2.component.ts:119 ~ PriceV2Component ~ setBookmark ~ index:", index)
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
    this.prices = this.prices.sort((a, b) => b?.topBuy - a?.topBuy);
    this.prices = this.prices.sort((a, b) => b?.isBookmarked - a?.isBookmarked);
  }

  ngOnDestroy(): void {
    this.priceLoadedSubscription?.unsubscribe();
  }

}
