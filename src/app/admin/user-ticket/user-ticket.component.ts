import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/providers/common/common.service';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { parseISO, format } from 'date-fns/esm';

class Port {
  public id: string;
  public name: string;
  public content: any;
}

@Component({
  selector: 'app-user-ticket',
  templateUrl: './user-ticket.component.html',
  styleUrls: ['./user-ticket.component.scss'],
})
export class UserTicketComponent implements OnInit, OnDestroy {

  form: FormGroup;

  rawList: any = [];
  ticketList: any;
  userPorts: Port[];

  // Infinite scroll
  pageNum: any = 1;
  pageSize: any = 10;
  disableInfiniteScroll: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public commonService: CommonService,
    public adminService: AdminService) { }

  ngOnInit() {
    this.form = this.setUpForm();
    this.setUpUserList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  loadMore(infiniteScroll) {
    this.setUpTicketsList(infiniteScroll);
  }

  private setUpForm() {
    return this.formBuilder.group({
      userId: ['', Validators.required],
    });
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

  private setUpTicketsList(infiniteScroll?) {
    const userId = this.form.get('userId').value.id;
    this.adminService.getTicketsList(userId, this.pageSize, this.pageNum).pipe(untilDestroyed(this)).subscribe(val => {
      if (infiniteScroll) {
        infiniteScroll.target.complete();
        this.rawList = [...this.rawList, ...val];
      } else {
        this.rawList = val;
      }

      this.ticketList = this.rawList.map(val2 => ({
        id: val2._id,
        name: this.processName(val2),
        createdTime: format(parseISO(val2.createdTime), 'dd-MM-yyyy hh:mma'),
        status: val2.status,
      }));

      if (val.length < this.pageSize) {
        this.pageNum = 1;
        this.disableInfiniteScroll = true;
      } else {
        this.pageNum++;
        this.disableInfiniteScroll = false;
      }
    });
  }

  private processName(val2) {
    if (val2.voucherId) {
      return val2.voucherDetails.voucherName;
    } else if (val2.reservationId) {
      return 'Reservation ' + format(parseISO(val2.reservationDetails.date), 'dd-MM-yyyy') + ' ' + val2.reservationDetails.time;
    }
  }

  async getList() {
    if (await this.commonService.presentAlert()) {
      this.setUpTicketsList();
    }
  }

}
