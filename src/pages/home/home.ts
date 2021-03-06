import { Component, ViewChild, Inject, ElementRef, Renderer2 } from '@angular/core';
import { Content, Slides, NavController, App, Platform, AlertController, Events, LoadingController } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { Storage } from '@ionic/storage';
//import { Geolocation } from '@ionic-native/geolocation';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { VJAPI } from '../../services/vj.services';
import { Image } from '../../models/image.model';
import { Constants } from '../../models/constants.model';
import { CouponItem } from '../../models/coupon-item.model';
import { InitEnv } from '../../utils/initEnv';
import { Address } from '../../models/address.model';
import { Location } from '../../models/location.model';

//import { Http } from '@angular/http';

//import { CoordinateTransform } from '../../services/baidu.gps.service';
import { AppVersion } from '@ionic-native/app-version';

import { Loader } from '../../utils/loader';

declare let baidumap_location: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  @ViewChild('video') video: ElementRef;

  remoteImages: Image[][];
  imageUrls: string[][];

  // Image urls for area 1, 2, 3, and 4
  imageUrls_1: string[] = [''];
  imageUrls_2: string[] = [''];
  imageUrls_3: string[] = [''];
  imageUrls_4: string[] = [''];

  videoUrl: any;
  trustedVideoUrl: SafeResourceUrl;
  displayVideo: boolean = true;
  videoClip: any;
  posterUrl: any;

  contentWidth: number;
  contentHeight: number;

  loggedIn: boolean = false;

  city: string = '';
  mobile: string = '';
  couponWallet: Set<CouponItem>;
  address: Address;
  location: Location;
  appLatestVersion: string;

  timeout_5: boolean = true;
  timeout_15: boolean = true;

  downloadUrl_android: string = '<a href="https://vjshop.venjong.com/vjshop.apk">稳卓商城</a>';
  downloadUrl_ios: string = '<a href="https://itunes.apple.com/cn/app/vjshop/id1475435585?mt=8">稳卓商城</a>';

  constructor(public navCtrl: NavController, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string, 
              private app: App, private storage: Storage, /*private geolocation: Geolocation, 
              private coordtrans: CoordinateTransform,*/ private platform: Platform, private init: InitEnv,
              private alertCtrl: AlertController, private events: Events, private appVersion: AppVersion,
              private domSanitizer: DomSanitizer, private renderer: Renderer2, private scrOrientation: ScreenOrientation,
              private loadingCtrl: LoadingController ) 
  {
  	// initialize arrays
  	this.remoteImages = new Array<Array<Image>>();
  	this.imageUrls = new Array<Array<string>>();

    this.couponWallet = new Set<CouponItem>();

    this.events.subscribe('login_success', (loggedIn, mobile, shippingAddress) => {
      this.loggedIn = loggedIn;
      this.mobile = mobile;
    });

    
  }

  ionViewWillLoad() {

    // Get current location stored
    this.storage.ready().then(() => {
      this.storage.get(Constants.LOCATION_KEY).then((data) => {
        if(data) {
          this.location = data;
          this.city = this.location.city;
        }
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });

    // get current location
    //this.getCurrentLoadtionByGPS();

    // get video
    this.getHomePageVideo();  

    // get images
    if(this.imageUrls.length < 1) {
      this.getHomePageImages();
    }

    // check if there's new version available
    //let loader = new Loader(this.loadingCtrl);
  }

  ionViewDidEnter() {
    this.initialize();

    // check app version after 5 minutes
    if(this.timeout_5) {
      this.checkAppVersion();
      this.timeout_5 = false;

      setTimeout(() => {
        this.timeout_5 = true;
      }, 5 * 60 * 1000);
    }

    // get current location after 15 minutes
    if(this.timeout_15) {
      this.getCurrentLoadtionByGPS();
      this.timeout_15 = false;

      setTimeout(() => {
        this.timeout_15 = true;
      }, 15 * 60 * 1000); 
    }

  	this.contentWidth = this.content.contentWidth;
  	this.contentHeight = this.content.contentHeight;
  	this.slides.autoplayDisableOnInteraction = false;
  	this.slides.startAutoplay();

    this.scrOrientation.unlock();
  }

  ionViewWillLeave() {
    this.scrOrientation.lock('portrait');
  }

  getCurrentLoadtionByGPS() {
    this.platform.ready().then(() => {
      baidumap_location.getCurrentPosition((data) => {

        let result = data;
        console.log(result);
        this.city = result.province;//;'北京市'
        if(this.city && this.city !=  '') {
         this.storage.ready().then(() => {
           //this.storage.set(Constants.LOCATION_KEY, this.city);
           this.location = new Location(data);
           console.log(this.location);
           this.storage.set(Constants.LOCATION_KEY, this.location);
         });
        }
       }, (err) => {
         console.log(err);
       });
    });    
  }

  checkAppVersion() {
    this.vjApi.getAppVersion().subscribe((v) => {
      let versions = v.json();
      if(versions.length > 0) {
        this.appLatestVersion = versions[0].latest_version;
        console.log(this.appLatestVersion);
        this.appVersion.getVersionNumber().then((currentVersion) => {
          console.log(currentVersion);
          if(currentVersion.trim() != this.appLatestVersion.trim()) {
            if(this.platform.is('android'))
              this.doPrompt('本APP有新版本：' + this.appLatestVersion + '，请在应用市场中下载更新；或点击' + this.downloadUrl_android + '下载并安装。' );
            else if(this.platform.is('ios'))
              this.doPrompt('本APP有新版本：' + this.appLatestVersion + '，请在App Store中下载更新；或点击' + this.downloadUrl_ios + '下载并安装。' );
          }         

          // get version number stored locally
        /*  this.storage.ready().then(() => {
            this.storage.get(Constants.VERSION_KEY).then((v) => {
              if(v == null || v.trim() != currentVersion.trim()) {
                this.storage.remove(Constants.LOCATION_KEY);
                this.storage.remove(Constants.LOGIN_KEY);
                this.storage.remove(Constants.SHOPPING_CART_KEY);
                this.storage.remove(Constants.SHIPPING_ADDRESS_KEY);
                this.storage.remove(Constants.COUPON_WALLET_KEY);
              } else {
                this.storage.set(Constants.VERSION_KEY, currentVersion.trim());
              }
            }, (err) => {
              this.storage.set(Constants.VERSION_KEY, currentVersion.trim());
            })
          })*/
        });
      }
      //loader.hide();
    }, (err) => {
      console.log(err);
    });    
  }

  initialize() {
    //this.storage.remove(Constants.LOGIN_KEY);
    //this.storage.remove(Constants.SHOPPING_CART_KEY);
    // Step 1: check if user has logged in
    this.storage.ready().then((data) => {
      this.storage.get(Constants.LOGIN_KEY).then((data) => {
        if(data) {
          console.log('login_key', data);
          this.loggedIn = true;
          this.storage.set(Constants.LOGIN_KEY, 1);
          //get mobile          

          this.init.getMobile().subscribe((result) => {
            if(result) {
              this.mobile = result;
              console.log('mobile', result);
              this.storage.set(Constants.USER_MOBILE_KEY, this.mobile);

              // check if there's user in the remote server
              //let loader = new Loader(this.loadingCtrl);
              //loader.show();
              this.vjApi.checkUserExist(this.mobile).subscribe((r0) => {
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
                    this.storage.set(Constants.SHIPPING_ADDRESS_KEY, this.address);
                  }, (err) => {
                  });

                  // Get coupons
                  this.getCouponsOfTheUser();
                } 
              }, (err) => {
                console.log('Home page: checkUserExist error');
              });   
            }
          });
        } else {
          this.loggedIn = false;
          this.storage.remove(Constants.LOGIN_KEY);
          this.storage.remove(Constants.SHIPPING_ADDRESS_KEY);
          this.storage.remove(Constants.USER_MOBILE_KEY);
          this.storage.remove(Constants.COUPON_WALLET_KEY);
        }
      });
    });


    // get images
    if(this.imageUrls.length < 1) {
      this.getHomePageImages();
    }
  }

  getHomePageImages() {

    let loader1 = new Loader(this.loadingCtrl);
    loader1.show();
    this.vjApi.getHomePageImages().subscribe((data) => { 
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

        loader1.hide();
      },
      (err) => {
        loader1.hide();
        console.log('Home Page: getHomePageImages error');
        this.doPrompt('图片获取失败：请检查是否有网络连接!');        
      });        
  }

  getHomePageVideo() {
    // Get video for home page: postion 5: for home page
    let loader1 = new Loader(this.loadingCtrl);
    loader1.show();
    this.vjApi.getVideoByPostion(5).subscribe((resp) => {
      console.log(resp);
      if(resp.status == 200) {
        let body = resp.json();
        if(body.length > 0) {
          this.videoUrl = this.apiUrl + body[0].video_url;
          this.posterUrl = this.apiUrl + body[0].poster_url;
          this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);

          this.videoClip = this.renderer.createElement('video');
          this.renderer.setAttribute(this.videoClip, 'width', '100%');
          this.renderer.setAttribute(this.videoClip, 'controls', 'controls');
          this.renderer.setAttribute(this.videoClip, 'muted', 'true');
 //         this.renderer.setAttribute(this.videoClip, 'autoplay', 'autoplay');
          this.renderer.setAttribute(this.videoClip, 'webkit-playsinline', 'webkit-playsinline');
          this.renderer.setAttribute(this.videoClip, 'poster', this.posterUrl);
          
          let source = this.renderer.createElement('source');
          this.renderer.setAttribute(source, 'src', this.videoUrl + '#t=0');
          this.renderer.setAttribute(source, 'type', 'video/mp4');

          this.renderer.appendChild(this.videoClip, source);
          this.renderer.appendChild(this.video.nativeElement, this.videoClip);

        } else {
          this.displayVideo = false;
        }
      } else { 
        this.displayVideo = false;     
      }
      loader1.hide();
    }, (err) => {
      loader1.hide();
      console.log('Home page: getHomePageVideo error');
      this.doPrompt('视频获取失败：请检查是否有网络连接!');
    });       
  }

  getCouponsOfTheUser() {
    //let loader = new Loader(this.loadingCtrl);
    //loader.show();
    this.vjApi.getCouponsByMobile(this.mobile).subscribe((coupons) => {
      if(coupons.length > 0) {
        coupons.forEach((item) =>{
          if(item.pivot.quantity == 0) item.has_used = true;
          else item.has_used = false;
          this.couponWallet.add(item);
        });

        this.storage.ready().then(() => {
          this.storage.remove(Constants.COUPON_WALLET_KEY);
          this.storage.set(Constants.COUPON_WALLET_KEY, this.couponWallet);
        });
      }
      //loader.hide();
    }, (err)=> {
      //loader.hide();
      console.log(err);
    });    
  }

  toSearchPage(): void {
    this.app.getRootNav().push('SearchPage');
  }

  //To distributor Login
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
              //let loader = new Loader(this.loadingCtrl);
              //loader.show();

              this.vjApi.checkDistributorLogin(mobile).subscribe((resp) => {
                console.log(resp.json());
                console.log(mobile);
                let login = resp.json();
                console.log(login.valid);
                if(login.valid) {
                  this.app.getRootNav().push('DistributorToolsPage', {mobile: mobile});
                }
                else {
                  this.storage.remove(Constants.DISTRIBUTOR_LOGIN_KEY);
                  this.storage.remove(Constants.DISTRIBUTOR_MOBILE);
                  this.app.getRootNav().push('LoginPage', {user: 'distributor'});
                }

                //loader.hide();
              }, (err) => {
                console.log(err);
                //loader.hide();
                this.app.getRootNav().push('LoginPage', {user: 'distributor'});
              })                   
            }
          });             
        } else {
          this.app.getRootNav().push('LoginPage', {user: 'distributor'});
        }
      });
    })
   
   // this.app.getRootNav().push('LoginPage', {user: 'distributor'});
   //this.app.getRootNav().push('DistributorToolsPage');
  }

  // Location current address by GPS
  /*
  getLocation() {
    this.geolocation.getCurrentPosition().then((data) => {
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
      let gcj = this.coordtrans.wgs84togcj02(data.coords.longitude, data.coords.latitude);
      let baidu = this.coordtrans.gcj02tobd09(gcj[0], gcj[1]);
      console.log(baidu);
      });
    
  }*/

  toCouponCenterPage(){
    this.app.getRootNav().push('CouponCenterPage');
  }

  toCouponForNewComerPage() {
    this.app.getRootNav().push('CouponForNewComerPage');
  }

  doPrompt(msg) {
    let alert = this.alertCtrl.create();
    alert.setTitle('提示');
    alert.setMessage(msg)
    alert.addButton('确定');

    alert.present();
  }


  getLocation() {
    if(this.loggedIn) {
      this.app.getRootNav().push('ManageAddressPage');
    } else {
      this.app.getRootNav().push('LoginPage');
    }
  }
}
