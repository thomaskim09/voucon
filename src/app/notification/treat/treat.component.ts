import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/providers/notification/notification.service';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { CommonService } from 'src/app/providers/common/common.service';

@Component({
  selector: 'app-treat',
  templateUrl: './treat.component.html',
  styleUrls: ['./treat.component.scss'],
})
export class TreatComponent implements OnInit, OnDestroy {

  treatList: any;

  // Infinite scroll
  pageNum: any = 1;
  pageSize: any = 15;
  disableInfiniteScroll: boolean = false;
  isSecondCounter: any = 0;

  // Controller
  refresherTimer: any;

  constructor(
    public notificationService: NotificationService,
    public router: Router,
    public commonService: CommonService) { }

  ngOnInit() {
    this.setUpTreatList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.refresherTimer);
  }

  doRefresh(refresher) {
    this.pageNum = 1;
    this.disableInfiniteScroll = false;
    this.setUpTreatList(false, refresher);
    // Refresher Timeout
    clearTimeout(this.refresherTimer);
    this.refresherTimeOut(refresher);
  }

  loadMore(infiniteScroll) {
    this.setUpTreatList(infiniteScroll);
  }

  private refresherTimeOut(refresher) {
    this.refresherTimer = setTimeout(() => {
      this.commonService.presentToast('Request time out');
      refresher.target.complete();
    }, 3000);
  }

  private setUpTreatList(infiniteScroll?, refresher?) {
    this.notificationService.getTreatList(this.pageSize, this.pageNum, refresher).pipe(untilDestroyed(this)).subscribe(val => {
      if (refresher) {
        clearTimeout(this.refresherTimer);
        refresher.target.complete();
        if (this.isSecond()) { return; }
      } else if (infiniteScroll) {
        infiniteScroll.target.complete();
      }

      this.treatList = (infiniteScroll) ? [...this.treatList, ...val] : val;

      if (val.length < this.pageSize) {
        this.pageNum = 1;
        this.disableInfiniteScroll = true;
      } else {
        this.pageNum++;
        this.disableInfiniteScroll = false;
      }
    }, error => {
      this.commonService.presentToast('Something went wrong');
      if (refresher) { refresher.complete(); }
    });
  }

  private isSecond() {
    this.isSecondCounter++;
    if (this.isSecondCounter > 1) {
      this.isSecondCounter = 0;
      return false;
    } else {
      return true;
    }
  }

  viewTreat(id) {
    this.router.navigateByUrl(`notification/treat/${id}`);
  }

  getTime(time) {
    return this.setUpLocale(formatDistanceStrict(parseISO(time), new Date()));
  }

  private setUpLocale(time: string) {
    const timeString = time.split(' ');
    let result = '';
    timeString.map(val => result += (+val === +val) ? val : timeFormat(val) + ' ');
    function timeFormat(word) {
      switch (word) {
        case 'seconds': case 'second': return 's';
        case 'minutes': case 'minute': return 'm';
        case 'hours': case 'hour': return 'h';
        case 'days': case 'day': return 'd';
        case 'months': case 'month': return 'M';
        case 'years': case 'year': return 'Y';
        default: return '';
      }
    }
    return result;
  }

}
