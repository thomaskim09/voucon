import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GeneratorPage } from './generator.page';
import { OrderQrGeneratorComponent } from './order-qr-generator/order-qr-generator.component';
import { BillComponent } from './bill/bill.component';
import { SettlementComponent } from './settlement/settlement.component';
import { BillFormatComponent } from './bill/bill-format/bill-format.component';
import { ListingComponent } from './listing/listing.component';
import { IonicSelectableModule } from 'ionic-selectable';
import { ListingFormatComponent } from './listing/listing-format/listing-format.component';
import { CompanyInfoComponent } from './company-info/company-info.component';

const routes: Routes = [
  {
    path: '',
    component: GeneratorPage
  },
  {
    path: 'qr_generator',
    component: OrderQrGeneratorComponent
  },
  {
    path: 'bill',
    component: BillComponent
  },
  {
    path: 'listing',
    component: ListingComponent
  },
  {
    path: 'settlement',
    component: SettlementComponent
  },
  {
    path: 'company_info',
    component: CompanyInfoComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    GeneratorPage,
    OrderQrGeneratorComponent,
    BillComponent,
    BillFormatComponent,
    SettlementComponent,
    ListingComponent,
    ListingFormatComponent,
    CompanyInfoComponent
  ]
})
export class GeneratorPageModule { }
