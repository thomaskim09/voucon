import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/providers/common/common.service';
import { AdminService } from 'src/app/providers/admin/admin.service';

class Port {
  id: string;
  name: string;
  content: any;
}

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss'],
})
export class TicketCreateComponent implements OnInit, OnDestroy {

  // Searchable select
  usersList: Port[];
  restaurantsList: Port[];
  vouchersList: Port[];

  voucherDetails: any;
  username: string;
  totalPrice: number;
  quantity: number = 1;
  totalVoucherPrice: number;
  totalGroupPrice: number;
  initialSave: number;
  valueSave: number;
  quantityLeftToFirstGroup: number;
  stillCanPurchase: number;
  newPricePerUnit: number;
  totalPriceValue: number;
  totalPriceString: string;
  eWalletOffer: number = 1;
  paymentOffer: number;

  // Form
  form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.form = this.setUpFormControl();
    this.setUpUserList();
    this.setUpRestaurantList();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpFormControl() {
    return this.formBuilder.group({
      userId: ['', Validators.required],
      restaurantId: ['', Validators.required],
      voucherId: ['', Validators.required],
      paymentMethod: ['BOOST', Validators.required],
      quantity: [1, Validators.required]
    });
  }

  private setUpUserList() {
    this.adminService.getUserList().pipe(untilDestroyed(this)).subscribe(val => {
      this.usersList = val.map(val2 => ({
        id: val2._id,
        name: `${val2.details.username} (${val2.status})`,
        content: val2
      }));
    });
  }

  private setUpRestaurantList() {
    this.adminService.getAdminList().pipe(untilDestroyed(this)).subscribe(val => {
      this.restaurantsList = val.map(val2 => ({
        id: val2.restaurantId,
        name: val2.restaurantName || `(${val2.username})`
      }));
    });
  }

