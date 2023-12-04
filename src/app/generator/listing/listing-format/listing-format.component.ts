import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/providers/common/common.service';
import { toPng } from 'html-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { Events } from '@ionic/angular';
import * as jsPDF from 'jspdf';
declare var cordova: any;

@Component({
  selector: 'app-listing-format',
  templateUrl: './listing-format.component.html',
  styleUrls: ['./listing-format.component.scss'],
  providers: [File]
})
export class ListingFormatComponent implements OnInit, OnDestroy {

  @Input('content') input: any;

  constructor(
    public events: Events,
    public commonService: CommonService,
    public file: File) { }

  ngOnInit() {
    this.events.subscribe('Listing', data => {
      this.htmlToImagePDF(data.index, data.length);
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('Listing');
  }

  htmlToImagePDF(index, total) {
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

      const directory = cordova.file.externalDataDirectory;
      const fileName = `${this.input.companyName}(${this.input.startDate})${this.getInvoiceNo(this.input.invoiceNo, 6)}.pdf`;
      const options2: IWriteOptions = { replace: true };

      // Writing File to Device
      this.file.writeFile(directory, fileName, buffer, options2)
        .then(success => {
          this.commonService.presentToast(`${index + 1}/${total} ${fileName}`);
          this.events.publish('NextListing', { index: index + 1 });
        })
        .catch(error => {
          this.commonService.presentToast('Cannot Create File');
        });
    }).catch(error => {
      this.commonService.presentToast('HTML to Image error');
      console.error('HTML to Image error', error);
    });
  }

  getInvoiceNo(num, size) { return ('000000000' + num).substr(-size); }

  inWords(num) {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ',
      'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) { return 'overflow'; }
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    let str: any;
    if (!n) { return; str = ''; }
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str.substring(9);
  }

}
