import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { environment } from '../environments/environment';
import { NGXLogger } from 'ngx-logger';
import { retryWhen } from 'rxjs/operators';
import { RetryService } from '../common/retry.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';
  treatCacheKey: any = 'TreatCacheKey';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  pushNotifications(content) {
    const api = `${this.url}/v1/super_admins/push_notifications`;
    const req = this.http.post(api, { content: content }).pipe(map(res => {
      this.logger.info(`New pushNotifications called`);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getTreatList(pageSize, pageNum, refresher?) {
    const api = `${this.url}/v1/treats?page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info(`New getTreatList ${pageSize} ${pageNum} called`);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 24; // 24 hours

    if (refresher) {
      const delayType = 'all';
      this.cacheService.clearGroup(this.treatCacheKey);
      return this.cacheService.loadFromDelayedObservable('Voucon_Treat_List ' + api, req, this.treatCacheKey, ttl, delayType);
    }

    return this.cacheService.loadFromObservable('Voucon_Treat_List ' + api, req, this.treatCacheKey, ttl);
  }

  getTreatDetails(treatId) {
    const api = `${this.url}/v1/treats/details?treatId=${treatId}`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getTreatDetails called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Treat_Details ' + api, req, this.treatCacheKey);
  }

}
