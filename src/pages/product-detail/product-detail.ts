import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { ProductDetail } from '../../models/product-detail.model';
import { ProductDetailImage } from '../../models/product-detail-image.model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Constants } from '../../models/constants.model';


@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  images_1: ProductDetailImage[];
  images_2: ProductDetailImage[];
  detailInfo: ProductDetail[];
  productId: number;
  numberOfProducts: number;
  shoppingCart: ShoppingItem[];
  shoppedItems: number;

  constructor(private navCtrl: NavController, private navParams: NavParams, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string,
              private storage: Storage, private app: App) {
  	this.images_1 = new Array<ProductDetailImage>();
  	this.images_2 = new Array<ProductDetailImage>();
  	this.detailInfo = new Array<ProductDetail>();
    this.shoppingCart = new Array<ShoppingItem>();

  	this.productId = this.navParams.get('productId');
    this.numberOfProducts = 1;

    // Get shopping cart
    this.storage.get(Constants.SHOPPING_CART_KEY).then(
        (cart) => {
          if(cart) this.shoppingCart = cart;
          this.shoppedItems = this.calculateShoppedItems(cart);
        });

  	this.vjApi.showLoader();

  	this.vjApi.getProductDetailImages(this.productId,1).subscribe(
  		(data) => {
  			this.images_1 = data;
  		},
  		(err) => {
  			console.log(err);

  		}
  	);

  	this.vjApi.getProductDetailImages(this.productId,2).subscribe(
  		(data) => {
  			this.images_2 = data;
  		},
  		(err) => {
  			console.log(err);
  		}
  	);

  }

  ionViewWillLoad() {
  	this.vjApi.getProductDetailInfo(this.productId).subscribe(
  		(data) => {
  			this.detailInfo = data;
  			console.log(this.detailInfo);
  		//	this.vjApi.hideLoader();
  		},
  		(err) => {
  			console.log(err);
  		//	this.vjApi.hideLoader();
  		}
  	);

    this.vjApi.hideLoader();
  }


  goBack(): void {
  	this.navCtrl.pop();
  }

  addItem() {
    this.numberOfProducts += 1;
  }

  removeItem() {
    this.numberOfProducts -= 1;
  }

  addToShoppingCart() {
    if(this.numberOfProducts > 0) {
      this.shoppingCart.push(new ShoppingItem(this.productId, this.numberOfProducts));
      this.shoppedItems += this.numberOfProducts;
      this.storage.set(Constants.SHOPPING_CART_KEY, this.shoppingCart);
    }
  }

  calculateShoppedItems(shoppingCart: ShoppingItem[]): number {
//    if(shoppingCart.length < 1) 
//      return 0;

    let total = 0;
    for(let key in this.shoppingCart) {
      total += this.shoppingCart[key].quanltity;
    }

    console.log('total', total);

    return total;
  }

  createAddress(): void {
    // check if user has logged in
    let loginStatus = false;
    this.storage.ready().then(() => {
      this.storage.get(Constants.LOGIN_KEY).then((data) => {
        if(data)
          this.app.getRootNav().push('AddAdressPage');
        else
          this.app.getRootNav().push('LoginPage');
      })
    });
    
  }
}
