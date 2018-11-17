import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { NavController, Content, App, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { ProductCategory } from '../../models/product-category.model';
import { Product } from '../../models/product.model';
import { ProductSubCategory } from '../../models/product-sub-category.model';
import { ProductBySubCategory } from '../../models/product-by-sub-category.model';
import { Constants } from '../../models/constants.model';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {
  @ViewChild(Content) content: Content;
  @ViewChild('sortlist') sortlist: ElementRef;

  gridHeight: string;
  scrollHeightForAll: string;
  scrollHeightForCat: string;
  scrollHeightMenu: string;
  clickedItemIndex: number;

  productCategories: ProductCategory[];
  productBySubCategories: ProductBySubCategory[];

  products: Product[];

  baseUrl: string;

  allProductsSelected: boolean = true;
  city: string = '';
  loggedIn: boolean = false;
  mobile: string;

  constructor(public navCtrl: NavController, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string,
            private app: App, private storage: Storage, private events: Events) 
  {
  	this.productCategories = new Array<ProductCategory>();
    this.productBySubCategories = new Array<ProductBySubCategory>();

  	this.products = new Array<Product>();

	  this.clickedItemIndex = 0;
	  this.baseUrl = this.apiUrl;

    this.events.subscribe('login_success', (loggedIn, mobile, shippingAddress) => {
      this.loggedIn = loggedIn;
      this.mobile = mobile;
    })

    // start to show loader
    this.vjApi.showLoader();

    // Get Product Categories
    this.vjApi.getProductCategories().subscribe( 
      (data) => {
        this.productCategories = data;
      },
      (err) => {
        console.log(err);

      });  
  }

  ngOnInit() {
    this.storage.ready().then(() => {
      this.storage.get(Constants.LOCATION_KEY).then((data) => {
        this.city = data;
      })
      this.storage.get(Constants.LOGIN_KEY).then((l) => {
        if(l) this.loggedIn = l;
      })
    })
  }

  getAllProducts() {
      this.vjApi.getProductAll().subscribe(
        (data) => {
          if(data) this.products = data;
        },
        (err) => {
          console.log(err);
        }
      );      
  }

  ionViewDidEnter() {

  	let scroll = this.content.getScrollElement();
  	scroll.style.overflowY = 'hidden';

  	let h =  this.content.contentHeight;

    this.scrollHeightMenu = h + 'px';
    this.scrollHeightForCat = h + 'px';
    this.gridHeight = h +'px';

    //console.log(this.sortlist.nativeElement.height);

    h = h - this.content.contentBottom + 7;
  	this.scrollHeightForAll = h + 'px';

    this.getAllProducts();
    this.vjApi.hideLoader();
  }

  reload(refresher) {
    this.getAllProducts();
    refresher.complete();
  }

  itemSelected(index: number, id?: number): void {
  	this.clickedItemIndex = index;
    if(index == 0) {
      this.allProductsSelected = true;
    }
    else this.allProductsSelected = false;

    //Set Sub Categories
    this.vjApi.showLoader();
    if(index == 0) 
      this.getAllProducts();
    else
      this.getProducts(id);
    this.vjApi.hideLoader();
  }


  toProductDetail(productId: number): void {
    this.app.getRootNav().push('ProductDetailPage', {productId});
  }

  getProducts(categoryId: number) {
    this.vjApi.getProductsV2(categoryId).subscribe((data) => {
      console.log(data);      
      if(data.length > 0) {
        this.productBySubCategories = data;
        return;
      } 
    })
/*
    this.vjApi.getProducts(categoryId).subscribe(
      (data) => {
        this.productBySubCategories = [];

        let preRecord: Product;
        let subCategory: ProductSubCategory;
        let tempProducts: Product[] = new Array<Product>();

        if(data.length > 0) {
          preRecord = data[0];
          subCategory = new ProductSubCategory(data[0].product_sub_category_id, data[0].product_sub_category_name);
        } else {
          console.log('no products retrieved');
          return;
        }

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
    );*/

  }

  priceSortUp() {
    this.products.sort((a, b) => {
      if(a.price - b.price > 0) return 1;
      if(a.price - b.price < 0) return -1;
      return 0;
    });
  }

  priceSortDown() {
    this.products.sort((a, b) => {
      if(a.price - b.price > 0) return -1;
      if(a.price - b.price < 0) return 1;
      return 0;
    });
  }

  soldAmountSortUp() {
    this.products.sort((a, b) => {
      if(a.sold_amount - b.sold_amount > 0) return 1;
      if(a.sold_amount - b.sold_amount < 0) return -1;
      return 0;
    });
  }

  soldAmountSortDown() {
    this.products.sort((a, b) => {
      if(a.sold_amount - b.sold_amount > 0) return -1;
      if(a.sold_amount - b.sold_amount < 0) return 1;
      return 0;
    });
  }

   toSearchPage(): void {
    this.app.getRootNav().push('SearchPage');
  }

  // distributor functions
  goMulti(): void {
    // check if the distributor has logged in
    this.storage.ready().then(() => {
      this.storage.get(Constants.DISTRIBUTOR_LOGIN_KEY).then((l) => {
        console.log(l);
        if(l) { 
          let mobile: string;
          this.storage.get(Constants.DISTRIBUTOR_MOBILE).then((m) => {
            if(m) {
              mobile = m;
              // check if the distributor still in valid login duration
              this.vjApi.showLoader();

              this.vjApi.checkDistributorLogin(mobile).subscribe((resp) => {
                console.log(resp.json());
                console.log(mobile);
                let login = resp.json();
                console.log(login.valid);
                if(login.valid) {
                  this.vjApi.hideLoader();
                  this.app.getRootNav().push('DistributorToolsPage', {mobile: mobile});
                }
                else {
                  this.vjApi.hideLoader();
                  this.storage.remove(Constants.DISTRIBUTOR_LOGIN_KEY);
                  this.storage.remove(Constants.DISTRIBUTOR_MOBILE);
                  this.app.getRootNav().push('LoginPage', {user: 'distributor'});
                }
              }, (err) => {
                console.log(err);
                this.vjApi.hideLoader();
                this.app.getRootNav().push('LoginPage', {user: 'distributor'});
              })                   
            }
          });             
        } else {
          this.app.getRootNav().push('LoginPage', {user: 'distributor'});
        }
      })
    })
   
   // this.app.getRootNav().push('LoginPage', {user: 'distributor'});
   //this.app.getRootNav().push('DistributorToolsPage');
  }


  getLocation() {
    if(this.loggedIn) {
      this.app.getRootNav().push('ManageAddressPage');
    } else {
      this.app.getRootNav().push('LoginPage');
    }
  }
}
