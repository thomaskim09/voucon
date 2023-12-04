import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { CacheModule } from 'ionic-cache';
import { IonicSelectableModule } from 'ionic-selectable';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { JwtHelper } from 'angular2-jwt';
import { environment } from './providers/environments/environment';

const logConfig = {
  serverLoggingUrl: `${environment.url}/v1/logs`,
  level: NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.ERROR
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    CacheModule.forRoot({ keyPrefix: 'Con ' }),
    IonicSelectableModule,
    LoggerModule.forRoot(logConfig)
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileOpener,
    JwtHelper,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
