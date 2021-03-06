import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, Events, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { Order } from '../../models/order-model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Product } from '../../models/product.model';
import { Coupon } from '../../models/coupon-model';
import { Constants } from '../../models/constants.model';

import { Loader } from '../../utils/loader';

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

  deleteConfirmed: boolean = false;

  status: string;
  params: any;

  couponWallet: Set<Coupon>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string, private app: App, private alertCtrl: AlertController,
          private storage: Storage, private events: Events, private toastCtrl: ToastController,
          private loadingCtrl: LoadingController) 
  {
  	this.params = this.navParams.data;
    this.mobile = this.params.mobile;
    this.status = this.params.status;
    console.log(this.mobile);
    console.log(this.params);

  	this.orders = new Array<Order>();
  	this.baseUrl = this.apiUrl;
  	this.ShoppingCart = new Array<ShoppingItem>();

    this.couponWallet = new Set<Coupon>();

    this.events.subscribe('order_paid', () => {
      this.getMyOrders();
    });
  }

  ionViewWillEnter() {
   
    this.getMyOrders();

    this.storage.ready().then(() => {
      this.storage.get(Constants.COUPON_WALLET_KEY).then((w) => {
        if(w) {
          this.couponWallet = w;
        }
      });
    })   
  }

  ionViewDidEnter() {
    this.presentToaster();
  }

  getMyOrders()
  {
    this.orders =new Array<Order>();
    let loader = new Loader(this.loadingCtrl);
    loader.show();
    this.vjApi.getMyOrders(this.mobile, 'to_pay').subscribe((o) => {
      if(o.length > 0) {
          o.forEach((order) => {
            this.orders.push(order);
          });        
        console.log(o);
      }
      loader.hide();
    }, (err) => {
      loader.hide();
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

        let loader = new Loader(this.loadingCtrl);
        loader.show();

        this.vjApi.deleteMyOrder(orderId).subscribe((resp) =>{ 
          // Sync coupons
          let coupons = new Array<Coupon>();
          coupons = resp.json();

          if(coupons.length > 0) {
          coupons.forEach((item) =>{
            if(item.pivot.quantity == 0) item.has_used = true;
            else item.has_used = false;
            this.couponWallet.add(item);
          });

        this.storage.ready().then(() => {
          this.storage.remove(Constants.COUPON_WALLET_KEY);
          this.storage.set(Constants.COUPON_WALLET_KEY, this.couponWallet);
        });
      }

          // Sync orders
          let temp_orders = [];
          for(let i = 0; i < this.orders.length; i++) {
            if(i != index) {
              temp_orders.push(this.orders[i]);
            }
          }
          this.orders = temp_orders;
          
          loader.hide();
        }, (err) => {
          loader.hide();
          console.log('My Order To Pay: deleteMyOrder in doPrompt error');
        });               
        
      }
    });
    alert.addButton('取消');

    alert.present();
  }

  payOrder(index) {
    let order = this.orders[index];
    this.app.getRootNav().push('PayOrderAgainPage', {order: order});
  }

  toMyOrderToConfirm() {
    this.app.getRootNav().push('MyOrderToConfirmPage', {'mobile': this.mobile});
  }

  sendOrderNumberToCustomer(index) {
    let order = this.orders[index];
    this.doSimplePrompt('订单号：' + order.order_serial + ' 已发送至客服。点击确定转到客服留言。', order.order_serial);
  }

  presentToaster() {
    let toast = this.toastCtrl.create({
      message: '向左滑动订单可以进行支付、删除订单、或者发送订单号至客服；点击可查看订单详情。',
      duration: 3500,
      position: 'bottom'
    });

    toast.present();
  }

  doSimplePrompt(msg, order_serial) {
    let alert = this.alertCtrl.create();

    alert.setMessage(msg);
    alert.setTitle('提示');
    alert.addButton({
      text: '确定',
      handler: () => {
        this.app.getRootNav().push('CustomerServicePage', { mobile: this.mobile, order_serial: order_serial });
      }
    });

    alert.present();
  }
}
