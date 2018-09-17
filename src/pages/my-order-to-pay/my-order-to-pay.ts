import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Order } from '../../models/order-model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Product } from '../../models/product.model';

/**
 * Generated class for the MyOrderToPayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-order-to-pay',
  templateUrl: 'my-order-to-pay.html',
})
export class MyOrderToPayPage {

  orders: Order[];
  mobile: string;
  baseUrl: string;
  ShoppingCart: ShoppingItem[];
  avatar_url: string;

  deleteConfirmed: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string, private app: App, private alertCtrl: AlertController) 
  {
  	this.mobile = this.navParams.data;
  	this.orders = new Array<Order>();
  	this.baseUrl = this.apiUrl;
  	this.ShoppingCart = new Array<ShoppingItem>();
  }

  ionViewDidLoad() {
   this.getMyOrders();
  }

  getMyOrders()
  {
    this.orders =new Array<Order>();
    this.vjApi.showLoader();
    this.vjApi.getMyOrders(this.mobile, 'to_pay').subscribe((o) => {
      if(o.length > 0) {
        this.orders = o;
        console.log(o);
        let productId = this.orders[0].products[0].productId;
        this.vjApi.getProductById(productId).subscribe((pdt) => {
          console.log(pdt);
          if(pdt.length > 0) {
            this.avatar_url = pdt[0].thumbnail_url;
          } 
        })
      }
    });
    
    this.vjApi.hideLoader();
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

  deleteOrder(index: number) {
    this.doPrompt('删除后，该订单不能再恢复。请确认是否继续？', index);
  }

  doPrompt(msg, index) {
    let alert = this.alertCtrl.create();

    alert.setTitle('警告');
    alert.setMessage(msg);
    alert.addButton({
      text: '确定',
      handler: () => {
        let orderId = this.orders[index].id;
        this.vjApi.showLoader();
        this.vjApi.deleteMyOrder(orderId).subscribe((resp) => console.log(resp));
        this.vjApi.hideLoader();
        this.getMyOrders();
      }
    });
    alert.addButton('取消');

    alert.present();
  }
}
