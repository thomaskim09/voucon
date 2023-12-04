import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'ionic-cache';
import { map } from 'rxjs/operators/map';
import { environment } from '../environments/environment';
import { retryWhen } from 'rxjs/operators';
import { RetryService } from '../common/retry.service';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class AdManagerService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';
  adsCacheKey: any = 'AdsCache';
  allVouListCacheKey: any = 'AllVoucherListCache';
  adminListCacheKey: any = 'AdminListCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public rs: RetryService,
    public logger: NGXLogger) { }

  getAds(adsId) {
    const api = `${this.url}/v1/ads?adsId=${adsId}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info(`New getAds is called`);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Ads ' + api, req, this.adsCacheKey);
  }

  updateAds(adsId, object) {
    const api = `${this.url}/v1/ads?adsId=${adsId}`;
    const req = this.http.put(api, object).pipe(map(data => {
      this.logger.info('New updateAds is called');
      this.cacheService.clearGroup(this.adsCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getCommonTags() {
    const api = `${this.url}/v1/tags/common-tags`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getCommonTags is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Common_Type ' + api, req, this.cacheKey);
  }

  getAllAreasPlaces() {
    const api = `${this.url}/v1/super_admins/all_areas_places`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getAllAreasPlaces is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_All_Areas_Places ' + api, req, this.cacheKey);
  }

  getAllVoucherList() {
    const api = `${this.url}/v1/super_admins/all_voucher_list`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getAllVoucherList is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_All_Voucher_List ' + api, req, this.allVouListCacheKey);
  }

  updateRating(object) {
    const api = `${this.url}/v1/super_admins/rating`;
    const req = this.http.put(api, object).pipe(map(data => {
      this.logger.info('New updateRating is called');
      this.cacheService.clearGroup(this.adminListCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  recalculateRating(object) {
    const api = `${this.url}/v1/super_admins/rating`;
    const req = this.http.post(api, object).pipe(map(data => {
      this.logger.info('New recalculateRating is called');
      this.cacheService.clearGroup(this.adminListCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }
}
