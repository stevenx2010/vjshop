import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events/*, LoadingController*/ } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Constants, Login } from '../../models/constants.model';
import { VJAPI } from '../../services/vj.services';
//import { InitEnv } from '../../utils/initEnv';
import { Coupon } from '../../models/coupon-model';
import { Address } from '../../models/address.model';
import { Location } from '../../models/location.model';

//import { Loader } from '../../utils/loader';

export enum CurrentUser { DISTRIBUTOR, CUSTOMER };

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
  mobileIsValid: boolean = false;
  smsCodeIsValid: boolean = false;
  smsCountingDown: boolean = false;

  couponWallet: Set<Coupon>;

  loggedIn: boolean = false;
  shippingAddress: Address;

  chkAgreement: boolean = false;
  isNewUser: boolean = false;
  isCustomer: boolean = true;

  location: Location;

  currentUser: CurrentUser = CurrentUser.CUSTOMER;

  inputDisabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI, private alertCtrl: AlertController,
  				private events: Events/*, private init: InitEnv*/,/* private loadingCtrl: LoadingController*/) {
    this.couponWallet = new Set<Coupon>();
    this.shippingAddress = new Address();
    this.location = new Location();
  }

  ionViewDidLoad() {
    if(this.navParams.get('user') == 'distributor') {
      this.pageCaption = '经销商登录';
      this.currentUser = CurrentUser.DISTRIBUTOR;
      this.isCustomer = false;
      this.chkAgreement = true;
    }

    this.storage.ready().then((data) => {
      this.storage.get(Constants.LOCATION_KEY).then((data) => {
        if(data) {
          this.location = data;
        }
      })
    })
  }

  getSMSCode() {
  	// step 1: Send request to get a SMS code
  	let body = {
  		"command": Login.GET_SMS_CODE,
  		"mobile": this.mobile
  	}

    //let loader = new Loader(this.loadingCtrl);
    //loader.show();
  	this.vjApi.auth(JSON.stringify(body)).subscribe((data) => {
      console.log(data);
      let resp = data.json();
      this.isNewUser = resp.newuser;
      console.log(this.isNewUser);
      if(!this.isNewUser) {
        this.chkAgreement = true;
      }

      //loader.hide();
    }, (err) => {
      console.log('login: check if he"s new user failed');
      //loader.hide();
    });

  	// Re-enable to get SMS code after 1 minute
  	let count = 60;
  	this.smsBtnDisabled = true;
    this.smsCountingDown = true;
    this.inputDisabled = true;
  	let timer = setInterval(() => {
	  				this.caption = count + '秒';
	  				count -= 1;
	  				if(count < 0) {    // change to 60 in production version
	  					clearInterval(timer);
	  					this.caption = '获取验证码';
	  					this.smsCountingDown = false;
              this.smsBtnDisabled = false;
              this.inputDisabled = false;
	  				}
					}, 1000);

  }

  confirmLogin() {
    if(this.currentUser == CurrentUser.DISTRIBUTOR) {
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
      "location": this.location.province + this.location.city + this.location.district + this.location.street
  	}

    //let loader = new Loader(this.loadingCtrl);
    //loader.show();
  	this.vjApi.auth(JSON.stringify(body)).subscribe((data) => {

  		let response = data.json();
      console.log(response);
  		// step A: check if it's a new user, if so, store the access_token locally
      // for new users, an access_token will be returned.
  		if(response.access_token != '') {
  			this.storage.ready().then(() => {
  				this.storage.set(Constants.ACCESS_TOKEN_KEY, response.access_token);
  			}).catch(console.log);
  		}

      // step B: check login success/failure
  		if(response.status == Login.CONFIRM_SMS_CODE_SUCCESS) {
        // step 1: store user login status locally
        this.storage.ready().then(() => {
          // step 1-1: store user's mobile
          this.storage.set(Constants.USER_MOBILE_KEY, this.mobile);
          console.log(this.mobile);

          // setp 1-2: set Login key as true
          this.storage.set(Constants.LOGIN_KEY, 1);

          // step 1-3: get coupon wallet by mobile
        
          this.vjApi.getCouponsByMobile(this.mobile).subscribe((r) => {
            console.log(r);
            if(r) {
              r.forEach((item) => {
                if(item.pivot.quantity > 0) {
                  item.has_used = false;
                } else {
                  item.has_used = true;
                }

                this.couponWallet.add(item);
                });

               this.storage.ready().then(() => {
                 this.storage.set(Constants.COUPON_WALLET_KEY, this.couponWallet);
               })
               this.events.publish('login_success', {logged_in: true, mobile: this.mobile});
            }
          });

        }).catch(console.log);

        // step 2: check if the user has inputted his/her address
  			if(response.address_check == Login.SHIPPING_ADDRESS_CHECK_FAILURE) {

          // subscribe login_addres_added event
  				this.events.subscribe('login_address_added', () => {
            this.loggedIn = true;
            this.storage.ready().then(() => {
                this.storage.set(Constants.LOGIN_KEY, 1);
            });

            this.events.unsubscribe('login_address_added');

            this.events.publish('login_address_success', this.mobile);

            //loader.hide();
  					this.navCtrl.pop();
          });

          // go to create address page
  				this.navCtrl.push('AddAdressPage', { mobile: this.mobile, 'action': 'create' });

  			} else {

          // step 3-2: the user has inputted his/her address, then set LOGIN_KEY = 1(true)
  				this.storage.ready().then(() => {
  					this.storage.set(Constants.LOGIN_KEY, 1);
  				}).catch(console.log);
;
          // retrieve shipping address from server
          this.vjApi.getDefaultAddress(this.mobile).subscribe((data) => {
            console.log(data);
            if(data.length > 0) {
         //     this.storage.ready().then(() => {
                this.storage.set(Constants.SHIPPING_ADDRESS_KEY, data[0]);
                this.loggedIn = true;
                this.shippingAddress  = data[0];
                
                //loader.hide();
                this.doPrompt('登录成功，请继续！');

                console.log('page will be popped');
                this.navCtrl.pop();

          //    }) 
              } else {
                this.doPrompt('获取配送地址失败！');
                
            }
            //this.vjApi.hideLoader();
          }, (err) => {
            console.log(err)
            this.doPrompt('登录：网络连接错误！请检查是否有网络。')
            //this.vjApi.hideLoader();
          });
           				
  			}
  		} else
  		  	this.doPrompt('登录信息错误，请检查后重新登录');

      //loader.hide();
  	},
    (err) => {
      //loader.hide();
      console.log(err);
      let msg;
      if(err.status == 403)
        msg = '验证码错误，请检查后重新登录';
      else if(err.status == 404) {
          msg = '验证码超时! 或者发送验证短信过于频繁，发送系统暂时屏蔽该号码！';
      }
      else if(err.status == 500)
        msg = '服务器响应错误!';
      else
        msg = '没有网络连接或未知错误';

      this.doPrompt(msg);
    });
  }

  confirmLoginDistributor() {
    //let loader = new Loader(this.loadingCtrl);
    //loader.show();
    let body = {
      "mobile": this.mobile,
      "sms_code": this.smsCode
    }

    this.vjApi.authDistributorLogin(body).subscribe((data) => {
       switch(data.status) {
         case 200:
          this.storage.ready().then(() => {
          console.log(this.mobile);
          this.storage.set(Constants.DISTRIBUTOR_LOGIN_KEY, 1).catch((err) => console.log(err));
          this.storage.set(Constants.DISTRIBUTOR_MOBILE, this.mobile).catch((err) => console.log(err));
          });
        //loader.hide();
          this.navCtrl.push('DistributorToolsPage', {mobile: this.mobile});    
          break;

         case 201:
           this.doPrompt('验证码不正确!');
           break;  

         case 202:
           this.doPrompt('验证码超时！');
           break;
      }
      //loader.hide();
    },
    (err) => {
      //loader.hide();
      console.log(err.status);
      this.doPrompt('您输入有误或者您不是指定的经销商');
    });
    //this.navCtrl.push('DistributorToolsPage', {mobile: '18910109898'});
  }

  validate(): void {
  	let regex_mobile = '^1[0-9]{10}$';

  	if(this.mobile.match(regex_mobile)) { 
  		this.mobileIsValid = true;
  		this.smsBtnDisabled = false;
  	}
  	else {
  		this.mobileIsValid = false;
  		this.smsBtnDisabled = true;
  	}
  

  	let regex_sms_code = '^[0-9]{6}$';

  	if(this.smsCode.match(regex_sms_code))
  		this.smsCodeIsValid = true;
  	else 
  		this.smsCodeIsValid = false;

  	if(this.mobileIsValid && this.smsCodeIsValid && this.chkAgreement)
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

  ionViewWillLeave() {
    if(this.loggedIn) {
      this.events.publish('login_success', true, this.mobile, this.shippingAddress);
    }
  }

  toAgreement() {
    this.navCtrl.push('AgreementPage');
  }

}