  private onChanges() {
    this.form.get('userId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.username = val.content.details.username;
      }
    });
    this.form.get('restaurantId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.setUpVoucherList(val.id, 'active');
      }
    });
    this.form.get('voucherId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.getVoucherDetails(val.id);
      }
    });
    this.form.get('paymentMethod').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.checkPaymentMethodOffer(val);
      }
    });
    this.form.get('quantity').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.quantity = val;
        this.calculatePrice();
      }
    });
  }

  private setUpVoucherList(restaurantId, statusType) {
    this.adminService.getVoucherList(restaurantId, statusType).pipe(untilDestroyed(this)).subscribe(val => {
      if (!val) {
        this.commonService.presentToast('No result found');
        return;
      }
      this.vouchersList = val.map(val2 => ({
        id: val2._id,
        name: `${val2.details.voucherName} (${val2.status})`,
        content: val2
      }));
    });
  }

  private checkPaymentMethodOffer(paymentMethod) {
    const total = (this.quantity * this.newPricePerUnit);
    if (paymentMethod === 'BOOST') {
      this.paymentOffer = this.roundUpPrice((total * this.eWalletOffer) / 100);
      this.totalPriceValue = (total - this.paymentOffer);
      this.totalPriceString = (total - this.paymentOffer).toFixed(2);
    } else {
      this.paymentOffer = undefined;
      this.newPricePerUnit = this.newPricePerUnit;
      this.totalPriceValue = total;
      this.totalPriceString = total.toFixed(2);
    }
  }

  private getVoucherDetails(voucherId) {
    this.adminService.getVoucherDetails(voucherId, this.form.value.userId.id).pipe(untilDestroyed(this)).subscribe(val => {
      if (!val) {
        this.commonService.presentToast('No result found');
        return;
      }
      const de = val.details;
      if (de.userPurchaseHistory && de.userPurchaseHistory.length === 0) {
        de.userPurchaseHistory = undefined;
      }
      this.voucherDetails = {
        restaurantId: val.restaurantId,
        restaurantList: val.restaurantList,
        voucherId: val._id,
        newPrice: de.newPrice,
        limitedQuantity: de.limitedQuantity,
        limitedQuantityPerUser: de.limitedQuantityPerUser,
        userPurchaseHistory: de.userPurchaseHistory,
        groupVoucherDetails: de.groupVoucherDetails,
        voucherDetails: {
          voucherImage: de.voucherImage,
          voucherName: de.voucherName,
          newPrice: de.newPrice,
          basePrice: de.basePrice,
          validUntil: de.voucherRules.validUntil,
          quantityUnit: de.quantityUnit,
          limitPerDay: de.limitPerDay
        },
        // Check voucher
        quantitySold: de.quantitySold,
        soldOutTime: de.soldOutTime,
        limitedEndTime: de.limitedEndTime,
        startSellingTime: de.startSellingTime,
        validUntil: de.voucherRules.validUntil
      };

      this.newPricePerUnit = de.newPrice;
      this.totalPriceValue = de.newPrice;
      this.totalVoucherPrice = de.newPrice;
      this.totalGroupPrice = de.newPrice;
      if (de.groupVoucherDetails) {
        this.calculateTotalGroupPrice(de.newPrice, de.groupVoucherDetails);
      }
      this.stillCanPurchase = this.checkStillCanPurchase();

      this.calculatePrice();
    });
  }

  private checkStillCanPurchase() {
    // Cleaner code
    const de = this.voucherDetails;
    const LQ = de.limitedQuantity;
    const LQPU = de.limitedQuantityPerUser;
    const UPH = de.userPurchaseHistory;
    const QS = de.quantitySold;

    if (LQ && LQPU && UPH) { // Two limit for old user
      return this.calculateStillCanPurchase(LQ, QS, LQPU, UPH[0].quantityPurchased);
    } else if (!LQ && LQPU && UPH) { // For old user
      return this.calculateStillCanPurchase(LQ, QS, LQPU, UPH[0].quantityPurchased);
    } else if (LQ && LQPU && !UPH) { // Two limits for new user
      return this.calculateStillCanPurchase(LQ, QS, LQPU);
    } else if (LQ && !LQPU && !UPH) { // Only limit quantity for new user
      return this.calculateStillCanPurchase(LQ, QS);
    } else if (!LQ && LQPU && !UPH) { // Only limit per user for new user
      return LQPU;
    }
  }

  private calculateStillCanPurchase(limitedQuantity = 0, quantitySold = 0, limitedQuantityPerUser = 0, quantityPurchased = 0) {
    const left = limitedQuantity - quantitySold;
    const right = limitedQuantityPerUser - quantityPurchased;
    return (right === 0 || left <= right) ? left : right;
  }

  private calculatePrice() {
    const ip = this.voucherDetails;
    if (ip.groupVoucherDetails) {
      this.newPricePerUnit = this.calculateTotalGroupPrice(ip.newPrice, ip.groupVoucherDetails);
      this.totalPrice = this.totalGroupPrice;
    } else if (ip.limitedQuantity || ip.limitedQuantityPerUser) {
      if (this.quantity < this.stillCanPurchase) {
        this.newPricePerUnit = ip.newPrice;
        this.totalPrice = this.roundUpPrice(this.quantity * ip.newPrice);
      }
    } else if (!ip.groupVoucherDetails && !ip.limitedQuantity && !ip.limitedQuantityPerUser) {
      this.newPricePerUnit = ip.newPrice;
      this.totalPrice = this.roundUpPrice(this.quantity * ip.newPrice);
    }

    this.checkPaymentMethodOffer(this.form.value.paymentMethod);
  }

  private calculateTotalGroupPrice(newPrice, groupDetails) {
    const arrayResult = groupDetails.map(val => {
      if (this.quantity >= val.groupQuantity) {
        this.totalGroupPrice = this.roundUpPrice(this.quantity * val.groupPricePerUnit);
        this.valueSave = this.roundUpPrice(this.quantity * (newPrice - val.groupPricePerUnit));
        return val.groupPricePerUnit;
      } else if (this.quantity < groupDetails[0].groupQuantity) {
        this.totalGroupPrice = this.roundUpPrice(this.quantity * newPrice);
        this.initialSave = this.roundUpPrice(groupDetails[0].groupQuantity * (newPrice - groupDetails[0].groupPricePerUnit));
        this.quantityLeftToFirstGroup = groupDetails[0].groupQuantity - this.quantity;
        return newPrice;
      }
    });
    const filteredArray = arrayResult.filter(val => val !== undefined);
    return Math.min(...filteredArray);
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

  private checkExist(value) {
    return value ? true : false;
  }

  private prepareTicketObject(ticketId) {
    const fv = this.form.value;
    const de = this.voucherDetails;
    return {
      ticketId: ticketId,
      restaurantId: de.restaurantId,
      restaurantList: de.restaurantList,
      userId: fv.userId.id,
      quantity: this.quantity,
      pricePerUnit: this.newPricePerUnit,
      paymentOffer: de.newPrice === 0 ? undefined : this.paymentOffer,
      paymentMethod: de.newPrice === 0 ? undefined : fv.paymentMethod,
      voucherId: fv.voucherId.id,
      voucherDetails: de.voucherDetails,
      username: this.username,
      isLimitedQuantityPerUser: this.checkExist(de.limitedQuantityPerUser),
      isPurchasedBefore: this.checkExist(de.userPurchaseHistory),
    };
  }

  async createTicket() {
    if (await this.commonService.presentAlert()) {
      const fv = this.form.value;
      this.adminService.checkVoucherAvailability(fv.voucherId.id, fv.userId.id, this.quantity).pipe(untilDestroyed(this)).subscribe(val => {
        const ticketDetails = this.prepareTicketObject(val.ticketId);
        this.adminService.createNewTicketVoucher(ticketDetails, 'full').pipe(untilDestroyed(this)).subscribe(val2 => {
          this.commonService.presentToast('Ticket created');
          this.reset();
        });
      }, err => this.commonService.presentToast(err.error.error));
    }
  }

  private reset() {
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }

}
