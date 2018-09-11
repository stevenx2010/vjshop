import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Constants, Login } from '../../models/constants.model';
import { VJAPI } from '../../services/vj.services';
import { InitEnv } from '../../utils/initEnv';
import { CouponItem } from '../../models/coupon-item.model';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  pageCaption: string='登录';
  caption: string = '获取验证码';
  smsBtnDisabled: boolean = true;
  smsCode: string ='';
  mobile: string = '';
  confirmDisabled: boolean = true;
  mobileIsValide: boolean = false;
  smsCodeIsValide: boolean = false;

  couponWallet: Set<CouponItem>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI, private alertCtrl: AlertController,
  				private events: Events, private init: InitEnv) {
    this.couponWallet = new Set<CouponItem>();
  }

  ionViewDidLoad() {
    if(this.navParams.get('user') == 'distributor') this.pageCaption = '经销商登录';
  }

  getSMSCode() {
  	// step 1: Send request to get a SMS code
  	let body = {
  		"command": Login.GET_SMS_CODE,
  		"mobile": this.mobile
  	}

  	this.vjApi.auth(JSON.stringify(body)).subscribe((data) => console.log(data));

  	// Re-enable to get SMS code after 1 minute
  	let count = 1;
  	this.smsBtnDisabled = true;
  	let timer = setInterval(() => {
	  				this.caption = count + '秒';
	  				count += 1;
	  				if(count > 5) {
	  					clearInterval(timer);
	  					this.caption = '获取验证码';
	  					this.smsBtnDisabled = false;
	  				}
					}, 1000);

  }

  confirmLogin() {
    if(this.navParams.get('user') == 'distributor') {

      this.confirmLoginDistributor();
    } else {
      this.confirmLoginUser();
    }
  }

  confirmLoginUser(): void {
  	// step 1: send received SMS code to server to verification

  	let body = {
  		"command": Login.CONFIRM_SMS_CODE,
  		"mobile": this.mobile,
  		"sms_code": this.smsCode,
  	}

  	this.vjApi.auth(JSON.stringify(body)).subscribe((data) => {

  		let response = data.json();
  		// step A: check if it's a new user, if so, store the access_token locally
      // for new users, an access_token will be returned.
  		if(response.access_token != '') {
  			this.storage.ready().then(() => {
  				this.storage.set(Constants.ACCESS_TOKEN_KEY, response.access_token);
  			}).catch(console.log);
  		}

      // step B: check login success/failure
  		if(response.status === Login.CONFIRM_SMS_CODE_SUCCESS) {
        // step 1: store user login status locally
        this.storage.ready().then(() => {
          // step 1-1: store user's mobile
          this.storage.set(Constants.USER_MOBILE_KEY, this.mobile);

          // setp 1-2: set Login key as true
          this.storage.set(Constants.LOGIN_KEY, 1);

          // step 1-3: get coupon wallet by mobile
        
          this.init.getCouponWallet(this.mobile).subscribe((r) => {
            console.log(r);
            if(r) {
               this.couponWallet = r;
               this.events.publish('login_success');
            }
          })

        }).catch(console.log);

        // step 2: check if the user has inputted his/her address
  			if(response.address_check == Login.SHIPPING_ADDRESS_CHECK_FAILURE) {
  				this.events.subscribe('login_address_added', () => {
  					this.navCtrl.pop().then(() => {
  						this.events.publish('login_success', {'logged_in': true, 'mobile': this.mobileIsValide});
  						this.events.unsubscribe('login_address_added');
  					})}
  				);

  				this.navCtrl.push('AddAdressPage', { mobile: this.mobile });
  			} else {

          // step 3-2: the user has inputted his/her address, then set LOGIN_KEY = 1(true)
  				this.storage.ready().then(() => {
  					this.storage.set(Constants.LOGIN_KEY, 1);
  				}).catch(console.log);

          this.vjApi.showLoader();
          // retrieve shipping address from server
          this.vjApi.getDefaultAddress(this.mobile).subscribe((data) => {

            if(data.length > 0) {
              this.storage.ready().then(() => {
                this.storage.set(Constants.SHIPPING_ADDRESS_KEY, data[0]);
                this.navCtrl.pop().then(() => {
                    this.events.publish('login_success', true, this.mobile, data[0]);
                });
              })
            }
          })
          this.vjApi.hideLoader(); 				
  			}
  		} else
  		  	this.doPrompt('登录信息错误，请检查后重新登录');
  	},
    (err) => {
      console.log(err);
      let msg;
      if(err.status == 403)
        msg = '验证码错误，请检查后重新登录';
      if(err.status == 404)
        msg = '验证码超时!';

      this.doPrompt(msg);
    });
  }

  confirmLoginDistributor() {
    this.vjApi.getDistributorLogin(this.mobile).subscribe((data) => {
      if(data.status == 200) this.navCtrl.push('DistributorToolsPage', {mobile: this.mobile});
    },
    (err) => {
      console.log(err.status);
      this.doPrompt('您输入有误或者您不是合法的经销商');
    });
    //this.navCtrl.push('DistributorToolsPage', {mobile: '18910109898'});
  }

  validate(): void {
  	let regex_mobile = '^1[0-9]{10}$';

  	if(this.mobile.match(regex_mobile)) { 
  		this.mobileIsValide = true;
  		this.smsBtnDisabled = false;
  	}
  	else {
  		this.mobileIsValide = false;
  		this.smsBtnDisabled = true;
  	}
  

  	let regex_sms_code = '^[0-9]{6}$';

  	if(this.smsCode.match(regex_sms_code))
  		this.smsCodeIsValide = true;
  	else 
  		this.smsCodeIsValide = false;

  	if(this.mobileIsValide && this.smsCodeIsValide)
  		this.confirmDisabled = false;
  	else
  		this.confirmDisabled = true;
  }

  doPrompt(msg) {
  	let alert = this.alertCtrl.create();
  	alert.setTitle('提示');
  	alert.setMessage(msg);
  	alert.addButton('确定');

  	alert.present();
  }

}


