import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { Constants } from '../../models/constants.model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Address } from '../../models/address.model';
import { Product } from '../../models/product.model';
import { DistributorAddress } from '../../models/distributor-address-model';
import { DistributorContact } from '../../models/distributor-contact-model';
import { Distributor } from '../../models/distributor-model';
import { CouponItem } from '../../models/coupon-item.model';
import { Coupon } from '../../models/coupon-model';
import { CouponDiscountMethod } from '../../models/constants.model';

@IonicPage()
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {

  mobile: string;
  shoppingCart: ShoppingItem[];
  products: Product[];
  numberOfItems: number = 0
  distributorAddress: DistributorAddress[];
  distributors: Distributor[];
  distributorContacts: DistributorContact[];
  shippingAddress: Address;
  couponWallet: Array<Coupon>;
  baseUrl: string;
  totalPrice: number = 0;
  totalWeight: number = 0;
  weightUnit: string = '';
  shoppingCartEmpty: boolean;

  invoiceChkBox1: boolean;
  invoiceChkBox2: boolean;

  invoiceRequired: boolean;

  invoiceHead: string;
  taxNumber: string;

  invHeadDisabled: boolean = true;
  taxNumDisabled: boolean = true;

  isWechat: boolean;
  isAlipay: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string) 
  {
  	this.shoppingCart = new Array<ShoppingItem>(new ShoppingItem());
  	this.products = new Array<Product>(new Product());
    this.distributorAddress = new Array<DistributorAddress>(new DistributorAddress());
    this.distributors = new Array<Distributor>(new Distributor());
    this.distributorContacts = new Array<DistributorContact>(new DistributorContact());
    this.shippingAddress = new Address();
    this.couponWallet = new Array<Coupon>();
    this.baseUrl = this.apiUrl;

  }

  ionViewWillEnter() {

    this.invoiceChkBox1 = true;
    this.invoiceChkBox2 = false;
    this.invoiceRequired = false;

    this.isWechat = true;
    this.isAlipay = false;
  }

  ionViewWillLoad() {
   	this.storage.ready().then(() => {
   		// Get mobile which was stored locally
   		this.storage.get('mobile').then((data) => {
   			if(data) this.mobile = data;
   			else this.mobile = '';
   		})

      // Get shipping address
      this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then((data) => {
        if(data) {
          this.shippingAddress = data;
          let regex = /^(\d{3})\d{4}(\d{4})$/gi;
          this.mobile = this.shippingAddress.mobile.replace(regex, '$1****$2');
        }
      });

   		// Get shopping cart
   		this.storage.get(Constants.SHOPPING_CART_KEY).then((data: ShoppingItem[]) => {
   			if(data.length > 0) {
          this.shoppingCartEmpty = false;
   				this.shoppingCart = data;

          this.calculateTotle();

   				// Get product info of the prodcuts cart
          this.vjApi.showLoader();
   				this.vjApi.getProductsByIds(JSON.stringify(this.shoppingCart)).subscribe((data) => {
   					if(data) {
   						this.products = data.json();
   					}
   				});        
   			} else this.shoppingCartEmpty = true;
   		})
   	
     // get location
     this.storage.get(Constants.LOCATION_KEY).then((data) => {
       let city = data;

       console.log(city);
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

       // Get coupon wallet
       this.storage.get(Constants.COUPON_WALLET_KEY).then((data: Set<Coupon>) => {
         if(data.size > 0) {
             data.forEach((item) => {
               this.couponWallet.push(item);
             });
         }
       });

       this.vjApi.hideLoader();
     })
     })
  }	

  calculateTotle() {
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
  }

  toProductList() {
    this.navCtrl.push('ProductListPage');
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
    if(this.couponWallet[i].has_used) {
      switch(this.couponWallet[i].discount_method) {
        case CouponDiscountMethod.VALUE:
          this.totalPrice -= this.couponWallet[i].discount_value;
          break;
        case CouponDiscountMethod.PERCENTAGE:
          this.totalPrice *= (this.couponWallet[i].discount_percentage / 100.00);
          break;
      }
    } else {
      switch(this.couponWallet[i].discount_method) {
        case CouponDiscountMethod.VALUE:
          this.totalPrice += this.couponWallet[i].discount_value;
          break;
        case CouponDiscountMethod.PERCENTAGE:
          this.totalPrice /= (this.couponWallet[i].discount_percentage / 100.0);
      }
    }
  }

  submitOrder() {

  }
}
