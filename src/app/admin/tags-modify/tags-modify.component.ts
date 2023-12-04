import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/providers/common/common.service';
import { AdminService } from 'src/app/providers/admin/admin.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { environment } from '../../providers/environments/environment';

class Port {
  public id: string;
  public name: string;
}

@Component({
  selector: 'app-tags-modify',
  templateUrl: './tags-modify.component.html',
  styleUrls: ['./tags-modify.component.scss'],
})
export class TagsModifyComponent implements OnInit, OnDestroy {

  // Form
  form: FormGroup;

  // JS Properties
  tagId: string;
  resList: any;
  foodList: any;

  // Searchable select
  resTypePorts: Port[];
  foodTypePorts: Port[];

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.tagId = environment.isProd ? '5d3c62494599573810b84a54' : '5c01fb57497a896d50f49876';
    this.form = this.setUpFormControl();
    this.setUpAllTypes();
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
      resTypePort: [''],
      foodTypePort: [''],
    });
  }

  private setUpAllTypes() {
    this.adminService.getAllType().pipe(untilDestroyed(this)).subscribe(res => {
      this.resList = res.details.restaurantTypes;
      this.resTypePorts = this.processList(this.resList);
      this.foodList = res.details.foodTypes;
      this.foodTypePorts = this.processList(this.foodList);
    });
  }

  private processList(list) {
    return list.map(val => ({
      id: val._id,
      name: `${val.name} (${val.counter})`
    }));
  }

  async confirm() {
    if (await this.commonService.presentAlert()) {
      const vl = this.form.value;
      const object = {};
      object['type'] = vl.type;
      switch (vl.action) {
        case 'add': {
          object['content'] = vl.add;
          this.adminService.addType(this.tagId, object).pipe(untilDestroyed(this)).subscribe(val => {
            this.reset(`New item added to ${vl.type}`, val);
          });
          break;
        }
        case 'rename': {
          object['content'] = vl.rename;
          object['childId'] = (vl.type === 'resType') ? vl.resTypePort.id : vl.foodTypePort.id;
          this.adminService.renameType(this.tagId, object).pipe(untilDestroyed(this)).subscribe(val => {
            this.reset(`Item rename to ${vl.rename}`, val);
          });
          break;
        }
        case 'delete': {
          object['childId'] = (vl.type === 'resType') ? vl.resTypePort.id : vl.foodTypePort.id;
          this.adminService.deleteType(this.tagId, object).pipe(untilDestroyed(this)).subscribe(val => {
            this.reset(`Item deleted`, val);
          });
          break;
        }
      }
    }
  }

  private reset(text, val) {
    this.commonService.presentToast(text);
    this.resetList(val, this.form.value);
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }

  private resetList(doc, fv) {
    if (fv.type === 'resType') {
      this.resList = doc.details.restaurantTypes;
      this.resTypePorts = this.processList(this.resList);
    } else {
      this.foodList = doc.details.foodTypes;
      this.foodTypePorts = this.processList(this.foodList);
    }
  }
}
