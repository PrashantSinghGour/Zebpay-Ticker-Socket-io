import { Injectable } from '@angular/core';
import { filter, map, Subject, Subscription } from 'rxjs';

type Message = {
  type: string;
  payload: any;
}
type MessageCallback = (payload: any) => void;

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private handler = new Subject<Message>();
  public eventNames = {
    TICKERVALUELOADED: 'TICKERVALUELOADED',
    TICKERVALUEUPDATED: 'TICKERVALUEUPDATED'
  };

  constructor() {
  }

  broadcast(type: string, payload: any) {
    this.handler.next({ type, payload });
  }

  subscribe(type: string, callback: MessageCallback): Subscription {
    return this.handler.pipe(filter(message => message.type === type)
      , map(message => message.payload)).subscribe(callback);
  }
}
