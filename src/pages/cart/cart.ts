import { Component, Inject } from '@angular/core';
import { NavController, App, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Constants } from '../../models/constants.model';
import { Address } from '../../models/address.model';
import { VJAPI } from '../../services/vj.services';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
 
  loggedIn: boolean = false;
  mobile: string;
  address: Address;
  shoppingCart: ShoppingItem[];
  products: Product[];
  model: string;
  baseUrl: string;
  shoppingCartEmpty: boolean;
  currentSelectedItem: number;

  constructor(public navCtrl: NavController, private storage: Storage, private app: App, private events: Events, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string, private alertCtrl: AlertController) 
  { 	
//  	this.storage.remove(Constants.USER_INFO_KEY);
	this.address = new Address();
	this.shoppingCart = new Array<ShoppingItem>();
	this.products = new Array<Product>();
	this.baseUrl = this.apiUrl;

	this.events.subscribe('shopping_cart_item_added', (shoppingCart) => {
		//console.log(shoppingCart);
		this.getShoppingItems();
	})

  }

  ionViewWillLoad() {

    // check if user has logged in
  	this.storage.get(Constants.LOGIN_KEY).then((data) => {
  		if(data) {
  			this.loggedIn = true;
  			this.getShippingAddress();

  		}
  	});

    // get products from server according to the items in the shopping cart
  	this.vjApi.showLoader();

  	this.getShoppingItems();

  	this.vjApi.hideLoader();

  }

  ionViewDidEnter() {
   	let regex = /^(\d{3})\d{4}(\d{4})$/gi;
	this.mobile = this.address.mobile.replace(regex, '$1****$2');
  }

  toLoginPage(): void {
  	this.events.subscribe('login_success', (param) => {
  		this.loggedIn = param.logged_in;
  		this.getShippingAddress();
  		this.events.unsubscribe('login_success');

  	})

  	this.app.getRootNav().push('LoginPage');
  }

  getShippingAddress() {
  	this.storage.ready().then(() => {
  			this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then((data) => {
  				this.address = new Address(data);

  				//Sync to db
  				this.syncDatabase(this.address.mobile);
  			}).catch(console.log);
  		}).catch(console.log);
  }

  goManageAddressPage() {
  	this.navCtrl.push('ManageAddressPage');
  }

  syncDatabase(mobile: string) {
   	//Syncronization check
  	this.vjApi.getUserId(mobile).subscribe((data) => {
  		let result = data.json();
  		if(result.userid == -1) {  // no user info in db, then remove local info
  			this.storage.remove(Constants.SHIPPING_ADDRESS_KEY);
  			this.storage.remove(Constants.LOGIN_KEY);
  			this.address = new Address();
  			this.mobile = '';
  		} else if(result.has_address == 0) { // there's the user but no shipping address
  			this.storage.remove(Constants.SHIPPING_ADDRESS_KEY);
  			this.address = new Address();
  			this.mobile = '';
  		}
  	});	
  }


  getShoppingItems() {
  	//return Observable.create(observer => 

  	this.storage.ready().then(() => {
  		this.storage.get(Constants.SHOPPING_CART_KEY)
  		.then((data: ShoppingItem[]) => {
        if(data == null || data.length < 1)  {
          this.shoppingCartEmpty = true;
          return;
        } else
          this.shoppingCartEmpty = false;

  			this.shoppingCart = data;

  			this.vjApi.getProductsByIds(JSON.stringify(this.shoppingCart)).subscribe(
  				(data) => {
  					this.products = data.json();      

  				},
  				(err) => console.log(err)
  			);
  		})
  	}).catch(console.log);
  }
 
  toProductDetailPage(productId: number) {
  	this.app.getRootNav().push('ProductDetailPage', {productId});
  }

  selectionChange(index: number) {
    console.log(this.shoppingCart[index].price);
    console.log(this.shoppingCart[index].selected);
  }

  deleteItem(index: number) {
    this.currentSelectedItem = index;
    this.doDeletePrompt(index);
  }

  doDeletePrompt(i: number) {
    let alert = this.alertCtrl.create();

    alert.setTitle('删除确认');
    alert.setSubTitle(this.products[i][0].product_sub_category_name + ': ' + this.products[i][0].model);
    let msg = '您确定要从购物车中删除此项商品吗？'
    alert.setMessage(msg);
    alert.addButton({
        text: '确定',
        handler: () => { 

          if(this.shoppingCart == null) return;
          /*
          if(this.shoppingCart.length == 1) {
            this.shoppingCart = new Array<ShoppingItem>();
            this.storage.remove(Constants.SHOPPING_CART_KEY);
          }*/

          let tempChart = new Array<ShoppingItem>();
          let tempProducts = new Array<Product>();
                   
          for(let j = 0; j < this.shoppingCart.length; j++) {
            if(j == this.currentSelectedItem) continue;
            tempChart.push(this.shoppingCart[j]);
            tempProducts.push(this.products[j]);
          }

          
          if(this.shoppingCart != null && this.shoppingCart.length > 0) {
            this.products = tempProducts;
            this.shoppingCartEmpty = false;
            this.storage.ready().then(() => {
              this.storage.set(Constants.SHOPPING_CART_KEY, tempChart);

            }).catch(console.log);
          } else {
            this.shoppingCartEmpty = true;
            this.storage.remove(Constants.SHOPPING_CART_KEY);
            this.products = new Array<Product>();
          }
        }
      });

    alert.addButton({
      text: '取消',
      role: 'cancel',
      handler: () => {}
    });

    alert.present();
  }
}
