import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { CouponItem } from '../../models/coupon-item.model';
import { Constants } from '../../models/constants.model';

@IonicPage()
@Component({
  selector: 'page-my-coupon',
  templateUrl: 'my-coupon.html',
})
export class MyCouponPage {

  coupons: CouponItem[];
  couponsExpired: CouponItem[];
  couponsUsed: CouponItem[];

  mobile: string;
  couponType: any = '1';
  baseUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				private storage: Storage, @Inject('API_BASE_URL') private apiUrl: string, private cf: ChangeDetectorRef) 
  {
  	this.coupons = new Array<CouponItem>();
  	this.couponsExpired = new Array<CouponItem>();
  	this.couponsUsed = new Array<CouponItem>();

  	this.baseUrl = this.apiUrl;
  }

  ionViewDidLoad() {
    this.storage.ready().then(() => {
    	this.storage.get(Constants.USER_MOBILE_KEY).then((m) => {
    		if(m) { 
    			this.mobile =m;

    			// get coupons from server
    			this.vjApi.showLoader();
    			this.vjApi.getCouponsByMobile(this.mobile).subscribe((c) => {
    				console.log(c);
    				if(c) {
    					this.coupons = c;
    					this.coupons.forEach((coupon) => {
    						if(coupon.expired) {
    							this.couponsExpired.push(coupon);
    						} else if(coupon.pivot.quantity == 0) {
    							this.couponsUsed.push(coupon);
    						}
    					})
    				}
    			});
    			this.vjApi.hideLoader();
    		}
    	})
    })
  }

  segmentChanged(){
    this.cf.detectChanges();
  }

}
