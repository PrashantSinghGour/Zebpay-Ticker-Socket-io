import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './common/chart/chart.component';
import { PriceComponent } from './common/price/price.component';
import { PriceV2Component } from './common/price-v2/price-v2.component';

const routes: Routes = [
  {
    path: 'home',
    component: PriceComponent
  },
  {
    path: 'home-v2',
    component: PriceV2Component
  },
  {
    path: 'chart',
    component: ChartComponent
  },
  {
    path: '',
    redirectTo: '/home-v2',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
