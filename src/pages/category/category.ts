import { Component, ViewChild, Inject } from '@angular/core';
import { NavController, Content, App } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { ProductCategory } from '../../models/product-category.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {
  @ViewChild(Content) content: Content;

  gridHeight: string;
  scrollHeight: string;
  clickedItemIndex: number;

  productCategories: ProductCategory[];
  products: Product[];
  products_1: Product[];
  products_2: Product[];
  products_3: Product[];
  baseUrl: string;

  constructor(public navCtrl: NavController, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string,
            private app: App) {
  	this.productCategories = new Array<ProductCategory>();
  	this.products = new Array<Product>();
    this.products_1 = new Array<Product>();
    this.products_2 = new Array<Product>();
    this.products_3 = new Array<Product>();

	  this.clickedItemIndex = 0;
	  this.baseUrl = this.apiUrl;

    this.vjApi.showLoader();
    this.vjApi.getProductCategories().subscribe( 
      (data) => {
        this.productCategories = data;
//      this.vjApi.hideLoader();
      },
      (err) => {
        console.log(err);
//      this.vjApi.hideLoader();
      });  


//   this.vjApi.hideLoader();


  }

  ionViewWillLoad() {
     this.vjApi.getProductAll().subscribe(
        (data) => {
          this.products = data;
          for(let i = 0; i < data.length; i += 3) {
            this.products_1.push(data[i]);
            if(i+1 < this.products.length)
              this.products_2.push(data[i+1]);
            if(i+2 < this.products.length)
            this.products_3.push(data[i+2]);
          }

//          this.vjApi.hideLoader();
        },
        (err) => {
          console.log(err);
//          this.vjApi.hideLoader();
        }
      );   
    this.vjApi.hideLoader();
  }

  ionViewDidEnter() {
  	let scroll = this.content.getScrollElement();
  	scroll.style.overflowY = 'hidden';

  	let h = this.content.contentHeight;
  	this.gridHeight = h +'px';
  	this.scrollHeight = this.gridHeight;


  }


  itemSelected(index: number, id?: number): void {
  	this.clickedItemIndex = index;
  }


  toProductDetail(productId: number): void {
    this.app.getRootNav().push('ProductDetailPage', {productId});
  }
}
