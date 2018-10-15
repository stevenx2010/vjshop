import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

import { VJAPI } from '../../services/vj.services';
import { Constants, InvoiceType, InvoiceStatus, OrderStatus, PaymentMethod } from '../../models/constants.model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Address } from '../../models/address.model';
import { Product } from '../../models/product.model';
import { DistributorAddress } from '../../models/distributor-address-model';
import { DistributorContact } from '../../models/distributor-contact-model';
import { Distributor } from '../../models/distributor-model';
import { Coupon } from '../../models/coupon-model';
import { CouponItem } from '../../models/coupon-item.model';
import { CouponDiscountMethod } from '../../models/constants.model';
import { Order } from '../../models/order-model';
import { Tools } from '../../utils/Tools';

import { Alipay } from '@ionic-native/alipay';
import { AppAvailability } from '@ionic-native/app-availability';

import { Setting } from '../../models/setting.model';

declare let cordova:any;
declare let Wechat: any;

@IonicPage()
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {

  mobile: string;
  mobileNoHide: string;
  shoppingCart: ShoppingItem[];
  products: Product[];
  numberOfItems: number = 0
  distributorAddress: DistributorAddress[];
  distributors: Distributor[];
  distributorContacts: DistributorContact[];
  shippingAddress: Address;
  couponWalletArray: Coupon[];
  baseUrl: string;
  totalPrice: number = 0;
  totalWeight: number = 0;
  shippingFee: number = 0;
  subTotalPrice: number = 0;
  weightUnit: string = '';
  shoppingCartEmpty: boolean;

  invoiceChkBox1: boolean;
  invoiceChkBox2: boolean;

  invoiceType: InvoiceType = InvoiceType.PERSONAL;
  invoiceRequired: boolean;

  invoiceHead: string;
  taxNumber: string;

  invHeadDisabled: boolean = true;
  taxNumDisabled: boolean = true;

  isWechat: boolean;
  isAlipay: boolean;

  order: Order;
  customer_id: number;
  couponUsedIds: Set<number>;

  appAlipay: any;
  appWechat: any;

  unregisterBackButtonAction: any;

  submitBtnDisabled = false;

  settings: Setting[];

  btnDisabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string, private alipay: Alipay, private alertCtrl: AlertController,
          private app: App, private appAvail: AppAvailability, private platform: Platform) 
  {
  	this.shoppingCart = new Array<ShoppingItem>(new ShoppingItem());
  	this.products = new Array<Product>(new Product());
    this.distributorAddress = new Array<DistributorAddress>(new DistributorAddress());
    this.distributors = new Array<Distributor>(new Distributor());
    this.distributorContacts = new Array<DistributorContact>(new DistributorContact());
    this.shippingAddress = new Address();
    this.couponWalletArray = new Array<Coupon>();
    this.baseUrl = this.apiUrl;
    this.order = new Order();
    this.couponUsedIds = new Set<number>();
    this.settings = new Array<Setting>(new Setting());

    if(this.platform.is('ios')) {
      this.appAlipay = 'alipay://';
      this.appWechat = 'wechat://';
    } else if(this.platform.is('android')) {
      this.appAlipay = 'com.eg.android.AlipayGphone';
      this.appWechat = 'com.tencent.mm';
    }

  }

  ionViewWillEnter() {

    this.invoiceChkBox1 = true;
    this.invoiceChkBox2 = false;
    this.invoiceRequired = false;

    this.isWechat = true;
    this.isAlipay = false;
  }

  ionViewWillLoad() {
    this.initializeBackButtonCustomHandler();

   	this.storage.ready().then(() => {
   		// Get mobile which was stored locally
   		this.storage.get(Constants.USER_MOBILE_KEY).then((data) => {
   			if(data) {
           this.mobile = data;
           this.mobileNoHide = data;
           this.vjApi.getUserId(this.mobile).subscribe((resp) => {
             if(resp) {
               this.customer_id = (resp.json()).user_id;
             }
           })
         }
   			else this.mobile = '';
   		})
/*
      // Get shipping address
      this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then((data) => {
        if(data) {
          this.shippingAddress = data;
          let regex = /^(\d{3})\d{4}(\d{4})$/gi;
          this.mobile = this.shippingAddress.mobile.replace(regex, '$1****$2');
        }
      });*/

   		// Get shopping cart
   		this.storage.get(Constants.SHOPPING_CART_KEY).then((data: ShoppingItem[]) => {
   			if(data.length > 0) {
          this.shoppingCartEmpty = false;
   				this.shoppingCart = data;

          this.calculateTotal();

   				// Get product info of the prodcuts cart
          this.vjApi.showLoader();
   				this.vjApi.getProductsByIds(JSON.stringify(this.shoppingCart)).subscribe((data) => {
   					if(data) {
   						this.products = data.json();
   					}
   				});        
   			} else this.shoppingCartEmpty = true;
   		})
   	
     // get shiping address & distributor location
     this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then((data) => {
       let city: any;
       if(data) {
         // shipping address
          this.shippingAddress = data;
          let regex = /^(\d{3})\d{4}(\d{4})$/gi;
          this.mobile = this.shippingAddress.mobile.replace(regex, '$1****$2');

         let address = data.city;
         let addressArray = address.split(' ');
         if(addressArray.length > 0) city = addressArray[0];
       }
       console.log(city);
       if(city) {
         // Get Distributor at this location
         this.vjApi.getDistributorAddressByLocation(city).subscribe((data) => {
           if(data.length > 0) {
             console.log(data);
             this.distributorAddress = data;

             let distributorId = this.distributorAddress[0].distributor_id;

             this.vjApi.getDistributorById(distributorId).subscribe((data) => {
                if(data) {
                  this.distributors = data;
                }
             });

             this.vjApi.getDistributorContactById(distributorId).subscribe((data) => {
               if(data) {
                 this.distributorContacts = data;
               }
             })
           }
         })
       } else {
         this.submitBtnDisabled = true;
         this.doOrderPrompt('没有经销商地址!');
       }

       // Get coupon wallet
       this.storage.get(Constants.COUPON_WALLET_KEY).then((data: Set<Coupon>) => {
         if(data && data.size > 0) {
             data.forEach((item) => {
               if(!item.has_used) this.couponWalletArray.push(item);
             });
         }
       });

       this.vjApi.hideLoader();
     })
     })
  }	

  ionViewWillLeave() {
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler() {
    if(this.platform.is('android')) {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction((event) => {
        this.navCtrl.pop();
      }, 101);
    }
  }

  calculateTotal() {
    this.totalPrice = 0;
    this.totalWeight = 0;
    if(!this.shoppingCartEmpty) {
      for(let item of this.shoppingCart) {
        if(item.selected) {
          this.totalPrice += item.price * item.quantity;
          this.totalWeight += item.weight *item.quantity;
          this.weightUnit = item.weight_unit;
          this.numberOfItems += item.quantity;
        }
      }
    }
    this.subTotalPrice = this.totalPrice;

    // calculate shipping fee after calculating the total weight
    this.getFormulaAndCalculate();
  }

  toProductList() {
    this.navCtrl.push('ProductListPage', {shoppingCart: this.shoppingCart});
  }

  invChkBoxSel_1(event) {
      this.invoiceChkBox1 = event.checked;
      this.invoiceChkBox2 = !event.checked;

      this.checkIfInvoiceRequired();
  }

  invChkBoxSel_2(event) {
      this.invoiceChkBox1 = !event.checked;
      this.invoiceChkBox2 = event.checked;

      this.checkIfInvoiceRequired();
  }

  checkIfInvoiceRequired() {
      if(this.invoiceChkBox2) {        // invoice required
        this.invoiceRequired = true;
        this.invHeadDisabled = false;
        this.taxNumDisabled = false;
      } else {                        // invoice not required
        this.invoiceRequired = false;
        this.invHeadDisabled = true;
        this.taxNumDisabled = true;       
      }   
  }

  wechatChanged(event) {
    this.isWechat = event.checked;
    this.isAlipay = !event.checked;
  }

  alipayChanged(event) {
    this.isWechat = !event.checked;
    this.isAlipay = event.checked;
  }

  onCouponChange(i) {
    console.log(this.couponWalletArray);
    if(this.couponWalletArray[i].has_used) {    // use coupon: i
      
      this.couponUsedIds.add(this.couponWalletArray[i].id);

      // re-calculate the total price
      switch(this.couponWalletArray[i].discount_method) {
        case CouponDiscountMethod.VALUE:
          this.totalPrice -= this.couponWalletArray[i].discount_value;
          break;
        case CouponDiscountMethod.PERCENTAGE:
          this.totalPrice *= (this.couponWalletArray[i].discount_percentage / 100.00);
          break;
      }
    } else {      // don't use coupon: i
      this.couponUsedIds.forEach((id) => {
        if(id == this.couponWalletArray[i].id) {
          this.couponUsedIds.delete(id);
        }
      })

      // re-calculate the total price
      switch(this.couponWalletArray[i].discount_method) {
        case CouponDiscountMethod.VALUE:
          this.totalPrice += this.couponWalletArray[i].discount_value;
          break;
        case CouponDiscountMethod.PERCENTAGE:
          this.totalPrice /= (this.couponWalletArray[i].discount_percentage / 100.0);
      }
    }

    // update the coupon wallet
    this.storage.ready().then(() => {
      let couponWallet = new Set<Coupon>();
      this.couponWalletArray.forEach((item ) => {
        couponWallet.add(item);
      })
      this.storage.set(Constants.COUPON_WALLET_KEY, couponWallet);
    });
  }

  genOrderSerialNumber() {
    let n:string = (Number(this.shippingAddress.mobile)  & this.getRandomInt(1000, 9999)) + '';
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

  submitOrder() {
    // Order basic info
    this.order.customer_id = this.customer_id;
    this.order.order_serial = this.genOrderSerialNumber();
    /*
    let dateString = new Date().toISOString();
    let regexp = /^(.*)T(.*)Z$/gi;
    dateString = dateString.replace(regexp, '$1 $2');*/

    this.order.order_date = Tools.getDateTime();

    this.order.total_price = this.totalPrice;

    this.order.total_weight = this.totalWeight;

    if(this.shippingFee > 0) this.order.shipping_charges = this.shippingFee;
    else this.order.shipping_charges = 0.00;

    console.log(this.shippingFee);


    // Order shipping address
    this.order.shipping_address = this.shippingAddress;


    // Products in this order
    this.order.products = this.shoppingCart;

    // Distributor info
    this.order.distributor_id = this.distributors[0].id;

    // Invoice info
    this.order.is_invoice_required = this.invoiceRequired;

    if(this.invoiceRequired) {
      if(this.invoiceHead == '个人') {
        this.invoiceType = InvoiceType.PERSONAL;
      }
      else {
        this.invoiceType = InvoiceType.ENTERPRISE;
        this.order.invoice_tax_number = this.taxNumber;
      }
      
      this.order.invoice_type = this.invoiceType;
      this.order.invoice_head = this.invoiceHead;
      this.order.invoice_status = InvoiceStatus.NOT_ISSUED;
    }

    // Coupons used
    this.order.coupon_used_ids = [];
    this.couponUsedIds.forEach((id) => {
      this.order.coupon_used_ids.push(id);
    })


    // Payment
    if(this.isAlipay)
      this.order.payment_method = PaymentMethod.ALIPAY;
    if(this.isWechat)
      this.order.payment_method = PaymentMethod.WECHAT;

    this.order.order_status = OrderStatus.NOT_PAY_YET;

    console.log(this.order);
    this.vjApi.submitOrder(JSON.stringify(this.order)).subscribe((r) => {
      if(r) {
        let orderInfo = r.json();
        console.log(orderInfo);

        if(this.isAlipay) {
          // Check if Alipay app is installed before  to pay
          this.appAvail.check(this.appAlipay).then((yes: boolean) => {
            cordova.plugins.ali.pay(orderInfo, (result) => {
              console.log(result);
              switch(result.resultStatus) {
                case '9000':
                  this.doOrderPrompt('您已成功下单并支付，等候支付系统确认。请继续');
                  this.btnDisabled = true;
                  break;
                default:
                  this.doOrderPrompt('支付不成功！请到：我的->我的订单->待付款中，向左滑动要支付的订单继续进行支付或删除订单。' + result.resultStatus);
              }
              let params = {'mobile': this.mobileNoHide, 'status': result.resultStatus}
              this.navCtrl.push('MyOrderTabsPage', {params: params});
            }, (error) => {
              console.log(error);
            });
          }, (no: boolean) => {
            this.doOrderPrompt('您没有安装支付宝APP，请去“应用市场”安装之后再用支付宝下单支付！');
          })
        }

        if(this.isWechat) {
          // check if Wechat app is installed before to pay
         // this.appAvail.check(this.appWechat).then((yes: boolean) => {
           /*this.wechat.sendPaymentRequest(orderInfo).then((data) => {
             console.log(data);
           }).catch((error) => console.log(error));*/
           Wechat.isInstalled((yes) => {

             Wechat.sendPaymentRequest(orderInfo, () => {
                 console.log('success');
                 this.btnDisabled = true;
               }, (err)=> {
                 console.log(err);
               this.doOrderPrompt(err);
             });
            
          }, (no: boolean) => {
            this.doOrderPrompt('您没有安装微信APP，请去“应用市场”安装之后再用微信下单支付！');
          });
        }

        // clear the shopping cart
      }
    }, (error) => {
      // remove the order
      this.vjApi.deleteOrderBySerial(this.order.order_serial).subscribe((resp) => {
        console.log(resp);
      })

      this.doOrderPrompt('后台错误: ' + error + ' 下单不成功!');
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

  getFormulaAndCalculate() {
    this.vjApi.getShippingFormula(this.totalWeight).subscribe((f) => {
      console.log(f);
      if(f.length > 0) {
        this.settings = f;

        // check the available formula according to the total weight, WAIRNING: because this is calcualted
        // according to the total weight, it must called after calcaulating the total weight;
        let i = 0;
        for(i = 0; i < this.settings.length; i++) {
          if(this.settings[i].condition1 <= this.totalWeight && this.settings[i].condition2 > this.totalWeight) break;
        }
        if(i >= this.settings.length) { // the weight range has passed last allow weight range, take the last formula to caluculate
          i = this.settings.length - 1;
        }

        let postfix = this.settings[i].setting_value_postfix
        console.log(postfix);

        this.shippingFee = this.calculateShippingFee(postfix);

        if(this.shippingFee < 0) this.shippingFee = 0;
        this.totalPrice += this.shippingFee;
      }
    }, (err) => {
    })
  }

  calculateShippingFee(postfix) {
    let s1 = [];
    let s2 = [];
    let w = this.totalWeight;
    let m = this.settings[0].parameter1;
    let p = this.settings[0].parameter2;
    let c = '';
    console.log(w);
    console.log(m);
    console.log(p);

    // replace m, p in formula to real value, & push into the array in reverse order
    for(let i = postfix.length - 1; i >= 0 ; i--) {
      c = postfix[i]; 

      switch(c) {
        case 'w':
          s1.push(w);
          break;
        case 'm': 
          s1.push(m);
          break;
        case 'p':
          s1.push(p);
          break;
        default:
          s1.push(c)
      }
    }

    // calculate the result
    let e:any, a: any, b: any;
    while((e = s1.pop()) != null) {
      switch(e) {
        case '+':
        case '-':
        case '*':
        case '/':
          b = s2.pop();
          a = s2.pop();
          s2.push(this.calculate(a, b, e));
          break;
        default:
          s2.push(e);
      }
    } 

    return s2.pop();
  }

  calculate(a, b, op) {
    let result = 0;

    switch(op) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '*':
        result = a * b;
        break;
      case '/':
        result = a / b;
        break;
    }

    return result;
  }
}
