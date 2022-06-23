import { EventService } from "../services/event.service";
import { MainService } from "../services/main.service";


declare var require: any;
const deepstream = require('deepstream.io-client-js');

export class Feeds {
  constructor(
    private eventService: EventService,
    private mainService: MainService
  ) { }

  getFeeds = () => {
    const client = deepstream('wss://data.zebapi.com', {
      silentDeprecation: true,
    }).login({
      username: 'zebpay',
      password: 'zebpay',
    });

    client.on('error', (error: any, event: any, topic: any) => {
      console.log('error', error, event, topic);
    });

    client.on('connectionStateChanged', (connectionState: any) => {
      //https://deepstream.io/tutorials/concepts/connectivity/#connection-states
      //temp
      // console.log('connectionState', connectionState);
      // will be called with 'CLOSED' once the connection is successfully closed.
    });

    //Refer deepStreamOrderHistoryUrl of API https://www.zebapi.com/api/v1/tradepairs/IN
    const transactionHistoryEventSubscription = [
      'BTC-INR-txHistory_singapore',
      'MATIC-INR-txHistory_singapore',
    ];

    //Refer deepStreamOrderBookUrl of API https://www.zebapi.com/api/v1/tradepairs/IN
    const bookRecordSubscription = [
      'book_singapore/MATIC-INR',
      'book_singapore/BCH-INR',
    ];

    //Refer deepStreamTickerUrl of API https://www.zebapi.com/api/v1/tradepairs/IN
    // const tickerRecordSubscription = [
    //   'ticker_singapore/SHIB-INR',
    //   'ticker_singapore/BTC-INR',
    //   'ticker_singapore/MATIC-INR',
    // ];

    const tickerRecordSubscription = this.mainService.tradePair.map(
      (pair: any) => pair.deepStreamTickerUrl
    );
    tickerRecordSubscription.forEach((tickerRecord) => {
      client.record.getRecord(tickerRecord).whenReady((record: { subscribe: (arg0: (data: any) => void) => void; }) => {
        record.subscribe((data: any) => {
          const obj = { tickerRecord, data };
          this.eventService.broadcast(
            this.eventService.eventNames.TICKERVALUEUPDATED,
            obj
          );
        });
      });
    });

    // transactionHistoryEventSubscription.forEach(transactionHistoryEvent => {
    //     client.event.subscribe(transactionHistoryEvent, data => {
    //         console.log('transaction ', transactionHistoryEvent, data);
    //     });
    // })

    // bookRecordSubscription.forEach(bookRecord => {
    //     client.record.getRecord(bookRecord).whenReady(record => {
    //         record.subscribe(data => {
    //             console.log('book ', bookRecord, data);
    //         })
    //     });
    // });
  };
}
