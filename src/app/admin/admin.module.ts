import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { IonicModule } from '@ionic/angular';

import { AdminPage } from './admin.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { AdminCreateComponent } from './admin-create/admin-create.component';
import { RestaurantVoucherComponent } from './restaurant-voucher/restaurant-voucher.component';
import { TagsModifyComponent } from './tags-modify/tags-modify.component';
import { AddressModifyComponent } from './address-modify/address-modify.component';
import { UserStatusComponent } from './user-status/user-status.component';
import { SearchComponent } from './search/search.component';
import { FeedbackStatusComponent } from './feedback-status/feedback-status.component';
import { VersionComponent } from './version/version.component';
import { UserTicketComponent } from './user-ticket/user-ticket.component';
import { AdminBranchComponent } from './admin-branch/admin-branch.component';
import { MenuLinkComponent } from './menu-link/menu-link.component';
import { TicketCreateComponent } from './ticket-create/ticket-create.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'create',
    component: AdminCreateComponent
  },
  {
    path: 'branch',
    component: AdminBranchComponent
  },
  {
    path: 'menu',
    component: MenuLinkComponent
  },
  {
    path: 'ticket',
    component: UserTicketComponent
  },
  {
    path: 'ticket_create',
    component: TicketCreateComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'restaurants',
    component: RestaurantVoucherComponent
  },
  {
    path: 'user',
    component: UserStatusComponent
  },
  {
    path: 'feedback',
    component: FeedbackStatusComponent
  },
  {
    path: 'tags',
    component: TagsModifyComponent
  },
  {
    path: 'address',
    component: AddressModifyComponent
  },
  {
    path: 'version',
    component: VersionComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    PrettyJsonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdminPage,
    AdminCreateComponent,
    AdminBranchComponent,
    UserTicketComponent,
    RestaurantVoucherComponent,
    TagsModifyComponent,
    AddressModifyComponent,
    UserStatusComponent,
    SearchComponent,
    FeedbackStatusComponent,
    VersionComponent,
    MenuLinkComponent,
    TicketCreateComponent
  ]
})
export class AdminPageModule { }
