import { Component, ViewChild, Inject } from '@angular/core';
import { Content, Slides, NavController, App,Platform } from 'ionic-angular';
import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { VJAPI } from '../../services/vj.services';
import { Image } from '../../models/image.model';
import { Constants } from '../../models/constants.model';
import { CouponItem } from '../../models/coupon-item.model';
import { InitEnv } from '../../utils/initEnv';
import { Address } from '../../models/address.model';

import { Http } from '@angular/http';

import { CoordinateTransform } from '../../services/baidu.gps.service';

//declare let cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  remoteImages: Image[][];
  imageUrls: string[][];

  // Image urls for area 1, 2, 3, and 4
  imageUrls_1: string[] = [''];
  imageUrls_2: string[] = [''];
  imageUrls_3: string[] = [''];
  imageUrls_4: string[] = [''];

  contentWidth: number;
  contentHeight: number;

  loggedIn: boolean = false;

  city: string = '';
  mobile: string = '';
  couponWallet: Set<CouponItem>;
  address: Address;

  constructor(public navCtrl: NavController, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string, 
              private http: Http, private app: App, private storage: Storage, private geolocation: Geolocation, 
              private coordtrans: CoordinateTransform, private platform: Platform, private init: InitEnv ) 
  {
  	// initialize arrays
  	this.remoteImages = new Array<Array<Image>>();
  	this.imageUrls = new Array<Array<string>>();

    this.couponWallet = new Set<CouponItem>();
  }


  ngOnInit(): void {
   this.platform.ready().then(() => {
//     cordova.plugins.baidumap_location.getCurrentPosition((data) => {

  //     let result = data;
      this.city = '北京市'//result.province;
       this.storage.ready().then(() => {
         this.storage.set(Constants.LOCATION_KEY, this.city);
       })
     });
//   });


this.initialize();
  }


  ionViewDidEnter() {
  	this.contentWidth = this.content.contentWidth;
  	this.contentHeight = this.content.contentHeight;
  	this.slides.autoplayDisableOnInteraction = false;
  	this.slides.startAutoplay();
  }

  image_2: string;

  initialize() {
    //this.storage.remove(Constants.LOGIN_KEY);
    //this.storage.remove(Constants.SHOPPING_CART_KEY);
    // Step 1: check if user has logged in
    this.storage.ready().then((data) => {
      this.storage.get(Constants.LOGIN_KEY).then((data) => {
         console.log('aaaaaaaaaaaaaaaa', data);
        if(data) {
          console.log('login_key', data);
          this.loggedIn = true;
          //get mobile          

          this.init.getMobile().subscribe((result) => {
            if(result) {
              this.mobile = result;
              console.log('mobile', result);

              // check if there's user in the remote server
              this.vjApi.checkUserExist(this.mobile).subscribe((r0) => {
                console.log('rrrrrrrrrrrrrrrrrr', r0);
                if(!(r0.status)) {
                  this.loggedIn = false;
                  this.storage.remove(Constants.LOGIN_KEY);
                  this.storage.remove(Constants.SHIPPING_ADDRESS_KEY); 
                  this.storage.remove(Constants.USER_MOBILE_KEY);
                  this.storage.remove(Constants.COUPON_WALLET_KEY);
                } else {
                  // Get default address;
                  this.init.getUserAddresses(this.mobile).subscribe((r1) => {
                    console.log('address', r1);
                    if(r1) this.address = r1;
                  });
                } 
              })   
            }
          });
        } else {
          this.loggedIn = false;
          this.storage.remove(Constants.LOGIN_KEY);
          this.storage.remove(Constants.SHIPPING_ADDRESS_KEY);
          this.storage.remove(Constants.USER_MOBILE_KEY);
          this.storage.remove(Constants.COUPON_WALLET_KEY);
        }
      })
    })

  	this.vjApi.getHomePageImages().subscribe(
  		(data) => { 
  			this.remoteImages = data.json();

  			for(let i in this.remoteImages){
  				this.imageUrls[i] = new Array<string>();
  				for(let j in this.remoteImages[i]) {
  					this.imageUrls[i].push(this.apiUrl + this.remoteImages[i][j].image_url);
  				}
  			}

  			this.imageUrls_1 = this.imageUrls[1];
  			this.imageUrls_2 = this.imageUrls[2];
  			this.imageUrls_3 = this.imageUrls[3];
  			this.imageUrls_4 = this.imageUrls[4];

  			this.http.get(this.imageUrls_2[0]).subscribe((data1) => this.image_2 = data1.json());

  			this.vjApi.hideLoader();
  		},
  		(err) => {
  			console.log('error: ', err);
  			this.vjApi.hideLoader();
  		});
  }


  toSearchPage(): void {
    this.app.getRootNav().push('SearchPage');
  }

  //for test
  goMulti(): void {
   this.app.getRootNav().push('LoginPage', {user: 'distributor'});
   //this.app.getRootNav().push('DistributorToolsPage');
  }

  // Location current address by GPS
  getLocation() {
    this.geolocation.getCurrentPosition().then((data) => {
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
      let gcj = this.coordtrans.wgs84togcj02(data.coords.longitude, data.coords.latitude);
      let baidu = this.coordtrans.gcj02tobd09(gcj[0], gcj[1]);
      console.log(baidu);
      });
    
  }

  toCouponCenterPage(){
    this.app.getRootNav().push('CouponCenterPage');
  }

  toCouponForNewComerPage() {
    this.app.getRootNav().push('CouponForNewComerPage');
  }
}
