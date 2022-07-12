import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './common/chart/chart.component';
import { PriceComponent } from './common/price/price.component';

const routes: Routes = [
  {
    path: 'home',
    component: PriceComponent
  },
  {
    path: 'chart',
    component: ChartComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
