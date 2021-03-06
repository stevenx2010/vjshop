import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, /*AlertController,*/ Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs';

import { VJAPI } from '../../services/vj.services';
import { InitEnv } from '../../utils/initEnv';
import { CouponType } from '../../models/coupon-type-model';
import { Coupon } from '../../models/coupon-model';
//import { CouponItem } from '../../models/coupon-item.model';
import { Constants } from '../../models/constants.model';

import { Loader } from '../../utils/loader';

@IonicPage()
@Component({
  selector: 'page-coupon-center',
  templateUrl: 'coupon-center.html',
})
export class CouponCenterPage {

  baseUrl: string;
  couponTypes: CouponType[];
  couponsByType: Array<Coupon[]>;

  couponWallet: Set<Coupon>;
  loggedIn: boolean = false;
  mobile: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string, 
              private storage: Storage/*, private alertCtrl: AlertController*/, private init: InitEnv, private events: Events,
              private loadingCtrl: LoadingController) 
  {
  	this.couponTypes = new Array<CouponType>();
  	this.couponsByType= new Array<Coupon[]>();
  	this.baseUrl = this.apiUrl;
    this.couponWallet = new Set<Coupon>();

    this.events.subscribe('login_success', (logged_in, mobile, shippingAddress) => {
      this.loggedIn = logged_in;
      this.mobile = mobile;
      this.getCouponsOfTheUser();
    });
  }

  ionViewWillLoad() {
    this.initEnvironment();
  }

  initEnvironment() {
    this.init.checkLogin().subscribe((data) => {
      if(data) {
        this.loggedIn = data;
        this.init.getMobile().subscribe((data) => {
          if(data) {
            this.mobile = data;
            this.getCouponsOfTheUser();
          }
        });
      } else {
        this.getListOfCoupons();
      }     
    });        
  }

  getCouponsOfTheUser() {
    this.vjApi.getCouponsByMobile(this.mobile).subscribe((coupons) => {
      if(coupons.length > 0) {
        coupons.forEach((item) =>{
          if(item.pivot.quantity == 0) item.has_used = true;
          else item.has_used = false;
          this.couponWallet.add(item);
        });

        this.storage.ready().then(() => {
          this.storage.remove(Constants.COUPON_WALLET_KEY);
          this.storage.set(Constants.COUPON_WALLET_KEY, this.couponWallet);
        });
      }
      this.getListOfCoupons();
    }, (err) => {
      console.log('Coupon Center: getCouponsOfTheUser error');
    });    
  }

 
  getListOfCoupons() {
    let loader = new Loader(this.loadingCtrl);
    loader.show();
    this.vjApi.getCouponAllTypes().subscribe((types) => {

      console.log(types);
      if(types && types.length > 0) {

        this.couponTypes = types;

        let i = 0;
        let j = 0;
        for(let couponType of this.couponTypes) {
          for(let coupon of couponType.coupons) {
            // check if this coupon has exipred
            if(!coupon.expired) {
              let now = Date.now();
              let future = (new Date(coupon.expire_date)).getTime();

              if(future < now ) {
                // expired
                this.couponTypes[i].coupons[j].expired = true;

                let status = {
                  'id': coupon.id,
                  'coupon_type_id': coupon.coupon_type_id,
                  'expired': true
                }

               // this.vjApi.showLoader();
                this.vjApi.updateCouponExpireStatus(JSON.stringify(status)).subscribe((data)=>console.log(data));    
              }
            }

            // for each coupon in CouponWallet, disable this coupon to avoid select again & to show 'taken' sign
            if(this.couponWallet) {
              this.couponWallet.forEach((item) => {
                if(item.id == coupon.id && item.coupon_type_id == coupon.coupon_type_id) {
                  if(this.couponTypes[i].coupons[j])  {
                    this.couponTypes[i].coupons[j].btn_disabled = true;
                    this.couponTypes[i].coupons[j].z_index = 2;
                  }
                }
              });
            }

            j++;
          }
          j = 0;
          i++;
        }
      }
      loader.hide();
    }, (err) => {
      loader.hide();
      console.log('Coupon Center: getListOfCoupons error');
    });
    
  }

  takeCoupon(i: number, j: number) {
    // Check if user has logged in
    if(!this.loggedIn) this.navCtrl.push('LoginPage');
    else {

      let item = new Coupon();
      item.id = this.couponTypes[i].coupons[j].id;
      item.name = this.couponTypes[i].coupons[j].name;
      item.description = this.couponTypes[i].coupons[j].description;
      item.discount_method = this.couponTypes[i].coupons[j].discount_method;
      item.discount_percentage = this.couponTypes[i].coupons[j].discount_percentage;
      item.discount_value = this.couponTypes[i].coupons[j].discount_value;
      item.expired = this.couponTypes[i].coupons[j].expired;
      item.expire_date = this.couponTypes[i].coupons[j].expire_date;
      item.image_url = this.couponTypes[i].coupons[j].image_url;
      item.coupon_type_id = this.couponTypes[i].coupons[j].coupon_type_id;
      item.min_purchased_amount = this.couponTypes[i].coupons[j].min_purchased_amount;

      if(!this.couponWallet.has(item)) {
        this.couponWallet.add(item);
        this.couponTypes[i].coupons[j].btn_disabled = true;
        this.couponTypes[i].coupons[j].z_index = 2;

        // save coupon wallet to local
        
        this.storage.ready().then(() => {
          this.storage.set(Constants.COUPON_WALLET_KEY, this.couponWallet);
        });
  
        // relate records in db at server
        let body = {
          'id': this.couponTypes[i].coupons[j].id,
          'mobile': this.mobile
        }
        this.vjApi.setCouponCustomerRelation(JSON.stringify(body)).subscribe((data)=>console.log(data));
      } 
    }
  } 

  toHomePage() {
    this.navCtrl.pop();
  }
}
