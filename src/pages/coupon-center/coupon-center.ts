import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

import { VJAPI } from '../../services/vj.services';
import { InitEnv } from '../../utils/initEnv';
import { CouponType } from '../../models/coupon-type-model';
import { Coupon } from '../../models/coupon-model';
import { CouponItem } from '../../models/coupon-item.model';
import { Constants } from '../../models/constants.model';


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

  couponWallet: Set<CouponItem>;
  loggedIn: boolean = false;
  mobile: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string, 
              private storage: Storage, private alertCtrl: AlertController, private init: InitEnv, private events: Events) 
  {
  	this.couponTypes = new Array<CouponType>(new CouponType());
  	this.couponsByType= new Array<Coupon[]>();
  	this.baseUrl = this.apiUrl;
    this.couponWallet = new Set<Coupon>();

    this.events.subscribe('login_success', ()=> {
          this.getListOfCoupons();
          this.events.unsubscribe('login_success');
    })
  }

  ngOnInit() {

    // Get list of coupon had taken from remote server
    this.initEnvironment();



  }

  ionViewWillLoad() {
      this.getListOfCoupons();

  }

  initEnvironment() {
    this.init.checkLogin().subscribe((data) => {
      if(data) {
        this.loggedIn = data;
        this.init.getMobile().subscribe((data) => {
          if(data) {
            this.mobile = data;
            this.init.getCouponWallet(this.mobile).subscribe((data) => {
              if(data) this.couponWallet = data;
            });


          }
        });
      }      
    });        
  }

 
  getListOfCoupons() {
    this.vjApi.showLoader();

    this.vjApi.getCouponAllTypes().subscribe((data_types) => {
      if(data_types.length > 0) {
        this.couponTypes = data_types;

        for(let couponType of this.couponTypes) {
          this.vjApi.getCouponsByTypeId(couponType.id).subscribe((data) => {
            if(data.length > 0) {

              // Check if this coupon has expired
              for( let i =0; i< data.length; i++) {
                if(!(data[i].expired)) {
                  let now =Date.now();
                  let future = (new Date(data[i].expire_date)).getTime();

                  if(future < now) {
                    // this coupon has expired,
                    data[i].expired = true;
                    let status = {
                      'id': data[i].id,
                      'type_id': data[i].coupon_type_id,
                      'expired': true
                    }
                    // update remote db
                    this.vjApi.updateCouponExpireStatus(JSON.stringify(status)).subscribe((data)=>console.log(data));
                  }
                }

                this.couponWallet.forEach((r) => {
                  if(r.id == data[i].id && r.coupon_type_id == data[i].coupon_type_id) {
                    data[i].btn_disabled = true;
                    data[i].z_index = 2;
                  }
                })

              }      

              this.couponsByType.push(data);
            }
          })
        }
      }
    });


    this.vjApi.hideLoader();    

  }

  takeCoupon(i: number, j: number) {
    // Check if user has logged in
    if(!this.loggedIn) this.navCtrl.push('LoginPage');
    else {

      let item = new CouponItem();
      item.id = this.couponsByType[i][j].id;
      item.name = this.couponsByType[i][j].name;
      item.description = this.couponsByType[i][j].description;
      item.discount_method = this.couponsByType[i][j].discount_method;
      item.discount_percentage = this.couponsByType[i][j].discount_percentage;
      item.discount_value = this.couponsByType[i][j].discount_value;
      item.expired = this.couponsByType[i][j].expired;
      item.expire_date = this.couponsByType[i][j].expire_date;
      item.image_url = this.couponsByType[i][j].image_url;
      item.coupon_type_id = this.couponsByType[i][j].coupon_type_id;

      if(!this.couponWallet.has(item)) {
        this.couponWallet.add(item);
        this.couponsByType[i][j].btn_disabled = true;
        this.couponsByType[i][j].z_index = 2;

        // save coupon wallet to local
        
        this.storage.ready().then(() => {
          this.storage.set(Constants.COUPON_WALLET_KEY, this.couponWallet);
        });
  
        // relate records in db at server
        let body = {
          'id': this.couponsByType[i][j].id,
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
