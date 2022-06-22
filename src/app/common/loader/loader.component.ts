import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from './loader.service';

interface LoaderState {
  show: boolean;
  message: string;
}

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  show = false;
  message = '';
  private subscription: any;
  constructor(private loaderService: LoaderService) {
    this.subscription = null;
  }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState.subscribe(
      (state: LoaderState) => {
        this.show = state.show;
        this.message = state.message;
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
