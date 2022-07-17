import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PriceComponent } from './common/price/price.component';
import { LoaderComponent } from './common/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ChartComponent } from './common/chart/chart.component';
import { SafePipe } from './pipes/safe.pipe';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
@NgModule({
  declarations: [
    AppComponent,
    PriceComponent,
    LoaderComponent,
    ChartComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    GuidedTourModule
  ],
  providers: [GuidedTourService],
  bootstrap: [AppComponent]
})
export class AppModule { }
