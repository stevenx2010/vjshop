import { Component, /*Inject,*/ ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { Order } from '../../models/order-model';
import { TabsPage } from '../tabs/tabs';
import { ShoppingItem } from '../../models/shopping-item.model';
//import { Product } from '../../models/product.model';
import { DeliveryStatus, Constants } from '../../models/constants.model';
import { OrderStatus } from '../../models/constants.model';
import { Tools } from '../../utils/Tools';

/**
 * Generated class for the DistributorOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-distributor-orders',
  templateUrl: 'distributor-orders.html',
})
export class DistributorOrdersPage {

  mobile: string;
  orders: Order[];
  ordersToBeDelivered: Order[];
  ordersWaitForConfirm: Order[];
  ordersConfirmed: Order[];

  displayType: any;

  shoppingCart: ShoppingItem[];

  shippingAddressHide: boolean[];
  deliveryBtnDisabled: boolean[];
  confirmBtnDisabled: boolean[];

  isInit: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				/*@Inject('API_BASE_URL') private apiUrl: string,*/ private app: App, private alertCtrl: AlertController,
          private cf: ChangeDetectorRef, private storage: Storage) 
  {
  	this.mobile = this.navParams.data;
  	this.displayType = '1';
    this.shoppingCart = new Array<ShoppingItem>();

    this.initVariables();
  }

  ionViewWillLoad() {
    this.isInit = true;
    this.getOrdersFromServer();
  }

  initVariables() {
    this.orders = new Array<Order>();
    this.ordersToBeDelivered = new Array<Order>();
    this.ordersWaitForConfirm = new Array<Order>();
    this.ordersConfirmed = new Array<Order>();
    this.shippingAddressHide = new Array<boolean>();
    this.deliveryBtnDisabled = new Array<boolean>();
    this.confirmBtnDisabled = new Array<boolean>();  
  }

  exit() {
    this.app.getRootNav().push(TabsPage);
  }

  toProductList(section:number, index: number) {
    this.shoppingCart = [];
    switch(section) {
      case 1:
        this.orders[index].products.forEach((p) => {
          this.shoppingCart.push(new ShoppingItem(p));
        });
        break;
      case 2:
        this.ordersToBeDelivered[index].products.forEach((p) => {
          this.shoppingCart.push(new ShoppingItem(p));
        });
        break;
      case 3:
        this.ordersWaitForConfirm[index].products.forEach((p) => {
          this.shoppingCart.push(new ShoppingItem(p));
        });
        break;
      case 4:
        this.ordersConfirmed[index].products.forEach((p) => {
          this.shoppingCart.push(new ShoppingItem(p));
        });
        break;              
    }

    this.app.getRootNav().push('ProductListPage', {shoppingCart: this.shoppingCart});
  }

  toggleAddress(index) {
    this.shippingAddressHide[index] = !this.shippingAddressHide[index];
  }

  doPromptDelivery(order: Order, index) {
    let alert = this.alertCtrl.create();
    alert.setTitle('订单编号：' + order.order_serial);
    alert.setSubTitle('订单时间：' + order.order_date);
    alert.setMessage('我确认马上对该订单进行送货');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.vjApi.updateOrderDeliveryStatus(order.id, DeliveryStatus.IN_DELIVERY, Tools.getDateTime()/*, this.mobile*/).subscribe((resp) => {
          console.log(resp);
          this.deliveryBtnDisabled[index] = true;
          this.isInit = false;
          this.getOrdersFromServer();
        })
      }
    });
    alert.addButton('取消');

    alert.present();
  }

  doPromptConfirm(order: Order, index) {
    let alert = this.alertCtrl.create();
    alert.setTitle('订单编号：' + order.order_serial);
    alert.setSubTitle('订单时间：' + order.order_date);
    alert.setMessage('我确认【已经完成】该订单的配送任务');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.vjApi.updateOrderDeliveryStatus(order.id, DeliveryStatus.DELIVERED_NOT_CONFIRM, Tools.getDateTime()/*, this.mobile*/).subscribe((resp) => {
          console.log(resp);
          this.confirmBtnDisabled[index] = true;
          this.isInit = false;
          this.getOrdersFromServer();
        })
      }
    });
    alert.addButton('取消');

    alert.present();   
  }

  getOrdersFromServer() {
    this.initVariables();
    if(this.mobile) {
      this.vjApi.getOrdersOfDistributor(this.mobile).subscribe((data: Order[]) => {
        if(data.length > 0) {
          //  for case '1': all orders
          data.forEach((o) => {
            if(o.order_status != OrderStatus.NOT_PAY_YET) {
              this.orders.push(o);
              this.shippingAddressHide.push(true);
              this.deliveryBtnDisabled.push(false);
              this.confirmBtnDisabled.push(false);
            }
    //      })
          /*
          for(let i = 0; i < this.orders.length; i++) {
            this.shippingAddressHide.push(true);
            this.deliveryBtnDisabled.push(false);
            this.confirmBtnDisabled.push(false);
          }*/
      /*    this.orders.sort((a: Order, b: Order) => {
            if(a.order_date > b.order_date) return -1;
            else if(a.order_date < b.order_date) return 1;
            return 0;
          });*/

          //  for case '2':
     //     data.forEach((o) => {
            if(o.delivery_status == DeliveryStatus.WAITING_FOR_DELIVERY && o.order_status == OrderStatus.PAYED) {
              this.ordersToBeDelivered.push(o);
              this.shippingAddressHide.push(true);
              this.deliveryBtnDisabled.push(false);
              this.confirmBtnDisabled.push(false);
            }
     //     });

          //  for case '3':
     //     data.forEach((o) => {
            if(o.delivery_status == DeliveryStatus.IN_DELIVERY) {
              this.ordersWaitForConfirm.push(o);
              this.shippingAddressHide.push(true);
              this.deliveryBtnDisabled.push(false);
              this.confirmBtnDisabled.push(false);
            }
       //   });

          //  for case '4':
       //   data.forEach((o) => {
            if(o.delivery_status == DeliveryStatus.DELIVERED_NOT_CONFIRM) {
              this.ordersConfirmed.push(o);
              this.shippingAddressHide.push(true);
              this.deliveryBtnDisabled.push(false);
              this.confirmBtnDisabled.push(false);
            }
        //  });    
        })}
          console.log(data);
          console.log(this.ordersConfirmed);
          console.log(this.ordersWaitForConfirm);
      });
    }
  }

  doRefresh(refresher) {
    this.getOrdersFromServer();
    refresher.complete();
  }

  segmentChanged() {
    this.cf.detectChanges();
  }

  logout() {
    this.storage.remove(Constants.DISTRIBUTOR_LOGIN_KEY);
    this.storage.remove(Constants.DISTRIBUTOR_MOBILE);
    this.app.getRootNav().push(TabsPage);
  }
}
