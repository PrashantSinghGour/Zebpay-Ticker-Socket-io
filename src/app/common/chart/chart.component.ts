import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  public paramSubscription: Subscription | undefined;
  public themeSubscription: Subscription | undefined;
  public pair: string = 'BTC-INR';
  public theme: 'dark' | 'light' = 'light';
  public link: string = `https://chart.zebpay.com/?group=singapore&type=1&symbol=${this.pair}&theme=${this.theme}&live=true`;
  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.setTheme();
    this.themeSubscription = this.eventService.subscribe(this.eventService.eventNames.THEMECHANGED, (payload) => {
      this.theme = payload.isDark ? 'dark' : 'light';
      this.setLink();
    });

    this.paramSubscription = this.activatedRoute.queryParams.subscribe((params: any) => {
      this.pair = params['pair'];
      this.setLink();
    });
  }

  setTheme() {
    const isDark: string = localStorage.getItem('isDark') || '';
    this.theme = (isDark ? JSON.parse(isDark) : false) ? 'dark' : 'light';
    this.setLink();
  }

  setLink() {
    this.link = `https://chart.zebpay.com/?group=singapore&type=1&symbol=${this.pair}&theme=${this.theme}&live=true`;
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

}
