import { Component, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CacheService } from 'ionic-cache';
import { CommonService } from './providers/common/common.service';
import { TokenService } from './providers/authentication/token.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {

  appPages = [
    {
      title: 'Admin',
      url: '/admin',
    },
    {
      title: 'Generator',
      url: '/generator',
    },
    {
      title: 'Ad Manager',
      url: '/ad-manager',
    },
    {
      title: 'Notification',
      url: '/notification',
    },
    {
      title: 'Settings',
      url: '/setting',
    }
  ];

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public cacheService: CacheService,
    public commonService: CommonService,
    public tokenService: TokenService) {
    this.initializeApp();
    this.setUpIonicCache();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private initializeApp() {
    this.tokenService.setUpToken();
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    });
  }

  private setUpIonicCache() {
    this.cacheService.setDefaultTTL(60 * 60 * 24);
    this.cacheService.setOfflineInvalidate(false);
  }
}
