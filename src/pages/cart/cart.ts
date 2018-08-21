import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Constants } from '../../models/constants.model';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
 
  loginStatus: boolean = false;

  constructor(public navCtrl: NavController, private storage: Storage, private app: App) {
  	this.storage.remove(Constants.LOGIN_KEY);
  	this.storage.get(Constants.LOGIN_KEY).then((data) => {
  		if(data)
  			this.loginStatus = true;
  	});



  }

  ionViewDidEnter() {
  	  console.log(this.loginStatus);
  }

  toLoginPage(): void {
  	this.app.getRootNav().push('LoginPage');
  }
}
