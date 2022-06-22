import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { EventService } from './services/event.service';
import { MainService } from './services/main.service';
import { ThemeService } from './services/theme.service';
import { keyBy } from 'lodash';
import { Feeds } from './utils/feeds';
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
    this.httpClient
      .get('https://www.zebapi.com/api/v1/tradepairs/IN')
      .toPromise()
      .then((res: any) => {
        this.mainService.tradePair = res?.data?.length
          ? (res?.data as any[]).slice(0, 50)
          : [];
        this.mainService.tradePairsWithCode = keyBy(
          this.mainService.tradePair,
          'tradeVolumeCurrency'
        );

        const feeds = new Feeds(this.eventService, this.mainService);
        feeds.getFeeds();
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
