import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Product } from '../../models/product.model';

/**
 * Generated class for the ProductListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {

  shoppingCart: ShoppingItem[]; 
  baseUrl: string;
  products: Product[];
  productsFiltered: Product[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, /*private storage: Storage,*/
  			@Inject('API_BASE_URL') private apiUrl: string) 
  {
  	this.shoppingCart = new Array<ShoppingItem>(new ShoppingItem());
  	this.baseUrl = this.apiUrl;

    this.shoppingCart = this.navParams.get('shoppingCart');

    this.productsFiltered = new Array<Product>(new Product());

  }

  ionViewDidLoad() {
    if(this.shoppingCart && this.shoppingCart.length > 0) {
      // get back products info from server
      this.vjApi.getProductsByIds(JSON.stringify(this.shoppingCart)).subscribe((p) => {
        if(p) {
          this.products = p.json();
          this.productsFiltered.pop();
          for(let i = 0; i < this.products.length; i++) {
            if(this.shoppingCart[i].selected) {
              this.productsFiltered.push(this.products[i]);
            }
          }
          console.log(this.products);
          console.log(this.shoppingCart);
        }
      })
    }
  }

   toProductDetail(index: number) {
     let productId = this.products[index][0].id;
     this.navCtrl.push('ProductDetailPage', {productId});
   } 
}
