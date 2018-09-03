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

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string) 
  {
  	this.shoppingCart = new Array<ShoppingItem>(new ShoppingItem());
  	this.products = new Array<Product>(new Product());
    this.distributorAddress = new Array<DistributorAddress>(new DistributorAddress());
    this.distributors = new Array<Distributor>(new Distributor());
    this.distributorContacts = new Array<DistributorContact>(new DistributorContact());
    this.shippingAddress = new Address();
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
   		this.storage.get(Constants.SHOPPING_CART_KEY).then((data) => {
   			if(data) {
   				this.shoppingCart = data;
   				for(let item of this.shoppingCart) {
   					this.numberOfItems += item.quantity;
   				}
   				// Get product info of the prodcuts cart
          this.vjApi.showLoader();
   				this.vjApi.getProductsByIds(JSON.stringify(this.shoppingCart)).subscribe((data) => {
   					if(data) {
   						this.products = data.json();
   					}
   				});        
   			}
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

       this.vjApi.hideLoader();
     })
     })
  }	
}
