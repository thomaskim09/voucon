import { Component, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/providers/common/common.service';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import * as XLSX from 'xlsx';
import { GeneratorService } from 'src/app/providers/generator/generator.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
declare var cordova: any;

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  providers: [File]
})
export class CompanyInfoComponent implements OnDestroy {

  listing: any;

  constructor(
    public generatorService: GeneratorService,
    public commonService: CommonService,
    public file: File) { }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  async generateExcel() {
    if (await this.commonService.presentAlert()) {
      this.generatorService.getAllAdminCompany().pipe(untilDestroyed(this)).subscribe(val => {
        this.listing = val.map(val2 => {
          const cd = val2.companyDetails;
          return {
            status: val2.status,
            companyName: cd.companyName,
            registrationNo: cd.registrationNo,
            sstId: cd.sstId,
            contact: cd.contact,
            email: cd.email,
            address: cd.address,
            bankType: cd.bankType,
            bankAccountName: cd.bankAccountName,
            bankAccountNumber: cd.bankAccountNumber
          };
        });
        this.exportSheet();
      });
    }
  }

  async exportSheet() {
    const sheet1 = XLSX.utils.json_to_sheet(this.listing);

    const wb1 = {
      SheetNames: ['sheet1'],
      Sheets: {
        'sheet1': sheet1,
      }
    };
    const wbout1 = XLSX.write(wb1, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    });

    const directory = cordova.file.externalDataDirectory;
    const fileName1 = `ilovouStudio_Company_Info.xlsx`;
    const options2: IWriteOptions = { replace: true };

    // Writing File to Device
    const blob1 = new Blob([this.s2ab(wbout1)], { type: 'application/octet-stream' });

    this.file.writeFile(directory, fileName1, blob1, options2).then(success => {
      this.commonService.presentToast(`${fileName1} created Succesfully`);
    }).catch(error => {
      this.commonService.presentToast('Cannot Create File');
    });
  }

  private s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }
    return buf;
  }
}
