import { Component, ViewChild, Inject, ElementRef, Renderer2 } from '@angular/core';
import { Content, Slides, NavController, App, Platform, AlertController, Events } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { Storage } from '@ionic/storage';
//import { Geolocation } from '@ionic-native/geolocation';

import { VJAPI } from '../../services/vj.services';
import { Image } from '../../models/image.model';
import { Constants } from '../../models/constants.model';
import { CouponItem } from '../../models/coupon-item.model';
import { InitEnv } from '../../utils/initEnv';
import { Address } from '../../models/address.model';

//import { Http } from '@angular/http';

//import { CoordinateTransform } from '../../services/baidu.gps.service';
import { AppVersion } from '@ionic-native/app-version';

declare let cordova: any;

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
  appLatestVersion: string;

  downloadUrl_android: string = '<a href="https://vjshop.venjong.com/vjshop.apk">稳卓商城</a>';
  downloadUrl_ios: string = '<a href="#">稳卓商城</a>';

  constructor(public navCtrl: NavController, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string, 
              private app: App, private storage: Storage, /*private geolocation: Geolocation, */
              /*private coordtrans: CoordinateTransform,*/ private platform: Platform, private init: InitEnv,
              private alertCtrl: AlertController, private events: Events, private appVersion: AppVersion,
              private domSanitizer: DomSanitizer, private renderer: Renderer2 ) 
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

    // Get current location
    this.platform.ready().then(() => {
       cordova.plugins.baidumap_location.getCurrentPosition((data) => {

        let result = data;
        this.city = result.province;//;'北京市'
        if(this.city && this.city !=  '') {
         this.storage.ready().then(() => {
           this.storage.set(Constants.LOCATION_KEY, this.city);
         })
        }
     });
    });

    // check if there's new version available
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
    });

    // Get video for home page: postion 5: for home page
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
    }, (err) => {
      this.doPrompt('请检查是否有网络连接!');
    });   
  }

  ionViewDidEnter() {
    this.initialize();
  	this.contentWidth = this.content.contentWidth;
  	this.contentHeight = this.content.contentHeight;
  	this.slides.autoplayDisableOnInteraction = false;
  	this.slides.startAutoplay();
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

  			this.vjApi.hideLoader();
  		},
  		(err) => {
  			console.log('error: ', err);
        this.doPrompt('请检查是否有网络连接!');
  			this.vjApi.hideLoader();
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
