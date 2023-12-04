import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/providers/common/common.service';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

class Port {
  public id: string;
  public name: string;
  public content: any;
}

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
})
export class UserStatusComponent implements OnInit, OnDestroy {

  // Searchable select
  userPorts: Port[];
  userPort: Port;

  // Form
  form: FormGroup;
  status: string;

  // Controller
  timer: any;

  constructor(
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.setUpUserList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private setUpUserList() {
    this.adminService.getUserList().pipe(untilDestroyed(this)).subscribe(val => {
      this.userPorts = val.map(val2 => ({
        id: val2._id,
        name: `${val2.details.username} (${val2.status})`,
        content: val2
      }));
    });
  }

  async updateStatus() {
    if (await this.commonService.presentAlert()) {
      const object = {
        userId: this.userPort.id,
        status: this.status
      };
      this.adminService.updateUserStatus(object).pipe(untilDestroyed(this)).subscribe(val => {
        this.commonService.presentToast('User\'s status updated');
        this.reset();
        this.timer = setTimeout(() => {
          this.setUpUserList();
        }, 500);
      });
    }
  }

  userPortChange() {
    this.status = this.userPort.content.status;
    this.setUpUserList();
  }

  private reset() {
    this.userPort = undefined;
    this.status = undefined;
  }

}
