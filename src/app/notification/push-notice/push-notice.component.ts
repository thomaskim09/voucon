import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/providers/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonService } from './../../providers/common/common.service';

@Component({
  selector: 'app-push-notice',
  templateUrl: './push-notice.component.html',
  styleUrls: ['./push-notice.component.scss'],
})
export class PushNoticeComponent implements OnInit, OnDestroy {

  // Form
  form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public notificationService: NotificationService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  async pushNotice() {
    if (await this.commonService.presentAlert()) {
      const content = {
        title: this.form.value.title,
        body: this.form.value.message
      };
      this.notificationService.pushNotifications(content).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('Notifications Pushed to All Users');
      });
    }
  }
}
