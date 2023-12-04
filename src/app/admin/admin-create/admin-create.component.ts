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
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.scss'],
})
export class AdminCreateComponent implements OnInit, OnDestroy {

  updateType: string;

  // Searchable select
  adminList: Port[];

  // Form
  form: FormGroup;

  // JS properties
  currentAdminId: string;
  currentRestaurantId: string;

  bankTypeList = [];

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.onChanges();
    this.setUpBankList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      action: ['', Validators.required],
      updateType: ['', Validators.required],
      adminId: ['', Validators.required],
      // Individual Info
      username: ['', Validators.required],
      password: ['', Validators.required],
      status: ['', Validators.required],
      subscription: ['', Validators.required],
      feature: ['', Validators.required],
      // Company Info
      companyName: ['', Validators.required],
      registrationNo: ['', Validators.required],
      sstId: [''],
      contact: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      // Bank Info
      bankType: ['', Validators.required],
      bankAccountName: ['', Validators.required],
      bankAccountNumber: ['', Validators.required],
    });
  }

  private onChanges() {
    this.form.get('action').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val === 'update') {
        this.form.get('adminId').enable({ emitEvent: false });
        this.form.get('updateType').enable({ emitEvent: false });
        this.setUpAdminList();
      } else {
        this.form.get('adminId').disable({ emitEvent: false });
        this.form.get('updateType').disable({ emitEvent: false });
        this.toggleShortcut([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], []);
      }
      if (val === 'create_future') {
        this.patchFutureAdmin();
      } else {
        this.resetPatch();
      }
    });

    this.form.get('updateType').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.updateType = val;
      switch (val) {
        case 'username': this.toggleShortcut([0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]); break;
        case 'password': this.toggleShortcut([1], [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]); break;
        case 'status': this.toggleShortcut([2], [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]); break;
        case 'subscription': this.toggleShortcut([3], [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]); break;
        case 'feature': this.toggleShortcut([4], [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13]); break;
        case 'company': this.toggleShortcut([5, 6, 7, 8, 9, 10], [0, 1, 2, 3, 4, 11, 12, 13]); break;
        case 'bank': this.toggleShortcut([11, 12, 13], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); break;
      }
    });

    this.form.get('adminId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.currentAdminId = val.id;
        this.getAdminDetails(val.id);
      }
    });
  }

  private patchFutureAdmin() {
    this.form.patchValue({
      username: 'future1',
      password: 'future1',
      status: 'HD',
      subscription: '01',
      feature: '1',
      companyName: 'future sdb bhd',
      registrationNo: 'futurexxx',
      sstId: undefined,
      contact: '012-3456789',
      email: 'future@gmail.com',
      address: 'life is so nice',
      bankType: { name: 'Affin Bank Berhad' },
      bankAccountName: 'future sdb bhd',
      bankAccountNumber: 'bank123456789',
    });
  }

  private resetPatch() {
    this.form.patchValue({
      username: '',
      password: '',
      status: '',
      subscription: '',
      feature: '',
      companyName: '',
      registrationNo: '',
      sstId: '',
      contact: '',
      email: '',
      address: '',
      bankType: { name: '' },
      bankAccountName: '',
      bankAccountNumber: '',
    });
  }

  private toggleShortcut(enableList, disableList) {
    const formList = [
      'username',
      'password',
      'status',
      'subscription',
      'feature',
      'companyName',
      'registrationNo',
      'sstId',
      'contact',
      'email',
      'address',
      'bankType',
      'bankAccountName',
      'bankAccountNumber',
    ];
    enableList.map(val => this.form.get(formList[val]).enable());
    disableList.map(val => this.form.get(formList[val]).disable());
  }

  private setUpAdminList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.adminList = val.map(val2 => ({
        id: val2.adminId,
        name: val2.restaurantName || `(${val2.username})`
      }));
    });
  }

  private getAdminDetails(id) {
    this.adminService.getAdminDetails(id).pipe(untilDestroyed(this)).subscribe(val => {
      this.currentRestaurantId = val.restaurantId;
      this.form.patchValue({
        username: val.details.username,
        status: val.status,
        subscription: val.packageDetails.subscription,
        feature: val.packageDetails.feature,
        companyName: val.companyDetails.companyName,
        registrationNo: val.companyDetails.registrationNo,
        sstId: val.companyDetails.sstId,
        contact: val.companyDetails.contact,
        email: val.companyDetails.email,
        address: val.companyDetails.address,
        bankType: { name: val.companyDetails.bankType },
        bankAccountName: val.companyDetails.bankAccountName,
        bankAccountNumber: val.companyDetails.bankAccountNumber,
      });
    });
  }

  async createAdmin() {
    if (await this.commonService.presentAlert()) {
      const f = this.form.value;
      const content = {
        username: f.username,
        password: f.password,
        status: f.status,
        packageDetails: {
          subscription: f.subscription,
          feature: f.feature,
        },
        companyDetails: {
          companyName: f.companyName,
          registrationNo: f.registrationNo,
          contact: f.contact,
          email: f.email,
          sstId: f.sstId,
          address: f.address,
          bankType: f.bankType.name,
          bankAccountName: f.bankAccountName,
          bankAccountNumber: f.bankAccountNumber,
        }
      };
      this.adminService.signUpAdmin(content).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('New Admin Created');
        this.reset();
      }, error => {
        this.commonService.presentToast(error.error.message);
      });
    }
  }

  async createFutureAdmin() {
    if (await this.commonService.presentAlert()) {
      const f = this.form.value;
      const content = {
        username: f.username,
        password: f.password,
        status: f.status,
        packageDetails: {
          subscription: f.subscription,
          feature: f.feature,
        },
        companyDetails: {
          companyName: f.companyName,
          registrationNo: f.registrationNo,
          contact: f.contact,
          email: f.email,
          sstId: f.sstId,
          address: f.address,
          bankType: f.bankType.name,
          bankAccountName: f.bankAccountName,
          bankAccountNumber: f.bankAccountNumber,
        }
      };
      this.adminService.signUpFutureAdmin(content).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('New Future Admin Created');
        this.reset();
      }, error => {
        this.commonService.presentToast(error.error.message);
      });
    }
  }

  async updateAdmin() {
    if (await this.commonService.presentAlert()) {
      const f = this.form.value;
      const content = {
        updateType: this.updateType,
        adminId: this.currentAdminId,
        restaurantId: this.currentRestaurantId,
        username: f.username,
        password: f.password,
        status: f.status,
        packageDetails: {
          subscription: f.subscription,
          feature: f.feature,
        },
        companyDetails: {
          companyName: f.companyName,
          registrationNo: f.registrationNo,
          contact: f.contact,
          email: f.email,
          sstId: f.sstId,
          address: f.address,
          bankType: f.bankType ? f.bankType.name : undefined,
          bankAccountName: f.bankAccountName,
          bankAccountNumber: f.bankAccountNumber,
        }
      };
      this.adminService.updateAdminDetails(content).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast(`Admin's Details Updated`);
        this.reset();
      });
    }
  }

  private reset() {
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }

  private setUpBankList() {
    this.bankTypeList = [
      { name: `Affin Bank Berhad` },
      { name: `Alliance Bank Malaysia Berhad` },
      { name: `AmBank (M) Berhad` },
      { name: `BNP Paribas Malaysia Berhad` },
      { name: `CIMB Bank Berhad` },
      { name: `China Construction Bank (Malaysia) Berhad` },
      { name: `Citibank Berhad` },
      { name: `HSBC Bank Malaysia Berhad` },
      { name: `Hong Leong Bank Berhad` },
      { name: `Industrial and Commercial Bank of China (Malaysia) Berhad` },
      { name: `Public Bank Berhad` },
      { name: `RHB Bank Berhad` },
      { name: `Standard Chartered Bank Malaysia Berhad` },
      { name: `Alliance Bank Berhad` },
      { name: `AmBank Berhad` },
      { name: `HSBC Amanah Malaysia Berhad` },
      { name: `Hong Leong Bank Berhad` },
      { name: `OCBC Bank Berhad` },
      { name: `Standard Chartered Saadiq Berhad` },
      { name: `Alliance Bank Berhad` },
      { name: `CIMB Bank Berhad` },
      { name: `Hong Leong Investment Bank Berhad` },
      { name: `Maybank Berhad` }
    ];
  }
}
