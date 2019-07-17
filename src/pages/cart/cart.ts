import { Component, Inject, ViewChild } from '@angular/core';
import { NavController, App, Events, AlertController, Toolbar, Navbar, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Constants } from '../../models/constants.model';
import { Address } from '../../models/address.model';
import { VJAPI } from '../../services/vj.services';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Product } from '../../models/product.model';
import { CategoryPage } from '../category/category';

import { Loader } from '../../utils/loader';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  @ViewChild(Toolbar) toolbar: Toolbar;
  @ViewChild(Navbar) navbar: Navbar;

  loggedIn: boolean = false;
  noAddress: boolean = true;
  noItemSelected: boolean = false;
  mobile: string;
  shippingMobile: string;
  address: Address;
  shoppingCart: ShoppingItem[];
  products: Product[];
  model: string;
  baseUrl: string;
  shoppingCartEmpty: boolean;
  currentSelectedItem: number;
  totalPrice: number = 0;
  totalWeight: number = 0;
  weightUnit: string = '';

  checkedAll: boolean = true;

  shoppingItemsChanged: boolean = false;

  toPayBtnDisabled: boolean = true;

  constructor(public navCtrl: NavController, private storage: Storage, private app: App, private events: Events, private vjApi: VJAPI,
  				@Inject('API_BASE_URL') private apiUrl: string, private alertCtrl: AlertController, private toastCtrl: ToastController,
          private loadingCtrl: LoadingController) 
  { 	
  	this.address = new Address();
  	this.shoppingCart = new Array<ShoppingItem>();
  	this.products = new Array<Product>();
  	this.baseUrl = this.apiUrl;

    this.events.subscribe('login_success', (loggedIn, mobile, address) => {
       this.loggedIn = true;
       if(mobile != null) this.mobile = mobile;
       if(address.city != null || address.city != '') {
         this.address = address;
         this.shippingMobile = this.hidePartOfMobile(this.address.mobile);
         this.noAddress = false;
       }
       else {
         this.getShippingAddressAndMobile();  
       }

       this.getShoppingItem();
    });

    this.events.subscribe('logout', (param) => {
      this.address = new Address();
      this.loggedIn = false;
      this.mobile = '';
      this.noAddress = true;
      this.shippingMobile = '';
    });    

    this.events.subscribe('address_changed', () => {
      this.getShippingAddressAndMobile();
      this.getShoppingItem();
    });

    this.events.subscribe('order_submitted', () => {
      this.totalWeight = 0;
      this.totalPrice = 0;
      this.shoppingCart = [];
      this.getShoppingItem();
    });
  }

  ionViewWillLoad() {
    this.navbar.backButtonClick = (e: UIEvent) => {
    this.events.publish('shopping_items_changed');  
    this.navCtrl.pop();    
    }

    this.storage.ready().then(() => {
      // check if loggin
      this.storage.get(Constants.LOGIN_KEY).then((l) => {
        if(l) this.loggedIn = true;
        else this.loggedIn = false;
      });    
    });
    this.getShippingAddressAndMobile();
  }

  ionViewDidEnter() {
    if(!this.shoppingCartEmpty) {
      this.presentToaster();
    }
    this.getShoppingItem();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('login_success');
    this.events.unsubscribe('logout');
    this.events.unsubscribe('address_changed');
    if(this.shoppingItemsChanged) this.events.publish('shopping_items_changed');
  }

  hidePartOfMobile(mobile) {
     let regex = /^(\d{3})\d{4}(\d{4})$/gi;
     return mobile.replace(regex, '$1****$2');
 
  }

  getShippingAddressAndMobile() {
    this.storage.ready().then(() => {  
      this.storage.get(Constants.USER_MOBILE_KEY).then((m) => {
        if(m) {
          this.mobile = m;
        }
        else this.mobile = '';
      });

      this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then((r) => {
          if(r) {
            this.address = new Address();
            this.address = r;
            this.noAddress = false;
            this.shippingMobile = this.address.mobile;
            this.shippingMobile = this.hidePartOfMobile(this.shippingMobile);
          } else {
            r = new Address();
            this.noAddress = true;
          }
      })
    });   
  }

  getShoppingItem() {
      this.storage.get(Constants.SHOPPING_CART_KEY).then((data: ShoppingItem[]) => {
        if(data == null || data.length < 1)  {
          this.shoppingCartEmpty = true;
          this.totalWeight = 0;
          this.totalPrice = 0;
          return;
        } else
          this.shoppingCartEmpty = false;

        this.shoppingCart = data;

        this.calculateTotle();

        let loader = new Loader(this.loadingCtrl);
        loader.show();
        this.vjApi.getProductsByIds(JSON.stringify(this.shoppingCart)).subscribe(
          (data) => {
            this.products = data.json();      
            this.toPayBtnDisabled = false;
            loader.hide();
          },
          (err) => {
            console.log(err);
            this.toPayBtnDisabled = true;
            loader.hide();
          });        
      });    
  }

  toLoginPage(): void {
     this.app.getRootNav().push('LoginPage');
     //this.navCtrl.push('LoginPage');
  }

  toManageAddressPage() {
  	this.app.getRootNav().push('ManageAddressPage');
  }

  toProductDetailPage(productId: number) {
  	this.app.getRootNav().push('ProductDetailPage', {productId});
  }

  toCategoryPage() {
    this.navCtrl.push(CategoryPage);
  }

  selectionChange(index: number) {
   // console.log(this.shoppingCart[index].price);
   // console.log(this.shoppingCart[index].selected);

    this.weightUnit = this.shoppingCart[index].weight_unit;
    this.calculateTotle();
    this.storage.ready().then(() => {
      this.storage.set(Constants.SHOPPING_CART_KEY, this.shoppingCart);
    })
    this.shoppingItemsChanged = true;
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

          if(this.shoppingCart == null) {
            this.totalWeight = 0;
            this.totalPrice = 0;
            return;
          }
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

          
          if(tempChart.length > 0) {
            this.products = [];
            this.products = tempProducts;
            this.shoppingCart = [];
            this.shoppingCart = tempChart;
            this.shoppingCartEmpty = false;

            this.storage.ready().then(() => {
              this.storage.set(Constants.SHOPPING_CART_KEY, tempChart);

            }).catch(console.log);
          } else {
            this.shoppingCartEmpty = true;
            this.storage.remove(Constants.SHOPPING_CART_KEY);
            this.products = new Array<Product>();
          }

          this.calculateTotle();
          this.shoppingItemsChanged = true;
        }
      });

    alert.addButton({
      text: '取消',
      role: 'cancel',
      handler: () => {}
    });

    alert.present();
  }

  quantityChange(event, index: number) {
    this.shoppingCart[index].quantity = event;
    this.storage.ready().then(() => {
      this.storage.set(Constants.SHOPPING_CART_KEY, this.shoppingCart);
      this.calculateTotle();
    }).catch(console.log);

    this.shoppingItemsChanged = true;
  }

  calculateTotle() {
    this.totalPrice = 0;
    this.totalWeight = 0;
    if(!this.shoppingCartEmpty) {
      
      let selectionStatus: boolean = true;

      for(let item of this.shoppingCart) {
        selectionStatus = selectionStatus && item.selected;
        

        if(item.selected) {
          this.totalPrice += item.price * item.quantity;
          this.totalWeight += item.weight *item.quantity;
          this.weightUnit = item.weight_unit;
        }
      }
      if(selectionStatus) this.checkedAll = true;
      else this.checkedAll = false;
    }

    if(this.totalPrice <= 0) {
      this.noItemSelected = true;
    } else {
      this.noItemSelected = false;
    }
  }

  toPaymentPage() {
    console.log(this.shoppingCart);
    this.app.getRootNav().push('ConfirmOrderPage');
  }

  checkAll(event) {
    if(event.checked) {
      this.totalPrice = 0;
      this.totalWeight = 0;
      for(let i = 0; i < this.shoppingCart.length; i++) {
        this.shoppingCart[i].selected = true;
        this.totalPrice += this.shoppingCart[i].price *this.shoppingCart[i].quantity;
        this.totalWeight += this.shoppingCart[i].weight * this.shoppingCart[i].quantity;
      }

      this.storage.ready().then(() => {
        this.storage.set(Constants.SHOPPING_CART_KEY, this.shoppingCart);
      });
    }
  }

  clearCart() {
    this.doPrompt();
  }

  doClearCart() {
    this.storage.ready().then(() => {
      this.shoppingCart = [];
      this.shoppingCartEmpty = true;
      this.totalPrice = 0;
      this.totalWeight = 0;
      this.storage.remove(Constants.SHOPPING_CART_KEY);
    });    

    this.shoppingItemsChanged = true;
  }

  doPrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('警告');
    alert.setMessage('请确认是否真的要清空购物车？');
    alert.addButton({
      text: '清空',
      handler: () => {
        this.doClearCart();
      }
    });
    alert.addButton('取消');

    alert.present();
  }

  presentToaster() {
    let toast = this.toastCtrl.create({
      message: '向左滑动收货地址栏可清空购物车。',
      duration: 3500,
      position: 'top'
    });

    toast.present();
  }
}


