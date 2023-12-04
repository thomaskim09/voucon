import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/providers/common/common.service';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Events } from '@ionic/angular';
import { GeneratorService } from 'src/app/providers/generator/generator.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import lo_uniqBy from 'lodash/uniqBy';

class Port {
  public id: string;
  public name: string;
  public content: any;
}

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {

  // Searchable select
  resPorts: Port[];
  resPort: Port;

  // Form
  form: FormGroup;

  // JS properties
  adminId: string;
  restaurantId: string;
  restaurantName: string;
  startDateISO: string;
  endDateISO: string;

  // Parameter
  bill: any;

  dateFormat: any = 'dd MMM yyyy';

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public generatorService: GeneratorService,
    public commonService: CommonService,
    public datePicker: DatePicker,
    public events: Events) { }

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
      duration: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  private setUpRestaurantList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.resPorts = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName,
        content: val2
      }));
    });
  }

  resPortChange(event: { component: IonicSelectableComponent, value: any }) {
    const con = event.value.content;
    this.adminId = con._id;
    this.restaurantId = con.restaurantId;
    this.restaurantName = con.restaurantName;
  }

  private onChanges() {
    this.form.get('duration').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      const cd = new Date();
      const sd = this.form.get('startDate');
      const ed = this.form.get('endDate');
      switch (val) {
        case 'CM': {
          const sdv = startOfMonth(cd);
          this.startDateISO = sdv.toISOString();
          const formated = format(sdv, this.dateFormat);
          sd.setValue(formated);

          const cdv = endOfMonth(cd);
          this.endDateISO = cdv.toISOString();
          const formated2 = format(cdv, this.dateFormat);
          ed.setValue(formated2);
          break;
        }
        case 'LM': {
          const sdv = startOfMonth(subMonths(cd, 1));
          this.startDateISO = sdv.toISOString();
          const formated = format(sdv, this.dateFormat);
          sd.setValue(formated);

          const cdv = endOfMonth(cd);
          this.endDateISO = cdv.toISOString();
          const formated2 = format(cdv, this.dateFormat);
          ed.setValue(formated2);
          break;
        }
        case '2M': {
          const sdv = startOfMonth(subMonths(cd, 2));
          this.startDateISO = sdv.toISOString();
          const formated = format(sdv, this.dateFormat);
          sd.setValue(formated);

          const cdv = endOfMonth(cd);
          this.endDateISO = cdv.toISOString();
          const formated2 = format(cdv, this.dateFormat);
          ed.setValue(formated2);
          break;
        }
      }
    });
  }

  showStartPicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {
      this.startDateISO = date.toISOString();
      const formated = format(date, this.dateFormat);
      this.form.controls.startDate.setValue(formated);
    });
  }

  showEndPicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {
      this.endDateISO = date.toISOString();
      const formated = format(date, this.dateFormat);
      this.form.controls.endDate.setValue(formated);
    });
  }

  async previewBill() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      const comMin = 1;
      const comPer = 10;
      const startDate = fv.startDate;
      const endDate = fv.endDate;

      this.generatorService.getTicketSummary(this.restaurantId, this.startDateISO, this.endDateISO)
        .pipe(untilDestroyed(this)).subscribe(val => {
          const bi = val[0];
          bi['purchaseDetails'] = bi.details.map(val2 => {
            let com = val2.pricePerUnit * comPer / 100;
            if (com <= comMin) {
              com = comMin;
            }
            com = com * val2.quantity;
            return {
              voucherName: val2.voucherName,
              pricePerUnit: (val2.pricePerUnit).toFixed(2),
              quantity: val2.quantity,
              subtotalText: (val2.total).toFixed(2),
              subtotal: val2.total,
              commission: com
            };
          });
          const filteredNames = lo_uniqBy(bi['purchaseDetails'], 'voucherName');
          bi['filteredDetails'] = filteredNames.map(val2 => {
            let com = val2.pricePerUnit * comPer / 100;
            if (com <= comMin) {
              com = comMin;
            }
            com = com * val2.quantity;

            const filtered = bi['purchaseDetails'].filter(val3 => val2.voucherName === val3.voucherName);
            const totalQuantity = filtered.reduce((acc, now) => acc + now.quantity, 0);
            const subTotal = filtered.reduce((acc, now) => acc + now.subtotal, 0);
            return {
              voucherName: val2.voucherName,
              quantity: totalQuantity,
              pricePerUnit: filtered[0].pricePerUnit,
              subtotalText: (subTotal).toFixed(2),
              subTotal: subTotal,
            };
          });

          bi['subtotal'] = bi['purchaseDetails'].reduce((acc, now) => acc + now.subtotal, 0);
          bi['commission'] = bi['purchaseDetails'].reduce((acc, now) => acc + now.commission, 0);
          bi['total'] = bi['commission'];

          // Others
          bi['startDate'] = startDate;
          bi['endDate'] = endDate;
          bi['comMin'] = (comMin).toFixed(2);
          bi['comPer'] = comPer;

          // Make into displayable string
          bi['subtotal'] = (bi['subtotal']).toFixed(2);
          bi['commission'] = (bi['commission']).toFixed(2);
          bi['total'] = (bi['total']).toFixed(2);

          this.generatorService.getCompanyInfo(this.adminId).pipe(untilDestroyed(this)).subscribe(val2 => {
            bi['companyDetails'] = val2.companyDetails;
            this.bill = bi;
          });
        });
    }
  }

  async generatePDF() {
    if (await this.commonService.presentAlert()) {
      this.events.publish('PDF');
    }
  }

}
