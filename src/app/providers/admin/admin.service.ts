import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'ionic-cache';
import { map } from 'rxjs/operators/map';
import { environment } from '../environments/environment';
import { NGXLogger } from 'ngx-logger';
import { retryWhen } from 'rxjs/operators';
import { RetryService } from '../common/retry.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url: string = environment.url;
  cacheKey: string = 'IonicCache';
  userListCacheKey: string = 'UserListCache';
  adminListCacheKey: string = 'AdminListCache';
  adminDetailsCacheKey: string = 'AdminDetailsCache';
  vouListCacheKey: string = 'VouListCache';
  resTypeCacheKey: string = 'ResTypeCache';
  foodTypeCacheKey: string = 'FoodTypeCache';
  addressCacheKey: string = 'AddressCache';
  feedbackCacheKey: string = 'FeedbackCache';
  versionCacheKey: string = 'VersionCache';
  ticketListCacheKey: string = 'TicketListCache';
  voucherDeCacheKey: string = 'VoucherDetailsCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getAdminList() {
    const api = `${this.url}/v1/super_admins/admins/list`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getAdminList called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Admin_List ' + api, req, this.adminListCacheKey);
  }

  getAdminDetails(adminId) {
    const api = `${this.url}/v1/super_admins/admins/details?adminId=${adminId}`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getAdminDetails called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Admin_Details ' + api, req, this.adminDetailsCacheKey + adminId);
  }

  updateAdminDetails(content) {
    const api = `${this.url}/v1/super_admins/admins/details`;
    const req = this.http.put(api, content).pipe(map(res => {
      this.logger.info('New updateAdminDetails called');
      this.cacheService.clearGroup(this.adminDetailsCacheKey + content.adminId);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  signUpAdmin(content) {
    const api = `${this.url}/v1/super_admins/admins/sign_up`;
    const req = this.http.post(api, content).pipe(map(res => {
      this.logger.info('New adminSignUp called');
      this.cacheService.clearGroup(this.adminListCacheKey);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  signUpFutureAdmin(content) {
    const api = `${this.url}/v1/super_admins/admins/sign_up_future`;
    const req = this.http.post(api, content).pipe(map(res => {
      this.logger.info('New signUpFutureAdmin called');
      this.cacheService.clearGroup(this.adminListCacheKey);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getAdminBranch(adminId) {
    const api = `${this.url}/v1/super_admins/admins/branch?adminId=${adminId}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info('New getAdminBranch called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  createBranch(content) {
    const api = `${this.url}/v1/super_admins/admins/create_branch`;
    const req = this.http.post(api, content).pipe(map(res => {
      this.logger.info('New createBranch called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  unlinkBranch(content) {
    const api = `${this.url}/v1/super_admins/admins/unlink_branch`;
    const req = this.http.post(api, content).pipe(map(res => {
      this.logger.info('New unlinkBranch called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  linkMenu(restaurantId, restaurantList) {
    const api = `${this.url}/v1/menus/link?restaurantId=${restaurantId}`;
    const req = this.http.put(api, {
      restaurantList: restaurantList
    }).pipe(map(res => {
      this.logger.info('New linkMenu called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  unlinkMenu(restaurantId) {
    const api = `${this.url}/v1/menus/unlink?restaurantId=${restaurantId}`;
    const req = this.http.put(api, {}).pipe(map(res => {
      this.logger.info('New unlinkMenu called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getVoucherList(restaurantId, statusType) {
    const api = `${this.url}/v1/super_admins/vouchers/list?restaurantId=${restaurantId}&statusType=${statusType}`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info(`New getVoucherList ${statusType} called`);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Voucher_List ' + api, req, this.vouListCacheKey + restaurantId);
  }

  getTicketsList(userId, pageSize, pageNum) {
    const api = `${this.url}/v1/super_admins/tickets/list?userId=${userId}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info(`New getTicketsList ${userId} ${pageSize} ${pageNum} called`);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Tickets_List ' + api, req, this.ticketListCacheKey);
  }

  updateResVouStatus(type, id, status, restaurantId?) {
    const api = `${this.url}/v1/super_admins/restaurants/status?type=${type}&id=${id}`;
    const req = this.http.put(api, { status: status }).pipe(map(res => {
      this.logger.info('New updateResVouStatus called');
      if (type === 'restaurant') {
        this.cacheService.clearGroup(this.adminListCacheKey);
      } else {
        this.cacheService.clearGroup(this.vouListCacheKey + restaurantId);
      }
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getAllType() {
    const api = `${this.url}/v1/tags/all`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getAllTags is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_All_Type ' + api, req, this.resTypeCacheKey);
  }

  getFoodType() {
    const api = `${this.url}/v1/tags/food-types`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getFoodType is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Food_Type ' + api, req, this.foodTypeCacheKey);
  }

  addType(tagId, content) {
    const api = `${this.url}/v1/super_admins/tags/add?tagId=${tagId}`;
    const req = this.http.put(api, content).pipe(map(data => {
      this.logger.info('New addType is called');
      this.typeClearGroup(content);
      return data;
    }));
    return req;
  }

  renameType(tagId, content) {
    const api = `${this.url}/v1/super_admins/tags/rename?tagId=${tagId}`;
    const req = this.http.put(api, content).pipe(map(data => {
      this.logger.info('New renameType is called');
      this.typeClearGroup(content);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  deleteType(tagId, content) {
    const api = `${this.url}/v1/super_admins/tags/delete?tagId=${tagId}`;
    const req = this.http.put(api, content).pipe(map(data => {
      this.logger.info('New deleteType is called');
      this.typeClearGroup(content);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  private typeClearGroup(content) {
    if (content.type === 'resType') {
      this.cacheService.clearGroup(this.resTypeCacheKey);
    } else {
      this.cacheService.clearGroup(this.foodTypeCacheKey);
    }
  }

  getAllAddress() {
    const api = `${this.url}/v1/tags/address`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getAddress is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Addresses ' + api, req, this.addressCacheKey);
  }

  addAddress(content) {
    const api = `${this.url}/v1/super_admins/address/add`;
    const req = this.http.put(api, content).pipe(map(data => {
      this.logger.info('New addAddress is called');
      this.cacheService.clearGroup(this.addressCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  renameAddress(content) {
    const api = `${this.url}/v1/super_admins/address/rename`;
    const req = this.http.put(api, content).pipe(map(data => {
      this.logger.info('New renameAddress is called');
      this.cacheService.clearGroup(this.addressCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  deleteAddress(content) {
    const api = `${this.url}/v1/super_admins/address/delete`;
    const req = this.http.put(api, content).pipe(map(data => {
      this.logger.info('New deleteAddress is called');
      this.cacheService.clearGroup(this.addressCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getUserList() {
    const api = `${this.url}/v1/super_admins/users/list`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getUserList called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_User_List ' + api, req, this.userListCacheKey);
  }

  updateUserStatus(object) {
    const api = `${this.url}/v1/super_admins/users/status`;
    const req = this.http.put(api, object).pipe(map(res => {
      this.logger.info('New updateUserStatus called');
      this.cacheService.clearGroup(this.userListCacheKey);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getSearchCollection(collectionType, type, objectId?, query?, fields?) {
    const api = `${this.url}/v1/super_admins/search?collectionType=${collectionType}&type=${type}`;
    const req = this.http.put(api, {
      objectId: objectId,
      query: query,
      fields: fields
    }).pipe(map(res => {
      this.logger.info(`New getSearchCollection ${collectionType} ${query} called`);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    const cacheString = `Voucon_Search_Collection ${collectionType} ${type} ${objectId} ${query}`;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey);
  }

  getFeedbackList(restaurantId) {
    const api = `${this.url}/v1/super_admins/feedback_list?restaurantId=${restaurantId}`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getFeedbackList called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_Feedback_List ' + api, req, this.feedbackCacheKey + restaurantId);
  }

  updateFeedbackStatus(restaurantId, feedbackId, status) {
    const api = `${this.url}/v1/super_admins/feedback_list?feedbackId=${feedbackId}`;
    const req = this.http.put(api, { status: status }).pipe(map(res => {
      this.logger.info('New updateFeedbackStatus called');
      this.cacheService.clearGroup(this.feedbackCacheKey + restaurantId);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getAppList() {
    const api = `${this.url}/v1/versions`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getAppList called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Voucon_App_List ' + api, req, this.versionCacheKey);
  }

  createAppVersion(appName, version) {
    const api = `${this.url}/v1/versions`;
    const req = this.http.post(api, { appName: appName, version: version }).pipe(map(res => {
      this.logger.info('New createAppVersion called');
      this.cacheService.clearGroup(this.versionCacheKey);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateAppVersion(appId, version) {
    const api = `${this.url}/v1/versions?appId=${appId}`;
    const req = this.http.put(api, { version: version }).pipe(map(res => {
      this.logger.info('New updateAppVersion called');
      this.cacheService.clearGroup(this.versionCacheKey);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getVoucherDetails(voucherId, userId?, refresher?) {
    const api = `${this.url}/v1/vouchers/users?voucherId=${voucherId}&userId=${userId}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info(`New getVoucherDetails ${voucherId} called`);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 24; // 1 day
    const cacheString = `Vouchy_Voucher_Details ${voucherId}`;
    const cacheKey = `${this.voucherDeCacheKey} ${voucherId}`;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, cacheKey, ttl);
  }

  checkVoucherAvailability(voucherId, userId, quantity) {
    const api = `${this.url}/v1/vouchers/users?voucherId=${voucherId}&userId=${userId}`;
    const req = this.http.post<any>(api, { quantity: quantity }).pipe(map(res => {
      this.logger.info('checkVoucherAvailability called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  createNewTicketVoucher(ticket, type) {
    const api = `${this.url}/v1/tickets/vouchers?type=${type}`;
    const req = this.http.post(api, ticket).pipe(map(res => {
      this.logger.info('New createNewTicketVoucher called');
      this.cacheService.clearGroup(`${this.voucherDeCacheKey} ${ticket.voucherId}`)
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

}
