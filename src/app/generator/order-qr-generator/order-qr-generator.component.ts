import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Clipboard } from '@ionic-native/clipboard/ngx';

class Port {
  public id: string;
  public name: string;
  public content: any;
}

@Component({
  selector: 'app-order-qr-generator',
  templateUrl: './order-qr-generator.component.html',
  styleUrls: ['./order-qr-generator.component.scss'],
  providers: [Clipboard]
})
export class OrderQrGeneratorComponent implements OnInit, OnDestroy {

  // Searchable select
  resPorts: Port[];

  // Form
  form: FormGroup;

  QRText: any;
  restaurantName: string;

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService,
    public clipboard: Clipboard) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.setUpRestaurantList();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      restaurantId: ['', Validators.required],
      website: ['https://pwa.vouchy.com.my/#/order', Validators.required],
    });
  }

  private setUpRestaurantList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.resPorts = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName || `(${val2.username})`,
        content: val2
      }));
    });
  }

  private onChanges() {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.QRText = this.getQRText();
    });

    this.form.get('restaurantId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (!val.id) {
        this.commonService.presentToast('No restaurantId found, please create one');
        return;
      }
      this.restaurantName = val.name;
    });
  }

  async copyQR() {
    if (await this.commonService.presentAlert()) {
      this.clipboard.copy(this.QRText);
      this.commonService.presentToast(`${this.QRText} copied`);
    }
  }

  private getQRText() {
    const fv = this.form.value;
    const restaurantId = fv.restaurantId.id;
    const website = fv.website;
    return `${website}?&restaurantId=${restaurantId}`;
  }

}
