import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { CouponNewComer } from '../../models/coupon-newcomer-model';

/**
 * Generated class for the CouponForNewComerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coupon-for-new-comer',
  templateUrl: 'coupon-for-new-comer.html',
})
export class CouponForNewComerPage {

  couponNewComers: CouponNewComer[];
  title: string;
  baseUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string) {
  	this.couponNewComers = new Array<CouponNewComer>(new CouponNewComer());
  	this.baseUrl = this.apiUrl;
  }

  ionViewDidLoad() {
  	this.vjApi.getPageInforOfNewComer().subscribe((data) => {
  		if(data.length > 0) {
  			console.log(data);
  			this.couponNewComers = data;
  			this.title = this.couponNewComers[0].description;
  		}
  	})

  }

}
