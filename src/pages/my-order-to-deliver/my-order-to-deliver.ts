import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Order } from '../../models/order-model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Product } from '../../models/product.model';
import { Distributor } from '../../models/distributor-model';
import { DistributorAddress } from '../../models/distributor-address-model';
import { DistributorContact } from '../../models/distributor-contact-model';

/**
 * Generated class for the MyOrderToPayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-order-to-deliver',
  templateUrl: 'my-order-to-deliver.html',
})
export class MyOrderToDeliverPage {

  orders: Order[];
  mobile: string;
  baseUrl: string;
  ShoppingCart: ShoppingItem[];

  params: any;

  distributors: Distributor[];
  distributor: Distributor;
  distributorAddress: DistributorAddress;
  distributorContact: DistributorContact;
  selectedItem: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string, private app: App, private alertCtrl: AlertController) 
  {
  	this.params = this.navParams.data;
    this.mobile = this.params.mobile;
  	this.orders = new Array<Order>();
  	this.baseUrl = this.apiUrl;
  	this.ShoppingCart = new Array<ShoppingItem>();
    this.distributors = new Array<Distributor>();
    this.distributorAddress = new DistributorAddress;
    this.distributorContact = new DistributorContact;
  }

  ionViewDidLoad() {
    this.vjApi.showLoader();
    this.vjApi.getMyOrders(this.mobile, 'to_delivery').subscribe((o) => {
    	if(o.length > 0) {
    		this.orders = o;
    		console.log(o);
    	}
      this.vjApi.hideLoader();
    }, (err) => {
      this.vjApi.hideLoader();
    })
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

  getDistributorInfo(index) {
    let $distributor_id = this.orders[index].distributor_id;
    this.vjApi.getDistributorAllInfoById($distributor_id).subscribe((d) => {
      console.log(d);
      if(d) {
        this.distributor = d;
        for(let i = 0; i < this.distributor.addresses.length; i++) {
          if(this.distributor.addresses[i].default_address) {
            this.distributorAddress = this.distributor.addresses[i];
            break;
          }
        }

        for(let i = 0; i < this.distributor.contacts.length; i++) {
          if(this.distributor.contacts[i].default_contact) {
            this.distributorContact = this.distributor.contacts[i];
            break;
          }
        }

        if(this.selectedItem != index) this.selectedItem = index;
        else this.selectedItem = 100000;
      }
    });
  }

  hide(index) {
    this.selectedItem = 100000;
  }

  toMyOrderToConfirm() {
    this.app.getRootNav().push('MyOrderToConfirmPage', {'mobile': this.mobile});
  }
}


