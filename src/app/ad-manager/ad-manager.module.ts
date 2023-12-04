import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdManagerPage } from './ad-manager.page';
import { AdsComponent } from './ads/ads.component';
import { IonicSelectableModule } from 'ionic-selectable';
import { RatingComponent } from './rating/rating.component';

const routes: Routes = [
  {
    path: '',
    component: AdManagerPage
  },
  {
    path: 'ads',
    component: AdsComponent
  },
  {
    path: 'rating',
    component: RatingComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdManagerPage,
    AdsComponent,
    RatingComponent
  ]
})
export class AdManagerPageModule { }
