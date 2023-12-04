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
  selector: 'app-admin-branch',
  templateUrl: './admin-branch.component.html',
  styleUrls: ['./admin-branch.component.scss'],
})
export class AdminBranchComponent implements OnInit, OnDestroy {

  // Searchable select
  adminList: Port[];
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
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      action: ['', Validators.required],
      adminId: [''],
      restaurantList: ['', Validators.required],
    });
  }

  private setUpAdminRestaurantList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.adminList = val.map(val2 => ({
        id: val2.adminId,
        name: val2.restaurantName || `(${val2.username})`
      }));
      this.restaurantList = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName || `(${val2.username})`
      }));
    });
  }

  private onChanges() {
    this.form.get('adminId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.getAdminDetails(val.id);
      }
    });
  }

  private getAdminDetails(id) {
    this.adminService.getAdminBranch(id).pipe(untilDestroyed(this)).subscribe(val => {
      if (!val) {
        return;
      }
      const list = val.restaurantList.map(val2 => ({
        id: val2
      }));
      this.form.patchValue({
        restaurantList: list
      });
    });
  }

  async createBranch() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      const content = {
        restaurantList: fv.restaurantList.map(val => val.id)
      };
      this.adminService.createBranch(content).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('All Admin Branch Updated');
        this.reset();
      });
    }
  }

  async unlinkBranch() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      const content = {
        restaurantList: fv.restaurantList.map(val => val.id)
      };
      this.adminService.unlinkBranch(content).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast(`All Admin Branch Removed`);
        this.reset();
      });
    }
  }

  private reset() {
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }
}
