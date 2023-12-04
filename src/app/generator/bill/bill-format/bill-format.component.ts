import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Events } from '@ionic/angular';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { CommonService } from 'src/app/providers/common/common.service';
import { toPng } from 'html-to-image';
import * as jsPDF from 'jspdf';
declare var cordova: any;

@Component({
  selector: 'app-bill-format',
  templateUrl: './bill-format.component.html',
  styleUrls: ['./bill-format.component.scss'],
  providers: [File]
})
export class BillFormatComponent implements OnInit, OnChanges, OnDestroy {

  @Input('bill') bill: any;

  // Cleaner code
  com: any;

  // Controller
  billType: string;

  constructor(
    public events: Events,
    public file: File,
    public fileOpener: FileOpener,
    public commonService: CommonService) { }

  ngOnInit() {
    this.events.subscribe('PDF', () => {
      this.htmlToImagePDF();
    });
  }

  ngOnChanges() {
    this.com = this.bill.companyDetails;
  }

  ngOnDestroy() {
    this.events.unsubscribe('PDF');
  }

  htmlToImagePDF() {
    this.commonService.presentToast('Creating PDF file...');
    const div = document.getElementById('printable-area');

    toPng(div).then(dataUrl => {
      // Initialize JSPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(dataUrl, 'PNG', 5, 2, 200, 290, undefined, 'FAST');

      const pdfOutput = pdf.output();
      // using ArrayBuffer will allow you to put image inside PDF
      const buffer = new ArrayBuffer(pdfOutput.length);
      const array = new Uint8Array(buffer);
      for (let i = 0; i < pdfOutput.length; ++i) {
        array[i] = pdfOutput.charCodeAt(i);
      }

      const directory = cordova.file.dataDirectory;
      const fileName = `${this.com.companyName}(${this.bill.startDate}-${this.bill.endDate}).pdf`;
      const options2: IWriteOptions = { replace: true };

      this.file.writeFile(directory, fileName, buffer, options2)
        .then(success => this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf').then().catch())
        .catch(error => this.commonService.presentToast('Cannot create file'));
    }).catch(error => this.commonService.presentToast('toPng error'));
  }

  getEven(index) {
    return index % 2 === 0;
  }
}
