import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,AlertController, Events } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Order } from '../../models/order-model';
import { Product } from '../../models/product.model';
import { Address } from '../../models/address.model';
import { Coupon } from '../../models/coupon-model';

import { Alipay } from '@ionic-native/alipay';
import { AppAvailability } from '@ionic-native/app-availability';
import { PaymentMethod } from '../../models/constants.model';
import { Tools } from '../../utils/Tools';

declare let cordova:any;
declare let Wechat: any;

@IonicPage()
@Component({
  selector: 'page-pay-order-again',
  templateUrl: 'pay-order-again.html',
})
export class PayOrderAgainPage {

  order: any;
  order1: any;
  products: Product[];
  total: number;
  productPrice: number;
  orderPrice: number;
  address: Address;
  paymentMethod: string;

  coupons: Coupon[];
  coupons_used: boolean = false;

  appAlipay: any;
  appWechat: any;

  btnDisabled: boolean = true;

  priceModified: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, 
              private appAvail: AppAvailability, private platform: Platform, private alertCtrl: AlertController,
              private events: Events) {
  	this.order = new Order();
  	this.products = new Array<Product>();
    this.address = new Address();

    this.coupons = new Array<Coupon>();

  	this.order = this.navParams.get('order');
    this.order1 = this.navParams.get('order');
    console.log(this.order);

    if(this.platform.is('ios')) {
      this.appAlipay = 'alipay://';
      this.appWechat = 'wechat://';
    } else if(this.platform.is('android')) {
      this.appAlipay = 'com.eg.android.AlipayGphone';
      this.appWechat = 'com.tencent.mm';
    }
  }

  ionViewDidLoad() {

    console.log(this.order);
    this.coupons = this.order.coupons;
    if(this.coupons.length > 0) {
      this.coupons_used = true;
    } else {
      this.coupons_used = false;
    }

    
    this.calculateTotalPrice();
    // Unnecessary to calculate the price of order, the price might be changed at the back end
    let calculatedOrderPricethis = Number(this.total) + Number(this.order.shipping_charges);
    this.orderPrice = this.order1.total_price;
    if(calculatedOrderPricethis != this.orderPrice) {
      this.priceModified = true;
    } else {
      this.priceModified = false;
    }


    // get shipping address
    this.vjApi.getAddressById(this.order1.shipping_address_id).subscribe((resp) => {
      console.log(resp);
      if(resp.json()) {
        let temp = resp.json();
        this.address = temp[0];
        this.btnDisabled = false;
        console.log(this.address);
      }
    }, (err) => {
      console.log(err);
    });

    // get product list
    this.vjApi.getProductsByIds(JSON.stringify(this.order.products)).subscribe((resp) => {
      if(resp.json()) {

        console.log(resp.json());
        let temp = resp.json();
        temp.forEach((p) => {
          this.products.push(p[0]);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  calculateTotalPrice() {
    let total = 0;
    this.order.products.forEach((p) => {
      total += p.price * p.quantity;
    });

    this.productPrice = total;

    // deduct coupons
    if(this.coupons.length > 0) {
      //discount percentage first
      this.coupons.forEach((item) => {
        if(item.discount_method == 1)
            total *= (item.discount_percentage / 100.00);
      });

      // then deduct value coupons
      this.coupons.forEach((item) => {
        total -= item.discount_value;
      });
    }

    this.total = total;
  }

  toPay() {
    //this.btnDisabled = true;
    if(this.paymentMethod == 'alipay') this.order.payment_method = PaymentMethod.ALIPAY;
    else if(this.paymentMethod == 'wechat') this.order.payment_method = PaymentMethod.WECHAT;

    this.order.order_date = Tools.getDateTime();
    //this.order.order_serial = this.genOrderSerialNumber();

    this.vjApi.submitOrder(JSON.stringify(this.order)).subscribe((r) => {
      if(r) {
        let orderInfo = r.json();
        console.log(orderInfo);

        if(this.paymentMethod == 'alipay') {
          // Check if Alipay app is installed before  to pay
          this.appAvail.check(this.appAlipay).then((yes: boolean) => {
            cordova.plugins.ali.pay(orderInfo, (result) => {
              console.log(result);
              switch(result.resultStatus) {
                case '9000':
                  this.events.publish('order_paid');
                  this.doOrderPrompt('您已成功下单并支付，等候支付系统确认。请继续');

                  this.btnDisabled = true;
                  break;
                default:
                  this.doOrderPrompt('支付不成功！请到：我的->我的订单->待付款中，向左滑动要支付的订单继续进行支付或删除订单。' + result.resultStatus);
              }
            }, (error) => {
              console.log(error);
            });
          }, (no: boolean) => {
            this.doOrderPrompt('您没有安装支付宝APP，请去“应用市场”安装之后再用支付宝下单支付！');
          })
        }

        else if(this.paymentMethod == 'wechat') {
           Wechat.isInstalled((yes) => {

             Wechat.sendPaymentRequest(orderInfo, () => {
               console.log('success');
               this.events.publish('order_paid');
               this.btnDisabled = true;
             }, (err)=> {
               console.log(err);
               this.doOrderPrompt(err);
             });
            
          }, (no: boolean) => {
            this.doOrderPrompt('您没有安装微信APP，请去“应用市场”安装之后再用微信下单支付！');
          });
        } else {
          this.doOrderPrompt('请先选择支付方式');
        }
      }
    });
  }

  doOrderPrompt(msg) {
    let alert = this.alertCtrl.create();
    alert.setTitle('提示');
    alert.setMessage(msg);
    alert.addButton({
      text: '确定',
      handler: () => {
        
      }
    });

    alert.present();
  }

  genOrderSerialNumber() {
    let n:string = (Number(this.address.mobile)  & this.getRandomInt(1000, 9999)) + '';
    let len = n.length - 1;
    let r = this.getRandomInt(1, len);
    // first char
    let char1 = n.charAt(r);

    // second char
    r = this.getRandomInt(1, len);
    let char2 = n.charAt(r);

    // third char
    r = this.getRandomInt(1, len);
    let char3 = n.charAt(r);

    return Date.now() + '' + char1 + char2 + char3;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

}
