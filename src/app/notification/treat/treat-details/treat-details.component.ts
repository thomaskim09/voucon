import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/providers/notification/notification.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { format, formatDistanceStrict, parseISO } from 'date-fns';

@Component({
  selector: 'app-treat-details',
  templateUrl: './treat-details.component.html',
  styleUrls: ['./treat-details.component.scss'],
  providers: [Clipboard]
})
export class TreatDetailsComponent implements OnInit, OnDestroy {

  item: any;

  constructor(
    public route: ActivatedRoute,
    public notificationService: NotificationService,
    public clipboard: Clipboard,
    public commonService: CommonService) { }

  ngOnInit() {
    const treatId = this.route.snapshot.paramMap.get('id');
    this.getTreatDetails(treatId);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private getTreatDetails(treatId) {
    this.notificationService.getTreatDetails(treatId).pipe(untilDestroyed(this)).subscribe(val => {
      this.item = val;
    });
  }

  copyText(id) {
    if (id) {
      this.clipboard.copy(id);
      this.commonService.presentToast(`${id} copied`);
    }
  }

  getDate(time) {
    return format(parseISO(time), 'dd MMM yyyy (hh:mm a)');
  }

  getFromNow(time) {
    return this.setUpLocale(formatDistanceStrict(parseISO(time), new Date()));
  }

  getHideIdentity(isAnonymous) {
    return isAnonymous ? 'Anonymous' : 'Open Identity';
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
