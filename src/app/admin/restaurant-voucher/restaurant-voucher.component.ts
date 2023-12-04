import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

class Port {
  public id: string;
  public name: string;
  public content: any;
}

@Component({
  selector: 'app-restaurant-voucher',
  templateUrl: './restaurant-voucher.component.html',
  styleUrls: ['./restaurant-voucher.component.scss'],
})
export class RestaurantVoucherComponent implements OnInit, OnDestroy {

  // Searchable select
  resPorts: Port[];
  vouPorts: Port[];

  // Form
  form: FormGroup;

  // Controller
  isVoucherOnly: boolean = false;
  timer: any;

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.onChanges();
    this.setUpRestaurantList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      type: ['', Validators.required],
      restaurantId: ['', Validators.required],
      statusType: ['', Validators.required],
      voucherId: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  private onChanges() {
    this.form.get('type').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val === 'restaurants') {
        this.isVoucherOnly = false;
        this.form.get('voucherId').disable({ emitEvent: false });
        this.form.get('statusType').disable({ emitEvent: false });
      } else {
        this.isVoucherOnly = true;
        this.form.get('voucherId').enable({ emitEvent: false });
        this.form.get('statusType').enable({ emitEvent: false });
      }
    });

    this.form.get('restaurantId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (!val.id) {
        this.commonService.presentToast('No restaurantId, please create one first');
        return;
      }
      if (this.isVoucherOnly) {
        this.form.get('statusType').reset('', { emitEvent: false });
        this.form.get('voucherId').reset('', { emitEvent: false });
        this.form.get('status').reset('');
        return;
      }
      this.form.get('status').setValue(val.content.restaurantStatus);
    });

    this.form.get('statusType').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (!val) {
        return;
      }
      const fv = this.form.value;
      const restaurantId = fv.restaurantId.id;
      this.setUpVoucherList(restaurantId, val);
    });

    this.form.get('voucherId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.form.get('status').setValue(val.content.status);
    });
  }

  private setUpRestaurantList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.resPorts = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName ? `${val2.restaurantName} - ${val2.restaurantStatus}` : `(${val2.username}) - No status`,
        content: val2
      }));
    });
  }

  private setUpVoucherList(restaurantId, statusType) {
    this.adminService.getVoucherList(restaurantId, statusType).pipe(untilDestroyed(this)).subscribe(val => {
      if (!val) {
        this.commonService.presentToast('No result found');
        return;
      }
      this.vouPorts = val.map(val2 => ({
        id: val2._id,
        name: `${val2.details.voucherName} (${val2.status})`,
        content: val2
      }));
    });
  }

  async updateRestaurantStatus() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      const status = fv.status;
      const restaurantId = fv.restaurantId.id;
      this.adminService.updateResVouStatus('restaurant', restaurantId, status).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('Restaurant\'s status updated');
        this.reset();
        this.timer = setTimeout(() => {
          this.setUpRestaurantList();
        }, 500);
      });
    }
  }

  async updateVoucherStatus() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      const status = fv.status;
      const restaurantId = fv.restaurantId.id;
      const voucherId = fv.voucherId.id;
      this.adminService.updateResVouStatus('voucher', voucherId, status, restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('Voucher\'s status updated');
        this.reset();
      });
    }
  }

  private reset() {
    this.isVoucherOnly = false;
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }

}
