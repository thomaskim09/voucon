import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

class Port {
  public id: string;
  public name: string;
  public content: any;
}

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
})
export class VersionComponent implements OnInit, OnDestroy {

  form: FormGroup;

  // Searchable select
  appList: Port[];

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      action: ['', Validators.required],
      appType: ['', Validators.required],
      appName: ['', Validators.required],
      version: ['', Validators.required],
    });
  }

  private onChanges() {
    this.form.get('action').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val === 'create') {
        this.form.get('appType').disable({ emitEvent: false });
        this.form.get('appName').enable();
      } else {
        this.form.get('appType').enable({ emitEvent: false });
        this.form.get('appName').disable();
        this.setUpAppList();
      }
    });

    this.form.get('appType').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.form.get('version').setValue(val.content.details.currentVersion);
    });
  }

  private setUpAppList() {
    this.adminService.getAppList().pipe(untilDestroyed(this)).subscribe(val => {
      this.appList = val.map(val2 => ({
        id: val2._id,
        name: `${val2.details.appName} (${val2.details.currentVersion})`,
        content: val2
      }));
    });
  }

  async addAppVersion() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      const appName = fv.appName;
      const version = fv.version;

      this.adminService.createAppVersion(appName, version).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('New app added');
        this.reset();
      });
    }
  }

  async updateVersion() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      const appId = fv.appType.id;
      const version = fv.version;

      this.adminService.updateAppVersion(appId, version).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('Version updated');
        this.reset();
      });
    }
  }

  private reset() {
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }

}
