import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { ProductDetail } from '../../models/product-detail.model';
import { ProductDetailImage } from '../../models/product-detail-image.model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Constants } from '../../models/constants.model';
import { Address } from '../../models/address.model';


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
  shippingAddress: Address;

  eventsPublished: boolean = false;

  constructor(private navCtrl: NavController, private navParams: NavParams, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string,
              private storage: Storage, private app: App, private events: Events) {
  	this.images_1 = new Array<ProductDetailImage>();
  	this.images_2 = new Array<ProductDetailImage>();
  	this.detailInfo = new Array<ProductDetail>();
    this.shoppingCart = new Array<ShoppingItem>();
    this.shippingAddress = new Address();

  	this.productId = this.navParams.get('productId');
    this.numberOfProducts = 1;
    this.shoppedItems = 0;
  }

  ionViewWillLoad() {
    // step 1: Get shopping cart & shipping address
    // this.storage.remove(Constants.SHOPPING_CART_KEY);  // this line is for test

    this.storage.ready().then(() => {
      // step 1-1: Get shopping cart
      this.storage.get(Constants.SHOPPING_CART_KEY).then(
          (cart) => {
            if(cart) {
              this.shoppingCart = cart;
              this.shoppedItems = this.calculateShoppedItems(cart);
            }
          });

      //step 1-2: Get shipping address
      this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then(
          (address) => {
            if(address) this.shippingAddress = address;
          }
        )
    });
    // step 3: get product information from server
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

    // Get produt detail info
  	this.vjApi.getProductDetailInfo(this.productId).subscribe(
  		(data) => {
  			this.detailInfo = data;
  			//console.log(this.detailInfo);

  		},
  		(err) => {
  			console.log(err);
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

      // if the shopping cart is empty, then we create a new item & put it in

      if(this.shoppingCart.length < 1) {
 
        this.shoppingCart.push(new ShoppingItem(this.productId, this.numberOfProducts, this.detailInfo[0].price, 
                        this.detailInfo[0].weight, this.detailInfo[0].weight_unit, true));

      } else {

        // else we check if the product is in the shopping cart already
        let i = 0;
        for(i; i < this.shoppingCart.length; i++) {

          if(this.shoppingCart[i].productId == this.productId) {
            // we found the product in the shopping cart, add the quantity
            this.shoppingCart[i].quantity += this.numberOfProducts;
            break;
          }
        }

        // if i >= shopping cart length, then we didn't find the product
        if(i >= this.shoppingCart.length) {
          // we create a new item & put it in
          this.shoppingCart.push(new ShoppingItem(this.productId, this.numberOfProducts, this.detailInfo[0].price, 
                        this.detailInfo[0].weight, this.detailInfo[0].weight_unit,true));
        }
      }
      //  console.log(this.detailInfo[0]);
      //      console.log(this.shoppingCart);

      this.shoppedItems += Number(this.numberOfProducts);
      this.storage.ready().then(() => {
        this.storage.set(Constants.SHOPPING_CART_KEY, this.shoppingCart);

        // publish an event on item added
        this.events.publish('shopping_cart_item_added', this.shoppingCart);
       });    
  }

  calculateShoppedItems(shoppingCart: ShoppingItem[]): number {
//    if(shoppingCart.length < 1) 
//      return 0;

    let total = 0;
    for(let key in this.shoppingCart) {
      total += this.shoppingCart[key].quantity;
    }

    console.log('total', total);

    return total;
  }

  createAddress(): void {
    // check if user has logged in
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
