import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ad-manager',
  templateUrl: './ad-manager.page.html',
  styleUrls: ['./ad-manager.page.scss'],
})
export class AdManagerPage implements OnInit {

  itemList = [
    {
      title: 'Set up ads',
      url: '/ad-manager/ads',
    },
    {
      title: 'Set up rating',
      url: '/ad-manager/rating',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
