import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  itemList = [
    {
      title: 'Clear App Cache',
      url: '/setting/cache',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
