import { Component, OnInit } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/providers/common/common.service';

@Component({
  selector: 'app-cache',
  templateUrl: './cache.component.html',
  styleUrls: ['./cache.component.scss'],
})
export class CacheComponent implements OnInit {

  itemList: any = [
    { value: 'all', name: 'All Cache' },
    { value: 'IonicCache', name: 'Common Cache' },
    { value: 'AdminListCache', name: 'Admin List Cache' },
    { value: 'VouListCache', name: 'Restaurant Specific Voucher List Cache' },
    { value: 'AllVoucherListCache', name: 'All Voucher List Cache' },
    { value: 'TrendingCachetags', name: 'Trending Cache + tags' },
    { value: 'TrendingCacherestaurants', name: 'Trending Cache + restaurants' },
    { value: 'TrendingCachevouchers', name: 'Trending Cache + vouchers' },
    { value: 'ResTypeCache', name: 'Restaurant Type List Cache' },
    { value: 'FoodTypeCache', name: 'Food Type List Cache' },
    { value: 'AddressCache', name: 'All Address Cache' },
    { value: 'FeedbackCache', name: 'Feedback Cache' },
    { value: 'VersionCache', name: 'App List' },
    { value: 'TicketListCache', name: 'Ticket List' },
    { value: 'TreatCacheKey', name: 'Treat List' },
  ];

  // Form
  form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public cacheService: CacheService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      cacheKey: ['', Validators.required],
    });
  }

  async clearCache() {
    if (await this.commonService.presentAlert()) {
      const value = this.form.value;
      this.reset();
      if (value.cacheKey === 'all') {
        this.cacheService.clearAll();
        this.commonService.presentToast('All Cache Cleared');
      } else {
        this.cacheService.clearGroup(value.cacheKey);
        this.commonService.presentToast(`Cache Key ${value.cacheKey} Cleared`);
      }
    }
  }

  private reset() {
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }
}
