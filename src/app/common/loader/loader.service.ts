import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface LoaderState {
  show: boolean;
  message: string;
};


@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();
  constructor() { }
  show(text?: string) {
    this.loaderSubject.next(<LoaderState>{ show: true, message: text });
  }
  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false, message: '' });
  }
}
