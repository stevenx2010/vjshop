import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { CouponNewComer } from '../../models/coupon-newcomer-model';

import { Loader } from '../../utils/loader';

@IonicPage()
@Component({
  selector: 'page-coupon-for-new-comer',
  templateUrl: 'coupon-for-new-comer.html',
})
export class CouponForNewComerPage {

  couponNewComers: CouponNewComer[];
  title: string;
  baseUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, 
            @Inject('API_BASE_URL') private apiUrl: string, private loadingCtrl: LoadingController) {
  	this.couponNewComers = new Array<CouponNewComer>(new CouponNewComer());
  	this.baseUrl = this.apiUrl;
  }

  ionViewWillLoad() {
    let loader = new Loader(this.loadingCtrl);
    loader.show();
  	this.vjApi.getPageInforOfNewComer().subscribe((data) => {
  		if(data.length > 0) {
  			console.log(data);
  			this.couponNewComers = data;
  			this.title = this.couponNewComers[0].description;
  		}
      loader.hide();
  	}, (err) => {
      loader.hide();
      console.log('Coupon For New User: ionViewWillLoad Error');
    });
  }
}
