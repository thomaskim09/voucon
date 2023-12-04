import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/providers/common/common.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import * as XLSX from 'xlsx';
import { GeneratorService } from 'src/app/providers/generator/generator.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { startOfMonth, endOfMonth, addWeeks, format, startOfDay, endOfDay, subMonths, subDays, parseISO } from 'date-fns';
import { Platform } from '@ionic/angular';
import lo_sortBy from 'lodash/sortBy';
declare var cordova: any;

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss'],
  providers: [File]
})
export class SettlementComponent implements OnInit, OnDestroy {

  // Form
  form: FormGroup;

  // Properties
  selectedMonth: Date;
  startDateISO: string;
  endDateISO: string;
  dateFormat: string = 'dd-MMM-yyyy (hh:mm a)';

  // File properties
  options: IWriteOptions = { replace: true };

  // Excel 1
  companySummary = [];
  companySummaryFiltered = [];
  companyAllTransaction = [];
  treatTransaction = [];
  treatSummary = [];

  // Excel 2
  companyTransaction = [];

  // Controller
  needSpinner: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public generatorService: GeneratorService,
    public commonService: CommonService,
    public datePicker: DatePicker,
    public file: File,
    public platform: Platform) { }

  ngOnInit() {
    this.form = this.setUpForm();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    return this.formBuilder.group({
      month: ['', Validators.required],
      duration: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  private onChanges() {
    this.form.get('month').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      switch (val) {
        case 'L2M': this.selectedMonth = subMonths(new Date(), 2); break;
        case 'LM': this.selectedMonth = subMonths(new Date(), 1); break;
        case 'TM': this.selectedMonth = new Date(); break;
      }
      const duration = this.form.get('duration').value;
      if (duration) {
        this.updateDuration(duration);
      }
    });
    this.form.get('duration').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.updateDuration(val);
    });
  }

  private updateDuration(val) {
    const cd = startOfMonth(this.selectedMonth);
    const sd = this.form.get('startDate');
    const ed = this.form.get('endDate');
    switch (val) {
      case 'WM': {
        const sdv = cd;
        this.startDateISO = startOfDay(sdv).toISOString();
        const formated = format(sdv, this.dateFormat);
        sd.setValue(formated);

        const cdv = endOfMonth(cd);
        this.endDateISO = cdv.toISOString();
        const formated2 = format(cdv, this.dateFormat);
        ed.setValue(formated2);
        break;
      }
      case 'F2': {
        const sdv = cd;
        this.startDateISO = startOfDay(sdv).toISOString();
        const formated = format(sdv, this.dateFormat);
        sd.setValue(formated);

        const cdv = endOfDay(subDays(addWeeks(cd, 2), 1));
        this.endDateISO = cdv.toISOString();
        const formated2 = format(cdv, this.dateFormat);
        ed.setValue(formated2);
        break;
      }
      case 'L2': {
        const sdv = addWeeks(cd, 2);
        this.startDateISO = startOfDay(sdv).toISOString();
        const formated = format(sdv, this.dateFormat);
        sd.setValue(formated);

        const cdv = endOfMonth(cd);
        this.endDateISO = cdv.toISOString();
        const formated2 = format(cdv, this.dateFormat);
        ed.setValue(formated2);
        break;
      }
    }
  }

  showStartPicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {
      this.startDateISO = startOfDay(date).toISOString();
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
      this.endDateISO = endOfDay(date).toISOString();
      const formated = format(date, this.dateFormat);
      this.form.controls.endDate.setValue(formated);
    });
  }

  async generateExcel() {
    if (await this.commonService.presentAlert()) {
      // Reset all variables
      this.companySummary = [];
      this.companySummaryFiltered = [];
      this.treatTransaction = [];
      this.treatSummary = [];

      this.needSpinner = true;
      // Get all informations from backend
      this.generatorService.getMassSettlement(this.startDateISO, this.endDateISO).pipe(untilDestroyed(this)).subscribe(val => {
        const profitMin = 1; // Profit minimum RM1.00
        const boostPer = 0.014; // Boost 1.4%
        const tngPer = 0.014; // TnG 1.4%
        const fpxPer = 0.024; // FPX 2.4%
        const fpxMin = 0.6; // FPX minimum RM0.60

        // Calculating all companies summary list
        val.adminList.map(val2 => {
          const comPer = this.getSubscriptionRate(val2.subscription);
          let boostOffer = 0;
          let boostTotal = 0;
          let boostFee = 0;
          let boostCount = 0;
          let tngOffer = 0;
          let tngTotal = 0;
          let tngFee = 0;
          let tngCount = 0;
          let fpxTotal = 0;
          let fpxFee = 0;
          let fpxCount = 0;
          let freeCount = 0;
          let grossTotal = 0;
          let profitTotal = 0;
          let total = 0;
          const transaction = [];

          val.ticketList.map(val3 => {
            if (val2.restaurantId === val3.restaurantId) {
              let tranfee = 0;
              let gross = 0;
              let offer = 0;
              switch (val3.paymentMethod) {
                case 'BOOST': {
                  gross = val3.total * comPer;
                  if (gross < profitMin) { gross = profitMin; }
                  boostTotal += val3.total;
                  offer = val3.paymentOffer || 0;
                  boostOffer += offer;
                  tranfee = (val3.total - offer) * boostPer;
                  boostFee += tranfee;
                  boostCount += val3.quantity;
                  break;
                }
                case 'TNG-EWALLET': {
                  gross = val3.total * comPer;
                  if (gross < profitMin) { gross = profitMin; }
                  tngTotal += val3.total;
                  offer = val3.paymentOffer || 0;
                  tngOffer += offer;
                  tranfee = (val3.total - offer) * tngPer;
                  tngFee += tranfee;
                  tngCount += val3.quantity;
                  break;
                }
                case 'fpx': {
                  tranfee = val3.total * fpxPer;
                  if (tranfee < fpxMin) { tranfee = fpxMin; }
                  gross = val3.total * comPer;
                  if (gross < profitMin) { gross = profitMin; }
                  fpxTotal += val3.total;
                  fpxFee += tranfee;
                  fpxCount += val3.quantity;
                  break;
                }
                default: { // Free Tickets
                  gross = 1;
                  freeCount += val3.quantity;
                  break;
                }
              }
              total += val3.total;
              grossTotal += gross;
              profitTotal += (gross - tranfee - boostOffer - tngOffer);

              transaction.push({
                purchase_time: format(parseISO(val3.purchaseTime), this.dateFormat),
                voucher_name: val3.voucherName,
                username: val3.username,
                price_per_unit: `RM ${this.roundUp(val3.pricePerUnit)}`,
                quantity: `${val3.quantity} unit`,
                sub_total: `RM ${this.roundUp(val3.total)}`,
                service_fee: `RM ${this.roundUp(gross)}`,
                total: `RM ${this.roundUp(val3.total - gross)}`
              });

              this.companyAllTransaction.push({
                time: val3.purchaseTime,
                purchase_time: format(parseISO(val3.purchaseTime), this.dateFormat),
                username: val3.username,
                voucher_name: val3.voucherName,
                paymentMethod: val3.paymentMethod,
                paymentOffer: `RM ${this.roundUp(offer)}`,
                price_per_unit: `RM ${this.roundUp(val3.pricePerUnit)}`,
                quantity: `${val3.quantity} unit`,
                sub_total: `RM ${this.roundUp(val3.total)}`,
                service_fee: `RM ${this.roundUp(gross)}`,
                molpay_fee: `RM ${this.roundUp(tranfee)}`,
                total: `RM ${this.roundUp(val3.total - gross)}`,
                restaurant_id: val2.restaurantId,
                restaurant_name: val2.restaurantName,
              });
            }
          });
          // Company transaction
          if (transaction.length) {
            this.companyTransaction.push({
              restaurantName: val2.restaurantName,
              transaction: transaction
            });
          }

          // Company all transaction
          this.companyAllTransaction = lo_sortBy(this.companyAllTransaction, ['time']);

          // Company summary
          this.companySummary.push({
            total_count: this.getUnit(boostCount + fpxCount + freeCount),
            total: this.getPrice(total),
            boost_percentage: this.getPercentage(boostPer),
            boost_count: this.getUnit(boostCount),
            boost_total: this.getPrice(boostTotal),
            boost_fee: this.getPrice(boostFee),
            boost_self_offer: this.getPrice(tngOffer),
            tng_percentage: this.getPercentage(tngPer),
            tng_count: this.getUnit(tngCount),
            tng_total: this.getPrice(tngTotal),
            tng_fee: this.getPrice(tngFee),
            tng_self_offer: this.getPrice(tngOffer),
            fpx_percentage: this.getPercentage(fpxPer),
            fpx_count: this.getUnit(fpxCount),
            fpx_total: this.getPrice(fpxTotal),
            fpx_fee: this.getPrice(fpxFee),
            free_count: this.getUnit(freeCount),
            vouchy_gross_total: this.getPrice(grossTotal),
            molpay_total_fee: this.getPrice(boostFee + tngFee + fpxFee),
            vouchy_profit_total: this.getPrice(profitTotal),
            merchant_total: this.getPrice(total - grossTotal),
            status: val2.status,
            feature: this.getFeature(val2.feature),
            subscription: this.getSubscriptionName(val2.subscription),
            listing_fee: this.getSubscriptionListing(val2.subscription),
            profit_percentage: this.getPercentage(comPer),
            restaurant_id: val2.restaurantId,
            restaurant_name: val2.restaurantName,
            company_name: val2.companyName,
            email: val2.email,
            bank_type: val2.bankType,
            bank_account_name: val2.bankAccountName,
            bank_account_number: val2.bankAccountNumber,
          });
        });
        // Company Summary Filtered
        this.companySummaryFiltered = this.companySummary.filter(val2 => val2.total_count !== '0');

        // Calculating treat list
        let boostTotalTreat = 0;
        let boostCountTreat = 0;
        let tngTotalTreat = 0;
        let tngCountTreat = 0;
        let fpxTotalTreat = 0;
        let fpxCountTreat = 0;
        let amountTreat = 0;
        let totalCountTreat = 0;
        let transactionFeeTreat = 0;
        let profitTotalTreat = 0;

        val.treatList.map(val2 => {
          let tranfee;
          switch (val2.paymentMethod) {
            case 'BOOST': {
              tranfee = val2.amount * boostPer;
              boostTotalTreat += tranfee;
              boostCountTreat += 1;
              break;
            }
            case 'TNG-EWALLET': {
              tranfee = val2.amount * tngPer;
              tngTotalTreat += tranfee;
              tngCountTreat += 1;
              break;
            }
            case 'fpx': {
              tranfee = val2.amount * fpxPer;
              if (tranfee < fpxMin) { tranfee = fpxMin; }
              fpxTotalTreat += tranfee;
              fpxCountTreat += 1;
              break;
            }
          }
          amountTreat += val2.amount;

          // Treat transaction
          this.treatTransaction.push({
            purchaseTime: val2.createdTime,
            email: val2.email,
            paymentMethod: val2.paymentMethod,
            amount: val2.amount
          });
        });
        transactionFeeTreat = boostTotalTreat + tngTotalTreat + fpxTotalTreat;
        profitTotalTreat = amountTreat - transactionFeeTreat;
        totalCountTreat = boostCountTreat + tngCountTreat + fpxCountTreat;

        // Treat summary
        if (totalCountTreat) {
          this.treatSummary = [{
            total_count: this.getUnit(totalCountTreat),
            total: this.getPrice(amountTreat),
            boost_count: this.getUnit(boostCountTreat),
            boost_total: this.getPrice(boostTotalTreat),
            tng_count: this.getUnit(tngCountTreat),
            tng_total: this.getPrice(tngTotalTreat),
            fpx_count: this.getUnit(fpxCountTreat),
            fpx_total: this.getPrice(fpxTotalTreat),
            molpay_fee: this.getPrice(transactionFeeTreat),
            vouchy_profit_total: this.getPrice(profitTotalTreat)
          }];
        }
        this.needSpinner = false;
        // Start generate all documents
        this.exportCompanySummarySheet();
        this.exportCompanyTransactionSheet();
        // this.generateFilteredJSONFile();
        // this.generateAllJSONFile();
        this.resetAllList();
      });
    }
  }

  private getPrice(value) {
    return value ? `RM ${this.roundUp(value)}` : '';
  }

  private getUnit(value) {
    return value ? `${value} unit` : '';
  }

  private getPercentage(value) {
    return `${(value * 100).toFixed(2)}%`;
  }

  private getFeature(value) {
    switch (value) {
      case '1': return 'Voucher only';
      case '3': return 'Full features';
    }
  }

  private getSubscriptionName(type) {
    switch (type) {
      case '01': return 'Bronze';
      case '02': return 'Gold';
      case '03': return 'Platinum';
    }
  }

  private getSubscriptionRate(type) {
    switch (type) {
      case '01': return 0.1; // 10%
      case '02': return 0.08; // 8%
      case '03': return 0.06; // 6%
    }
  }

  private getSubscriptionListing(type) {
    switch (type) {
      case '01': return 100;
      case '02': return 125;
      case '03': return 150;
    }
  }

  private roundUp(value) {
    return (Math.round((value + 0.00001) * 100) / 100).toFixed(2);
  }

  private resetAllList() {
    this.companySummary = [];
    this.companySummaryFiltered = [];
    this.companyAllTransaction = [];
    this.treatTransaction = [];
    this.treatSummary = [];
    this.companyTransaction = [];
  }

  private exportCompanySummarySheet() {
    if (!this.platform.is('cordova')) {
      return;
    }
    const wb2 = {
      SheetNames: ['Company Summary Filtered', 'Company Summary', 'Company All Transaction', 'Treat Summary', 'Treat Transaction'],
      Sheets: {
        'Company Summary Filtered': XLSX.utils.json_to_sheet(this.companySummaryFiltered),
        'Company Summary': XLSX.utils.json_to_sheet(this.companySummary),
        'Company All Transaction': XLSX.utils.json_to_sheet(this.companyAllTransaction),
        'Treat Summary': XLSX.utils.json_to_sheet(this.treatSummary),
        'Treat Transaction': XLSX.utils.json_to_sheet(this.treatTransaction)
      }
    };
    const wbout2 = XLSX.write(wb2, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    });
    const fileName = this.getFileName('Summary', 'xlsx');
    const blob = new Blob([this.s2ab(wbout2)], { type: 'application/octet-stream' });
    this.writeFile(fileName, blob);
  }

  private exportCompanyTransactionSheet() {
    if (!this.platform.is('cordova') && !this.companyTransaction.length) {
      return;
    }
    const sheetNames = [];
    const sheets = {};
    this.companyTransaction.map(val => {
      sheetNames.push(val.restaurantName.slice(0, 30));
      sheets[val.restaurantName.slice(0, 30)] = XLSX.utils.json_to_sheet(val.transaction);
    });
    const wb2 = {
      SheetNames: sheetNames,
      Sheets: sheets
    };
    const wbout2 = XLSX.write(wb2, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    });
    const fileName = this.getFileName('Transaction', 'xlsx');
    const blob = new Blob([this.s2ab(wbout2)], { type: 'application/octet-stream' });
    this.writeFile(fileName, blob);
  }

  private s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }
    return buf;
  }

  private getFileName(name, type) {
    const startDateString = this.startDateISO.slice(0, -14);
    const endDateString = this.endDateISO.slice(0, -14);
    return `(${startDateString}_${endDateString})${name}.${type}`;
  }

  private writeFile(fileName, item) {
    const directory = cordova.file.externalDataDirectory;
    this.file.writeFile(directory, fileName, item, this.options)
      .then(success => this.commonService.presentToast(`${fileName} created succesfully`))
      .catch(error => this.commonService.presentToast(`Cannot create ${fileName}`));
  }

  private generateFilteredJSONFile() {
    const list = this.companySummary.map(val => {
      if (val.balance !== 0) {
        return {
          balance: val.balance,
          status: val.status,
          restaurantId: val.restaurantId,
          companyName: val.companyName,
          email: val.email,
        };
      }
    });
    const fileName = this.getFileName('filtered', 'json');
    this.writeFile(fileName, list);
  }

  private generateAllJSONFile() {
    const list = this.companySummary.map(val => ({
      status: val.status,
      restaurantId: val.restaurantId,
      companyName: val.companyName,
      email: val.email,
    }));
    const fileName = this.getFileName('all', 'json');
    this.writeFile(fileName, list);
  }

}
