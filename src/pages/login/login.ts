import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Constants } from '../../models/constants.model';
import { VJAPI } from '../../services/vj.services';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  caption: string = '获取验证码';
  smsBtnDisabled: boolean = true;
  smsCode: string ='';
  mobile: string = '';
  confirmDisabled: boolean = true;
  mobileIsValide: boolean = false;
  smsCodeIsValide: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  getSMSCode() {
  	let count = 1;
  	this.smsBtnDisabled = true;
	let timer = setInterval(() => {
	  				this.caption = count + '秒';
	  				count += 1;
	  				if(count > 60) {
	  					clearInterval(timer);
	  					this.caption = '获取验证码';
	  					this.smsBtnDisabled = false;
	  				}
					}, 1000);

  }

  confirmLogin(): void {
  	//send SMS code received to server to verification

  	//Mock here, assume my data is verified, save login info to local
  	// And remote server
  	//this.storage.set(Constants.LOGIN_KEY, true);

  	let body = {
  		"mobile": this.mobile,
  		"smscode": this.smsCode
  	}

  	this.vjApi.confirmSmsCode(body).subscribe((data) => console.log(data));
  }

  validate(): void {
  	let regex_mobile = '^1[0-9]{10}';

  	if(this.mobile.match(regex_mobile)) { 
  		this.mobileIsValide = true;
  		this.smsBtnDisabled = false;
  	}
  	else
  		this.mobileIsValide = false;
  

  	let regex_sms_code = '[0-9]{6}';

  	if(this.smsCode.match(regex_sms_code))
  		this.smsCodeIsValide = true;
  	else 
  		this.smsCodeIsValide = false;

  	if(this.mobileIsValide && this.smsCodeIsValide)
  		this.confirmDisabled = false;

  }

}


