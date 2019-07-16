import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Order } from '../../models/order-model';
import { ShoppingItem } from '../../models/shopping-item.model';
//import { Product } from '../../models/product.model';

@IonicPage()
@Component({
  selector: 'page-my-order-to-receive',
  templateUrl: 'my-order-to-receive.html',
})
export class MyOrderToReceivePage {

  orders: Order[];
  mobile: string;
  baseUrl: string;
  ShoppingCart: ShoppingItem[];
  params: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string, private app: App) 
  {
  	this.params = this.navParams.data;
    this.mobile = this.params.mobile;
  	this.orders = new Array<Order>();
  	this.baseUrl = this.apiUrl;
  	this.ShoppingCart = new Array<ShoppingItem>();
  }

  ionViewDidLoad() {
    this.vjApi.showLoader();
    this.vjApi.getMyOrders(this.mobile, 'to_receive').subscribe((o) => {
    	if(o.length > 0) {
    		this.orders = o;
    		console.log(o);	
    	}
      this.vjApi.hideLoader();
    }, (err) => {
      this.vjApi.hideLoader();
    });
  }

  goback() {
  	this.navCtrl.parent.viewCtrl.dismiss();
  }

  toProductList(index: number) {
  	this.ShoppingCart = this.orders[index].products;
  	console.log(this.ShoppingCart);
  	if(this.ShoppingCart && this.ShoppingCart.length > 0) {
  		this.app.getRootNav().push('ProductListPage', {shoppingCart: this.ShoppingCart});
  	}
  }

  toMyOrderToConfirm() {
    this.app.getRootNav().push('MyOrderToConfirmPage', {'mobile': this.mobile});
  }
}
