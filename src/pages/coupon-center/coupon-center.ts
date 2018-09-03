import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { CouponType } from '../../models/coupon-type-model';
import { Coupon } from '../../models/coupon-model';



/**
 * Generated class for the CouponCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coupon-center',
  templateUrl: 'coupon-center.html',
})
export class CouponCenterPage {

  baseUrl: string;
  couponTypes: CouponType[];
  couponsByType: Array<Coupon[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string) {
  	this.couponTypes = new Array<CouponType>(new CouponType());
  	this.couponsByType= new Array<Coupon[]>();
  	this.baseUrl = this.apiUrl;
  }

  ionViewDidLoad() {
  	this.vjApi.showLoader();
    this.vjApi.getCouponAllTypes().subscribe((data) => {
    	if(data.length > 0) {
    		this.couponTypes = data;

    		for(let couponType of this.couponTypes) {
    			this.vjApi.getCouponsByTypeId(couponType.id).subscribe((data) => {
    				if(data.length > 0) {
    					this.couponsByType.push(data);
    				}
    			})
    		}


    	}
    });

    this.vjApi.hideLoader();
  }

}
