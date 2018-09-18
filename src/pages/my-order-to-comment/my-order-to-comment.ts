import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Order } from '../../models/order-model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Product } from '../../models/product.model';


@IonicPage()
@Component({
  selector: 'page-my-order-to-comment',
  templateUrl: 'my-order-to-comment.html',
})
export class MyOrderToCommentPage {
  orders: Order[];
  mobile: string;
  baseUrl: string;
  ShoppingCart: ShoppingItem[];
  avatar_url: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string, private app: App) 
  {
  	this.mobile = this.navParams.data;
  	this.orders = new Array<Order>();
  	this.baseUrl = this.apiUrl;
  	this.ShoppingCart = new Array<ShoppingItem>();
    this.avatar_url = new Array<string>();
  }

  ionViewDidLoad() {
    this.vjApi.getMyOrders(this.mobile, 'to_comment').subscribe((o) => {
    	if(o.length > 0) {
    		this.orders = o;
    		console.log(o);
    		this.orders.forEach((od) => {
          let productId = od.products[0].productId;
          this.vjApi.getProductById(productId).subscribe((pdt) => { 
            if(pdt.length > 0) {
              this.avatar_url.push(pdt[0].thumbnail_url);
            } 
          });
        });       
    	}
    })
  }

  goback() {
  	this.navCtrl.parent.viewCtrl.dismiss();
  }

  toProductComment(index: number) {
  	this.ShoppingCart = this.orders[index].products;
  	console.log(this.ShoppingCart);
  	if(this.ShoppingCart && this.ShoppingCart.length > 0) {
  		this.app.getRootNav().push('ProductCommentPage', {shoppingCart: this.ShoppingCart, orderId: this.orders[index].id});
  	}
  }
}
