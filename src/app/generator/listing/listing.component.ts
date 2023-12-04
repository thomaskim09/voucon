import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { GeneratorService } from 'src/app/providers/generator/generator.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { Events } from '@ionic/angular';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements OnInit, OnDestroy {

  // Form
  form: FormGroup;

  listing: any;
  content: any;

  dateFormat: any = 'dd MMM yyyy';

  constructor(
    public events: Events,
    public formBuilder: FormBuilder,
    public datePicker: DatePicker,
    public generatorService: GeneratorService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.events.unsubscribe('NextListing');
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      duration: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      invoiceNo: ['', Validators.required],
      listingFee: [200, Validators.required],
      bankType: ['Public Bank', Validators.required],
      bankAccountName: ['Ilovou Studio', Validators.required],
      bankAccountNumber: ['3212484705', Validators.required],
      contact: ['018-6625753', Validators.required],
      email: ['ilovou.vouchy@gmail.com', Validators.required],
    });
  }

  private onChanges() {
    this.form.get('duration').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      const cd = new Date();
      const sd = this.form.get('startDate');
      const ed = this.form.get('endDate');
      switch (val) {
        case 'CM': {
          const sdv = startOfMonth(cd);
          const formated = format(sdv, this.dateFormat);
          sd.setValue(formated);

          const cdv = endOfMonth(cd);
          const formated2 = format(cdv, this.dateFormat);
          ed.setValue(formated2);
          break;
        }
        case 'LM': {
          const sdv = startOfMonth(subMonths(cd, 1));
          const formated = format(sdv, this.dateFormat);
          sd.setValue(formated);

          const cdv = endOfMonth(cd);
          const formated2 = format(cdv, this.dateFormat);
          ed.setValue(formated2);
          break;
        }
        case '2M': {
          const sdv = startOfMonth(subMonths(cd, 2));
          const formated = format(sdv, this.dateFormat);
          sd.setValue(formated);

          const cdv = endOfMonth(cd);
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
      const formated = format(date, this.dateFormat);
      this.form.controls.endDate.setValue(formated);
    });
  }

  async preparePreview() {
    if (await this.commonService.presentAlert()) {
      this.generatorService.getAllAdminCompany().pipe(untilDestroyed(this)).subscribe(val => {
        const fv = this.form.value;
        this.listing = val.map(val2 => {
          const cd = val2.companyDetails;
          return {
            invoiceNo: fv.invoiceNo + 1,
            companyName: cd.companyName,
            registrationNo: cd.registrationNo,
            companyContact: cd.contact,
            address: cd.address,
            startDate: fv.startDate,
            endDate: fv.endDate,
            listingFee: fv.listingFee,
            bankType: fv.bankType,
            bankAccountName: fv.bankAccountName,
            bankAccountNumber: fv.bankAccountNumber,
            contact: fv.contact,
            email: fv.email,
          };
        });
        this.commonService.presentToast(`${this.listing.length} of restaurants prepared`);
        this.content = this.listing[0];
        const length = this.listing.length;
        this.events.subscribe('NextListing', data => {
          if (data.index < this.listing.length) {
            this.content = this.listing[data.index];
            this.events.publish('Listing', { index: data.index, length: length });
          }
        });
      });
    }
  }

  async generateInvoice() {
    if (await this.commonService.presentAlert()) {
      if (this.listing) {
        const length = this.listing.length;
        this.events.publish('Listing', { index: 0, length: length });
      }
    }
  }
}
