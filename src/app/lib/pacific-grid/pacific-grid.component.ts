import { Component, ContentChild, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pacific-grid',
  templateUrl: './pacific-grid.component.html',
  styleUrls: ['./pacific-grid.component.css']
})
export class PacificGridComponent implements OnInit {

  @Input() gridConfig!: PacificGridConfig;
  @ContentChild('dataInStartHead', { static: true }) dataInStartHead: any;
  @ContentChild('dataInStartBody', { static: true }) dataInStartBody: any;
  columnType = ColumnType;
  constructor() { }

  ngOnInit(): void {
  }

}

export type PacificGridConfig = {
  columns: {
    name: string;
    label: string;
    class?: string;
    type?: string;
  }[];
  data: any[];
};

export enum ColumnType {
  Text = 'text',
  Currency = 'currency',
}
