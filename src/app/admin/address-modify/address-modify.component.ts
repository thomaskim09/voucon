import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/providers/common/common.service';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { untilDestroyed } from 'ngx-take-until-destroy';

class Port {
  public id: string;
  public name: string;
}

@Component({
  selector: 'app-address-modify',
  templateUrl: './address-modify.component.html',
  styleUrls: ['./address-modify.component.scss'],
})
export class AddressModifyComponent implements OnInit, OnDestroy {

  // Form
  form: FormGroup;

  // Searchable select
  statePorts: Port[];
  cityPorts: Port[];
  postcodePorts: Port[];
  areaPorts: Port[];
  placePorts: Port[];
  streetPorts: Port[];

  // HTML controller
  needState: boolean = false;
  needCity: boolean = false;
  needPostcode: boolean = false;
  needArea: boolean = false;
  needPlace: boolean = false;
  needStreet: boolean = false;

  // JS properties
  allList: any = [];
  allStateList: any = [];
  allCityList: any = [];
  allPostcodeList: any = [];
  allAreaList: any = [];
  allPlaceList: any = [];
  allStreetList: any = [];

  constructor(
    public formBuilder: FormBuilder,
    public commonService: CommonService,
    public adminService: AdminService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.onChanges();
    this.setUpAddressList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      type: ['', Validators.required],
      action: ['', Validators.required],
      add: [''],
      rename: [''],
      statePort: [''],
      cityPort: [''],
      postcodePort: [''],
      areaPort: [''],
      placePort: [''],
      streetPort: [''],
      shortName: [''],
      isDefault: [false],
      longitude: [''],
      latitude: [''],
    });
  }

  private onChanges() {
    this.form.get('type').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      switch (val) {
        case 'state': this.toggleSelect(true, false, false, false, false, false); break;
        case 'city': this.toggleSelect(true, true, false, false, false, false); break;
        case 'postcode': this.toggleSelect(true, true, true, false, false, false); break;
        case 'area': this.toggleSelect(true, true, true, true, false, false); break;
        case 'place': this.toggleSelect(true, true, true, true, true, false); break;
        case 'street': this.toggleSelect(true, true, true, true, false, true); break;
      }
    });

    function processList(val, allList) {
      const filtered = allList.filter(val2 => {
        return val2.parentId === val.id;
      });
      return filtered.map(val2 => ({
        id: val2.id,
        name: val2.name
      }));
    }

    this.form.get('statePort').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.cityPorts = processList(val, this.allCityList);
    });

    this.form.get('cityPort').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.postcodePorts = processList(val, this.allPostcodeList);
    });

    this.form.get('postcodePort').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.areaPorts = processList(val, this.allAreaList);
    });

    this.form.get('areaPort').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.placePorts = processList(val, this.allPlaceList);
      this.streetPorts = processList(val, this.allStreetList);
    });
  }

  private setUpAddressList() {
    this.adminService.getAllAddress().pipe(untilDestroyed(this)).subscribe(val => {
      this.allList = val;
      this.assignToEachList(this.allList);
    });
  }

  private assignToEachList(list) {
    this.allStateList = [];
    this.allCityList = [];
    this.allPostcodeList = [];
    this.allAreaList = [];
    this.allPlaceList = [];
    this.allStreetList = [];
    // allStateList
    list.map(val2 => {
      this.allStateList.push({
        id: val2._id,
        name: val2.state
      });
      // allCityList
      val2.cities.map(val3 => {
        this.allCityList.push({
          id: val3._id,
          name: val3.city,
          parentId: val2._id
        });
        // allPostcodeList
        val3.postcodes.map(val4 => {
          this.allPostcodeList.push({
            id: val4._id,
            name: val4.postcode,
            parentId: val3._id
          });
          // allAreaList
          val4.areas.map(val5 => {
            this.allAreaList.push({
              id: val5._id,
              name: val5.area,
              parentId: val4._id
            });
            // allPlaceList
            val5.places.map(val6 => {
              this.allPlaceList.push({
                id: val6._id,
                name: val6.place,
                parentId: val5._id
              });
            });
            // allStreetList
            val5.streets.map(val6 => {
              this.allStreetList.push({
                id: val6._id,
                name: val6.street,
                parentId: val5._id
              });
            });
          });
        });
      });
    });
    this.statePorts = this.allStateList;
  }

  cityPortChange(event: { component: IonicSelectableComponent, value: any }) {
    const vl = this.form.value;
    if (vl.type === 'city' && vl.action !== 'delete') {
      const filteredCity = this.allList.map(val => val.cities.find(val2 => val2._id === event.value.id));
      const list = filteredCity.filter(Boolean)[0];
      this.form.patchValue({
        add: list.city,
        rename: list.city,
        shortName: list.shortName,
        isDefault: list.isDefault,
        longitude: list.location.longitude,
        latitude: list.location.latitude,
      });
    }
  }

  async confirm() {
    if (await this.commonService.presentAlert()) {
      const vl = this.form.value;
      const object = {};
      object['type'] = vl.type;
      const content = {
        shortName: vl.shortName,
        isDefault: vl.isDefault ? true : false,
        location: {
          latitude: vl.latitude,
          longitude: vl.longitude
        }
      };
      switch (vl.action) {
        case 'add': {
          content['name'] = vl.add;
          object['content'] = content;
          object['stateId'] = vl.statePort ? vl.statePort.id : undefined;
          object['parentId'] = this.getParentId(vl.type, vl);
          this.adminService.addAddress(object).pipe(untilDestroyed(this)).subscribe(val => {
            this.reset(`New ${vl.type} added`, val);
          });
          break;
        }
        case 'rename': {
          content['name'] = vl.rename;
          object['content'] = content;
          object['stateId'] = vl.statePort.id;
          object['childId'] = this.getChildId(vl.type, vl);
          this.adminService.renameAddress(object).pipe(untilDestroyed(this)).subscribe(val => {
            this.reset(`${vl.type} renamed`, val);
          });
          break;
        }
        case 'delete': {
          object['stateId'] = vl.statePort.id;
          object['parentId'] = this.getParentId(vl.type, vl);
          object['childId'] = this.getChildId(vl.type, vl);
          this.adminService.deleteAddress(object).pipe(untilDestroyed(this)).subscribe(val => {
            this.reset(`${vl.type} deleted`, val);
          });
          break;
        }
      }
    }
  }

  private reset(text, val) {
    this.commonService.presentToast(text);
    this.resetAllList(val, this.form.value);
    this.form.reset('', { emitEvent: false });
    this.toggleSelect(false, false, false, false, false, false);
  }

  private resetAllList(stateDoc, fv) {
    const type = fv.type;
    const action = fv.action;
    if (type === 'state' && action === 'add') {
      this.allList = [...this.allList, stateDoc];
    } else if (type === 'state' && action === 'delete') {
      this.allList = this.allList.filter(val => val._id !== stateDoc._id);
    } else {
      this.allList = this.allList.map(val => (val._id === stateDoc._id) ? stateDoc : val);
    }
    this.assignToEachList(this.allList);
  }

  private getParentId(type, vl) {
    switch (type) {
      case 'city': return vl.statePort.id;
      case 'postcode': return vl.cityPort.id;
      case 'area': return vl.postcodePort.id;
      case 'place': return vl.areaPort.id;
      case 'street': return vl.areaPort.id;
    }
  }

  private getChildId(type, vl) {
    switch (type) {
      case 'state': return vl.statePort.id;
      case 'city': return vl.cityPort.id;
      case 'postcode': return vl.postcodePort.id;
      case 'area': return vl.areaPort.id;
      case 'place': return vl.placePort.id;
      case 'street': return vl.streetPort.id;
    }
  }

  private toggleSelect(s, c, p, a, pl, st) {
    this.needState = s;
    this.needCity = c;
    this.needPostcode = p;
    this.needArea = a;
    this.needPlace = pl;
    this.needStreet = st;
  }
}
