import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonService } from 'src/app/providers/common/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  form: FormGroup;

  typeList = [
    { value: 'restaurants', text: 'Restaurants' },
    { value: 'vouchers', text: 'Vouchers' },
    { value: 'admins', text: 'Admin' },
    { value: 'users', text: 'User' },
    { value: 'tickets', text: 'Ticket' },
    { value: 'orders', text: 'Order' },
    { value: 'feedbacks', text: 'Feedbacks' },
  ];

  jsonResult: any;

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      collection: ['', Validators.required],
      type: ['', Validators.required],
      objectId: ['', Validators.required],
      query: ['', Validators.required],
    });
  }

  private onChanges() {
    this.form.get('type').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val === 'id') {
        this.form.get('objectId').enable();
        this.form.get('query').disable();
      } else {
        this.form.get('objectId').disable();
        this.form.get('query').enable();
      }
    });
  }

  async searchCollection() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      let fields;
      switch (fv.collection) {
        case 'restaurants': fields = { 'details.restaurantImage': 0 }; break;
        case 'vouchers': fields = { 'details.voucherImage': 0 }; break;
        case 'users': fields = { 'details.profileImage': 0 }; break;
        case 'feedbacks': fields = { 'details.photos': 0 }; break;
        default: fields = {}; break;
      }

      this.adminService.getSearchCollection(fv.collection, fv.type, fv.objectId, fv.query, fields)
        .pipe(untilDestroyed(this)).subscribe(val => {
          if (val) {
            this.jsonResult = val;
          } else {
            this.commonService.presentToast('No result found');
          }
        });
    }
  }

}
