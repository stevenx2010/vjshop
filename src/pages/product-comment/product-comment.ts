import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
//import { Constants } from '../../models/constants.model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Product } from '../../models/product.model';


@IonicPage()
@Component({
  selector: 'page-product-comment',
  templateUrl: 'product-comment.html',
})
export class ProductCommentPage {

  shoppingCart: ShoppingItem[]; 
  baseUrl: string;
  products: Product[];
  orderId: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, /*private storage: Storage,*/
  			@Inject('API_BASE_URL') private apiUrl: string) 
  {
  	this.shoppingCart = new Array<ShoppingItem>(new ShoppingItem());
  	this.baseUrl = this.apiUrl;

    this.shoppingCart = this.navParams.get('shoppingCart');
    this.orderId = this.navParams.get('orderId');

  }



  ionViewDidEnter() {
    /*
    if(this.shoppingCart && this.shoppingCart.length > 0) {
        // get back products info from server
        this.vjApi.getProductsByIds(JSON.stringify(this.shoppingCart)).subscribe((p) => {
            if(p) this.products = p.json();
        })
    }*/
    this.vjApi.showLoader();
    this.vjApi.getProductsNotCommented(this.orderId).subscribe((p) => {
      if(p) this.products = p;
      console.log(p);
    });
    this.vjApi.hideLoader();
  }

  toCommentForm(index: number) {
    this.navCtrl.push('ProductCommentFormPage', {product: this.products[index], orderId: this.orderId});
  } 
}
