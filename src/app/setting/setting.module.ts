import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingPage } from './setting.page';
import { CacheComponent } from './cache/cache.component';

const routes: Routes = [
  {
    path: '',
    component: SettingPage
  },
  {
    path: 'cache',
    component: CacheComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SettingPage,
    CacheComponent
  ]
})
export class SettingPageModule { }
