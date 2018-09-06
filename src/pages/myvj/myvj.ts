import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Constants } from '../../models/constants.model';

@Component({
  selector: 'page-myvj',
  templateUrl: 'myvj.html'
})
export class MyvjPage {

  constructor(public navCtrl: NavController, private storage: Storage, private events: Events) {

  }

  logout() {
  	this.storage.remove(Constants.LOGIN_KEY);
  	this.storage.remove(Constants.SHIPPING_ADDRESS_KEY);
  	this.storage.remove(Constants.COUPON_WALLET_KEY);
  	this.storage.remove(Constants.USER_MOBILE_KEY);
  	this.events.publish('logout', Date.now());
  }
}
