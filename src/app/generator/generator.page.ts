import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.page.html',
  styleUrls: ['./generator.page.scss'],
})
export class GeneratorPage implements OnInit {

  itemList = [
    {
      title: 'Generate order QR code',
      url: '/generator/qr_generator',
    },
    {
      title: 'Generate mass settlement',
      url: '/generator/settlement',
    },
    {
      title: 'Generate company info',
      url: '/generator/company_info',
    },
    {
      title: 'Generate invoice (Ticket Summary)',
      url: '/generator/bill',
    },
    {
      title: 'Generate listing invoice',
      url: '/generator/listing',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
