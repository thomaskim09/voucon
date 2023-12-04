import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationPage } from './notification.page';
import { TreatComponent } from './treat/treat.component';
import { TreatDetailsComponent } from './treat/treat-details/treat-details.component';
import { PushNoticeComponent } from './push-notice/push-notice.component';


const routes: Routes = [
  {
    path: '',
    component: NotificationPage
  },
  {
    path: 'notice',
    component: PushNoticeComponent
  },
  {
    path: 'treat',
    component: TreatComponent
  },
  {
    path: 'treat/:id',
    component: TreatDetailsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    NotificationPage,
    PushNoticeComponent,
    TreatComponent,
    TreatDetailsComponent,
  ]
})
export class NotificationPageModule { }
