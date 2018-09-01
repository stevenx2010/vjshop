import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { Constants } from '../../models/constants.model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Address } from '../../models/address.model';
import { Product } from '../../models/product.model';


@IonicPage()
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {

  mobile: string;
  shoppingCart: ShoppingItem[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI) {
  	this.shoppingCart = new Array<ShoppingItem>(new ShoppingItem());
  }

  ionViewWillLoad() {
   	this.storage.ready().then(() => {
   		// Get mobile which was stored locally
   		this.storage.get('mobile').then((data) => {
   			if(data) this.mobile = data;
   			else this.mobile = '';
   		})

   		// Get shopping cart
   		this.storage.get(Constants.SHOPPING_CART_KEY).then((data) => {
   			if(data) {
   				this.shoppingCart = data;
   			}
   		})

   		// Get products purchaing
   		if(this.shoppingCart.length > 0) {
   			for(let item of this.shoppingCart) {
   				this.vjApi.getProductDetailInfo(item.productId).subscribe((data) => {
   					
   				})
   			}
   		}
   	})
  }	
}
