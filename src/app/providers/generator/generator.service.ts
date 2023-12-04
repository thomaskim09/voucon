import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { environment } from '../environments/environment';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { retryWhen } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getTicketSummary(restaurantId, startDate, endDate) {
    const api = `${this.url}/v1/admins/summary_ticket?restaurantId=${restaurantId}&start_date=${startDate}&end_date=${endDate}`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getTicketSummary called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 0.5;

    const startDateString = startDate.slice(0, -14);
    const endDateString = endDate.slice(0, -14);
    const cacheString = 'Voucon_Ticket_Summary ' + restaurantId + startDateString + endDateString;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }

  getCompanyInfo(adminId) {
    const api = `${this.url}/v1/admins/company_info?adminId=${adminId}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info('New getCompanyInfo called');
      return res;
    }), retryWhen(this.rs.retryFunction()));

    return this.cacheService.loadFromObservable(`Voucon_Company_Info ${api}`, req, this.cacheKey);
  }

  getMassSettlement(startDate, endDate) {
    const api = `${this.url}/v1/super_admins/mass_settlement?start_date=${startDate}&end_date=${endDate}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info('New getMassSettlement called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    const startDateString = startDate.slice(0, -14);
    const endDateString = endDate.slice(0, -14);
    const cacheString = 'Voucon_Mass_Settlement ' + startDateString + endDateString;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey);
  }

  getAllAdminCompany() {
    const api = `${this.url}/v1/super_admins/admin_company`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getAllAdminCompany called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Admin_Company ' + api, req, this.cacheKey);
  }
}
