import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

class Port {
  public id: string;
  public name: string;
  public content: any;
}

@Component({
  selector: 'app-feedback-status',
  templateUrl: './feedback-status.component.html',
  styleUrls: ['./feedback-status.component.scss'],
})
export class FeedbackStatusComponent implements OnInit, OnDestroy {

  // Form
  form: FormGroup;

  // Searchable select
  adminList: Port[];
  feedbackList: Port[];

  content: string;

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.setUpAdminList();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      adminId: ['', Validators.required],
      feedbackId: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  private setUpAdminList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.adminList = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName || `(${val2.username})`,
        content: '',
      }));
    });
  }

  private onChanges() {
    this.form.get('adminId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.getAllFeedbacks(val.id);
    });

    this.form.get('feedbackId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.form.get('status').setValue(val.content.status);
      this.content = val.content.content;
    });
  }

  private getAllFeedbacks(id) {
    this.adminService.getFeedbackList(id).pipe(untilDestroyed(this)).subscribe(val => {
      this.feedbackList = val.map(val2 => ({
        id: val2._id,
        name: `${val2.status} - (${val2.username}) ${val2.content}`,
        content: {
          content: val2.content,
          status: val2.status,
        }
      }));
    });
  }

  async updateFeedbackStatus() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      this.adminService.updateFeedbackStatus(fv.adminId.id, fv.feedbackId.id, fv.status).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('Status Updated');
        this.reset();
      });
    }
  }

  private reset() {
    this.content = undefined;
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }

}
