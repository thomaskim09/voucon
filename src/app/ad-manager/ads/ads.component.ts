import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdManagerService } from 'src/app/providers/ad-manager/ad-manager.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { environment } from '../../providers/environments/environment';

class Port {
  id: string;
  name: string;
}

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent implements OnInit, OnDestroy {

  // form
  form: FormGroup;

  // Searchable select
  resPorts: Port[];
  vouPorts: Port[];
  typePorts: Port[];
  foodPorts: Port[];
  areaPorts: Port[];
  placePorts: Port[];

  // JS properties
  adsId: string;

  // HTML properties
  wholeList: any;
  displayList: any = [];

  // HTML controller
  needResPorts: boolean = true;
  needVouPorts: boolean = true;
  needTypePorts: boolean = true;
  needFoodPorts: boolean = true;
  needAreaPorts: boolean = true;
  needPlacePorts: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public adManagerService: AdManagerService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.adsId = environment.isProd ? '5dc51e7d8099ff482c5b7cf2' : '5cfdbef3fc010a49e8bfe49e';
    this.setUpAllList();
    this.form = this.setUpFormControl();
    this.onChanges();
    this.getExistingAds();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      type: ['', Validators.required],
      restaurants: [''],
      vouchers: [''],
      restaurantTypes: [''],
      foodTypes: [''],
      areas: [''],
      places: ['']
    });
  }

  private onChanges() {
    this.form.get('type').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      switch (val) {
        case 'tags': this.toggle(true, true, true, true, true, true); break;
        case 'restaurants': this.toggle(true, false, false, false, false, false); break;
        case 'vouchers': this.toggle(false, true, false, false, false, false); break;
      }
      if (this.wholeList[val]) {
        this.displayList = this.wholeList[val].map(val2 => `${val2.id} (${val2.name})`);
      }
    });
  }

  private getExistingAds() {
    this.adManagerService.getAds(this.adsId).pipe(untilDestroyed(this)).subscribe(val => {
      this.wholeList = val[0];
    });
  }

  private setUpAllList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.resPorts = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName,
      }));
    });
    this.adManagerService.getAllVoucherList().pipe(untilDestroyed(this)).subscribe(val => {
      this.vouPorts = val.map(val2 => ({
        id: val2._id,
        name: val2.details.voucherName,
      }));
    });
    this.adManagerService.getCommonTags().pipe(untilDestroyed(this)).subscribe(val => {
      this.typePorts = val[0].details.restaurantTypes.map(val2 => ({
        id: val2._id,
        name: val2.name
      }));
      this.foodPorts = val[0].details.foodTypes.map(val2 => ({
        id: val2._id,
        name: val2.name
      }));
    });
    const areaList = [];
    const placeList = [];
    this.adManagerService.getAllAreasPlaces().pipe(untilDestroyed(this)).subscribe(val => {
      val[0].cities.map(val2 => {
        val2.postcodes.map(val3 => {
          val3.areas.map(val4 => {
            areaList.push({
              id: val4._id,
              name: val4.area
            });
            val4.places.map(val5 => {
              placeList.push({
                id: val5._id,
                name: val5.place
              });
            });
          });
        });
      });
    });
    this.areaPorts = areaList;
    this.placePorts = placeList;
  }

  async updateAds() {
    if (!this.adsId) {
      this.commonService.presentToast('Need ads Id first');
      return;
    }
    if (await this.commonService.presentAlert()) {
      const type = this.form.value.type;
      const object = {
        type: type,
        content: this.collectAllSelected()
      };
      this.adManagerService.updateAds(this.adsId, object).pipe(untilDestroyed(this)).subscribe(val => {
        this.reset(object);
        this.commonService.presentToast('Updated Ads ' + type);
      });
    }
  }

  private reset(object) {
    this.form.reset('', { emitEvent: false, onlySelf: true });
    this.displayList = object.content.map(val => `${val.name} (${val.type})`);
    this.wholeList[object.type] = object.content;
  }

  private toggle(res, vou, type, food, area, place) {
    this.needResPorts = res;
    this.needVouPorts = vou;
    this.needTypePorts = type;
    this.needFoodPorts = food;
    this.needAreaPorts = area;
    this.needPlacePorts = place;
  }

  private collectAllSelected() {
    const total = [];
    function pushTotal(val, type) {
      total.push({
        id: val.id,
        name: val.name,
        type: type
      });
    }

    const fv = this.form.value;
    if (this.needResPorts && fv.restaurants) { fv.restaurants.map(val => pushTotal(val, 'restaurant')); }
    if (this.needVouPorts && fv.vouchers) { fv.vouchers.map(val => pushTotal(val, 'voucher')); }
    if (this.needTypePorts && fv.restaurantTypes) { fv.restaurantTypes.map(val => pushTotal(val, 'resType')); }
    if (this.needFoodPorts && fv.foodTypes) { fv.foodTypes.map(val => pushTotal(val, 'foodType')); }
    if (this.needAreaPorts && fv.areas) { fv.areas.map(val => pushTotal(val, 'area')); }
    if (this.needAreaPorts && fv.places) { fv.places.map(val => pushTotal(val, 'place')); }
    return total;
  }

}
