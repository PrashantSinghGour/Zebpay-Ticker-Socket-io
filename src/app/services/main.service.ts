import { Injectable } from '@angular/core';
import { Dictionary } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public tradePair: any[] = [];
  public tradePairsWithCode: Dictionary<any> = [];
  public firebaseInstance: any;
  public deviceRegId: string = '';
  constructor() { }

}
