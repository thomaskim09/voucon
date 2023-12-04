import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

class Port {
  public id: string;
  public name: string;
}

@Component({
  selector: 'app-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss'],
})
export class MenuLinkComponent implements OnInit, OnDestroy {

  // Searchable select
  restaurantList: Port[];

  // Form
  form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.setUpAdminRestaurantList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      action: ['', Validators.required],
      restaurantId: ['', Validators.required],
      restaurantList: [''],
    });
  }

  private setUpAdminRestaurantList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.restaurantList = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName || `(${val2.username})`
      }));
    });
  }

  async linkMenu() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      const restaurantList = fv.restaurantList.map(val => val.id);
      this.adminService.linkMenu(fv.restaurantId.id, restaurantList).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('Menu restaurant list linked');
        this.reset();
      });
    }
  }

  async unlinkMenu() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      this.adminService.unlinkMenu(fv.restaurantId.id).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast(`Menu restaurant list reset`);
        this.reset();
      });
    }
  }

  private reset() {
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }
}
