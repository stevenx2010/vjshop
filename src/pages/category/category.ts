import { Component, ViewChild, Inject } from '@angular/core';
import { NavController, Content } from 'ionic-angular';

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
  baseUrl: string;

  constructor(public navCtrl: NavController, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string) {
  	this.productCategories = new Array<ProductCategory>();
  	this.products = new Array<Product>();
	this.clickedItemIndex = 0;
	this.baseUrl = this.apiUrl;

	this.getAllProductView();
  }

  ionViewWillLoad() {
 	this.vjApi.getProductCategories().subscribe( 
		(data) => {
			this.productCategories = data;
			this.vjApi.hideLoader();
			console.log('xxx', this.productCategories);
		},
		(err) => {
			console.log(err);
			this.vjApi.hideLoader();
		});  

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
  	console.log(index);
  }

  // Helper
  private getAllProductView(): void {
 		this.vjApi.getProductAll().subscribe(
  			(data) => {
  				this.products = data;
  				this.vjApi.hideLoader();
  			},
  			(err) => {
  				console.log(err);
  				this.vjApi.hideLoader();
  			}
  		);

  		this.vjApi.hideLoader();
  }
}
