import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { Address } from '../../models/address.model';
import { Constants } from '../../models/constants.model';

/**
 * Generated class for the ManageAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-address',
  templateUrl: 'manage-address.html',
})
export class ManageAddressPage {
  address: Address;
  addresses: Address[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI) {
  	this.address = new Address();
  	this.addresses = new Array<Address>();

  	this.storage.ready().then(() => {
  		this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then((data) => {
  			this.address = new Address(data);
  		});
  	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageAddressPage');
  }

  getAddresses() {
  	this.vjApi.getAddressAll(this.address.mobile).subscribe(
  		(data) => {
  			this.addresses = data;
  			console.log(this.addresses);
  		} );
  }

}
