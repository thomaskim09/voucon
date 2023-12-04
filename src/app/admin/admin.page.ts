import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  itemList = [
    {
      title: 'Create or modify admin',
      url: '/admin/create',
    },
    {
      title: 'Link or unlink branch',
      url: '/admin/branch',
    },
    {
      title: 'Link or unlink menu',
      url: '/admin/menu',
    },
    {
      title: 'Check user ticket history',
      url: '/admin/ticket',
    },
    {
      title: 'Create ticket',
      url: '/admin/ticket_create',
    },
    {
      title: 'Search a collection',
      url: '/admin/search',
    },
    {
      title: 'Change restaurant & voucher status',
      url: '/admin/restaurants',
    },
    {
      title: 'User status',
      url: '/admin/user',
    },
    {
      title: 'Feedback status',
      url: '/admin/feedback',
    },
    {
      title: 'Tags modify',
      url: '/admin/tags',
    },
    {
      title: 'Addresses modify',
      url: '/admin/address',
    },
    {
      title: 'Update app version',
      url: '/admin/version',
    }
  ];

  constructor() { }

  ngOnInit() {

  }

}
