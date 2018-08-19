import { Component, ViewChild, Inject } from '@angular/core';
import { NavController, Content, App, Events } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { ProductCategory } from '../../models/product-category.model';
import { Product } from '../../models/product.model';
import { ProductSubCategory } from '../../models/product-sub-category.model';
import { ProductBySubCategory } from '../../models/product-by-sub-category.model';

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
  productBySubCategories: ProductBySubCategory[];

  products: Product[];
  products1: Product[];

  products_1: Product[];
  products_2: Product[];
  products_3: Product[];

  category_1: Product[];
  category_2: Product[];
  category_3: Product[];

  baseUrl: string;

  constructor(public navCtrl: NavController, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string,
            private app: App, private events: Events) {
  	this.productCategories = new Array<ProductCategory>();
    this.productBySubCategories = new Array<ProductBySubCategory>();

  	this.products = new Array<Product>();
    this.products1 = new Array<Product>();

    // Array for display products in 3 columns a row
    this.products_1 = new Array<Product>();
    this.products_2 = new Array<Product>();
    this.products_3 = new Array<Product>();

	  this.clickedItemIndex = 0;
	  this.baseUrl = this.apiUrl;

    // start to show loader
    this.vjApi.showLoader();

    // Get Product Categories
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
    //Set Sub Categories
    this.vjApi.showLoader();
    this.getProducts(id);
    this.vjApi.hideLoader();
  }


  toProductDetail(productId: number): void {
    this.app.getRootNav().push('ProductDetailPage', {productId});
  }

  getProducts(categoryId: number) {
    this.vjApi.getProducts(categoryId).subscribe(
      (data) => {


        this.productBySubCategories = [];

        let preRecord: Product;
        let subCategory: ProductSubCategory;
        let tempProducts: Product[] = new Array<Product>();

        if(data.length > 0) {
          preRecord = data[0];
          subCategory = new ProductSubCategory(data[0].product_sub_category_id, data[0].product_sub_category_name);
        } else return;
       
        let index =0;
        let saved = false;
        for(let i = 0; i < data.length; i++) {
          index = i;
          if(data[i].product_sub_category_id === preRecord.product_sub_category_id) {
            tempProducts.push(data[i]);
            preRecord = data[i];
            saved = false;
            continue;
          }
          this.productBySubCategories.push(new ProductBySubCategory(subCategory, tempProducts));
          saved = true;
          tempProducts = [];
          tempProducts.push(data[i]);
          preRecord = data[i];
          subCategory = new ProductSubCategory(data[i].product_sub_category_id, data[i].product_sub_category_name);
        }

        if(!saved) {
          this.productBySubCategories.push(new ProductBySubCategory(subCategory, tempProducts));
        }

      },
      (err) => {
          console.log(err);
      }
    );
  }
}
