import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  itemList = [
    {
      title: 'Push Notifications',
      url: '/notification/notice',
    },
    {
      title: 'Treats & tips',
      url: '/notification/treat',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
