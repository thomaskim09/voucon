
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminPageModule' },
  { path: 'ad-manager', loadChildren: './ad-manager/ad-manager.module#AdManagerPageModule' },
  { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule' },
  { path: 'generator', loadChildren: './generator/generator.module#GeneratorPageModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
