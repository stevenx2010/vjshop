import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { Product } from '../../models/product.model';
import { ProductDetailImage } from '../../models/product-detail-image.model';
import { ShoppingItem } from '../../models/shopping-item.model';
import { Constants } from '../../models/constants.model';
import { Address } from '../../models/address.model';
import { DistributorAddress } from '../../models/distributor-address-model';
import { Distributor } from '../../models/distributor-model';

import { CartPage } from '../cart/cart';

import { trigger, state, style, animate, transition } from '@angular/animations';


@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
  animations: [
    trigger('cart', [
        state('idle', style({opacity:'0.8', transform: 'scale(1)'})),
        state('adding', style({opacity: '1', transform: 'scale(1.5)'})),
        transition('idle <=> adding', animate('400ms linear')),
        transition('void => *', [
            style({transform: 'translateX(200%)'}),
            animate('300ms ease-in-out')
          ])
      ])
  ]
})
export class ProductDetailPage {

  images_1: ProductDetailImage[];
  images_2: ProductDetailImage[];
  products: Product[];
  productId: number;
  numberOfProducts: number;
  shoppingCart: ShoppingItem[];
  shoppedItems: number;
  shippingAddress: Address;

  eventsPublished: boolean = false; 
  addressBtnCaption: string = '新建地址';

  mobile: string;

  distributor: Distributor;
  distributorAddress: DistributorAddress;
  inventory: number = 0;

  cartState = 'idle';

  constructor(private navCtrl: NavController, private navParams: NavParams, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string,
              private storage: Storage, private app: App, private events: Events, private alertCtrl: AlertController) {
  	this.images_1 = new Array<ProductDetailImage>();
  	this.images_2 = new Array<ProductDetailImage>();
  	this.products = new Array<Product>(new Product());
    this.shoppingCart = new Array<ShoppingItem>();
    this.shippingAddress = new Address();

  	this.productId = this.navParams.get('productId');
    this.numberOfProducts = 1;
    this.shoppedItems = 0;

    this.distributor = new Distributor();

    this.events.subscribe('login_success', (logged_in, mobile, address) => {
      this.mobile = mobile;
      this.shippingAddress = address;
      this.addressBtnCaption = '管理地址';
      this.getAddress();
    });
  }

  ionViewWillUnload() {
    this.events.unsubscribe('login_success', () => console.log());
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

      // Step 1-2: Get mobile
      this.storage.get(Constants.USER_MOBILE_KEY).then((m) => {
        if(m) this.mobile = m;
      })

      //step 1-2: Get shipping address
      this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then((address) => {
        if(address) {
            this.shippingAddress = address;
            this.addressBtnCaption = '管理地址';
        }

            // step 1-3: Get distributor according to this address
  //          this.getDistributorByLocation(this.shippingAddress.city);
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
  	this.vjApi.getProductById(this.productId).subscribe(
  		(data) => {
  			this.products = data;
        console.log(this.products);
  			//console.log(this.detailInfo);

  		},
  		(err) => {
  			console.log(err);
  		}
  	);




  }

  ionViewDidEnter() {
    this.getAddress();    
    this.vjApi.hideLoader();
  }

  getAddress() {
    // update shopping address
    if(this.mobile) {
 //     this.vjApi.showLoader();
      this.vjApi.getDefaultAddress(this.mobile).subscribe((a) => {
        if(a && a.length > 0) {

          this.shippingAddress = a[0];
          console.log(a);

          // store it to local
          this.storage.ready().then(() => {
            this.storage.set(Constants.SHIPPING_ADDRESS_KEY, this.shippingAddress);
          });

          // get distributor by location
          let city = this.shippingAddress.city.split(' ');
          //console.log(city);
          if(city.length > 0)
            this.getDistributorByLocation(city[0]);         
        }
      });
//      this.vjApi.hideLoader();
    } 
  }

  getDistributorByLocation(city: string) {
    this.distributorAddress = new DistributorAddress();
    this.distributor = new Distributor();

    this.vjApi.getDistributorInfoByLocation(city).subscribe((d) => {
      console.log(d);
      if(d) {
        this.distributor = d;
        this.distributorAddress = this.distributor.addresses[0];

        // get inventory of this product
        this.vjApi.getDistributorInventoryByProductId(this.distributorAddress.distributor_id, this.productId).subscribe((inv) => {
            this.inventory = inv;
        }); 
      } else {
        this.distributorAddress = null;
        this.inventory = 0;
      }
    });
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
    if((this.shippingAddress == null) || (this.shippingAddress && this.shippingAddress.city == '')) {
      this.doPrompt('您没有送货地址，请先增加配送地址，然后在购买。');
      return;
    }

    if((this.distributorAddress == null) || (this.distributorAddress && this.distributorAddress.city == '')) {
      this.doPrompt('您所在的区域没有经销商，暂时无法购买，请致电0512-57880688；或者更换其他配送地址重新购买，谢谢您的理解。');
      return;
    }

    this.cartState = 'adding';

      // if the shopping cart is empty, then we create a new item & put it in
      if(this.shoppingCart.length < 1) {
 
        let item = new ShoppingItem();
        item.productId = this.productId;
        item.quantity = this.numberOfProducts;
        item.price = this.products[0].price;
        item.weight = this.products[0].weight;
        item.weight_unit = this.products[0].weight_unit;
        item.selected = true;
        this.shoppingCart.push(item);

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
          let item = new ShoppingItem();
          item.productId = this.productId;
          item.quantity = this.numberOfProducts;
          item.price = this.products[0].price;
          item.weight = this.products[0].weight;
          item.weight_unit = this.products[0].weight_unit;
          item.selected = true;
          this.shoppingCart.push(item);
        }
      }
      //  console.log(this.products[0]);
      //      console.log(this.shoppingCart);

      this.shoppedItems += Number(this.numberOfProducts);
      this.storage.ready().then(() => {
        this.storage.set(Constants.SHOPPING_CART_KEY, this.shoppingCart);

        // publish an event on item added
        this.events.publish('shopping_cart_item_added', this.shoppingCart);
       });    

    setTimeout(() => {
      this.cartState = 'idle';
    }, 300);
  }

  calculateShoppedItems(shoppingCart: ShoppingItem[]): number {

    let total = 0;
    for(let key in this.shoppingCart) {
      total += this.shoppingCart[key].quantity;
    }

    console.log('total', total);

    return total;
  }

  manageAddress(): void {

    if(this.addressBtnCaption == "新建地址") {
        // check if user has logged in
      this.storage.ready().then(() => {
        this.storage.get(Constants.LOGIN_KEY).then((data) => {
          if(data) {     
            this.app.getRootNav().push('AddAdressPage', {mobile: this.mobile, action: 'create'});   
          }
          else
            this.app.getRootNav().push('LoginPage');
        });
      });
    } else {
        this.app.getRootNav().push('ManageAddressPage', {mobile: this.mobile, action: 'edit'});
    }
  }

  toShoppingCartPage() {
    this.app.getRootNav().push(CartPage);
  }

  doPrompt(msg) {
    let alert = this.alertCtrl.create();
    alert.setTitle('提示');
    alert.setMessage(msg);
    alert.addButton('确定');

    alert.present();
  }
}
