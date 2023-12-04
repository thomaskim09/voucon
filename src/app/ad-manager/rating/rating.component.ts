import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AdManagerService } from 'src/app/providers/ad-manager/ad-manager.service';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { format } from 'date-fns';

class Port {
  public id: string;
  public name: string;
  public content: any;
}

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit, OnDestroy {

  // Searchable select
  resPorts: Port[];
  resPort: Port;

  type: string;
  startDate: string;
  endDate: string;
  startDateDisplay: string;
  endDateDisplay: string;
  restaurantId: string;
  rating: number;

  // HTML properties
  jsonResult: any;

  constructor(
    public adManagerService: AdManagerService,
    public adminService: AdminService,
    public commonService: CommonService,
    public datePicker: DatePicker) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  getPostList() {
    if (this.type === 'update') {
      this.setUpRestaurantList();
    }
  }

  private setUpRestaurantList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.resPorts = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName ? `${val2.restaurantName} (${val2.rating || 'No rating'})` : val2.username,
        content: val2
      }));
    });
  }

  resPortChange(event: { component: IonicSelectableComponent, value: any }) {
    this.restaurantId = event.value.id;
    this.rating = event.value.content.rating;
  }

  showStartPicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {
      this.startDate = date.toISOString();
      this.startDateDisplay = format(date, 'DD MMM YYYY');
    },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  showEndPicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {
      this.endDate = date.toISOString();
      this.endDateDisplay = format(date, 'DD MMM YYYY');
    },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  async updateRating() {
    if (await this.commonService.presentAlert()) {
      const object = {
        restaurantId: this.restaurantId,
        rating: this.rating
      };
      this.adManagerService.updateRating(object).pipe(untilDestroyed(this)).subscribe(val => {
        this.reset();
        this.commonService.presentToast('Restaurant\'s rating updated');
      });
    }
  }

  async recalculateRating() {
    if (await this.commonService.presentAlert()) {
      const object = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      this.adManagerService.recalculateRating(object).pipe(untilDestroyed(this)).subscribe(val => {
        this.jsonResult = val;
        this.reset();
        this.commonService.presentToast('Rating recalculated');
      });
    }
  }

  private reset() {
    this.resPort = undefined;
    this.rating = undefined;
    this.type = undefined;
  }

}
