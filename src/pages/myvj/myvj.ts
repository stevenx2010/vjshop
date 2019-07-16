import { Component } from '@angular/core';
import { NavController, Events, AlertController, App } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Constants } from '../../models/constants.model';

@Component({
  selector: 'page-myvj',
  templateUrl: 'myvj.html'
})
export class MyvjPage {

  mobile: string;
  isLoggedIn: boolean = false;

  constructor(public navCtrl: NavController, private storage: Storage, private events: Events, private alertCtrl: AlertController,
              private app: App ) 
  {
    this.events.subscribe('login_success', (logged_in, mobile, address) => {
      this.isLoggedIn = true;
      this.mobile = mobile;
    })
  }

  ionViewDidEnter()
  {
    this.storage.ready().then(() =>{
      this.storage.get(Constants.LOGIN_KEY).then((l) => {
        if(l) {
          this.isLoggedIn = true;
        }
      });

      this.storage.get(Constants.USER_MOBILE_KEY).then((m) => {
        if(m) {
          this.mobile = m;
          console.log(this.mobile);
        }
      });
    });   
  }

  logout() {
    if(this.isLoggedIn)
      this.doPrompt('请确认是否需要退出登录？');
    else
      this.doPrompt('您还没有登录！');
  }

  confirmedLogOut() {
    this.storage.remove(Constants.LOGIN_KEY);
    this.storage.remove(Constants.SHIPPING_ADDRESS_KEY);
    this.storage.remove(Constants.COUPON_WALLET_KEY);
    this.storage.remove(Constants.USER_MOBILE_KEY);
    this.storage.remove(Constants.SHOPPING_CART_KEY);
    this.events.publish('logout', Date.now());    
    this.mobile = null;
    this.isLoggedIn = false;
  }

  doPrompt(msg) {
    let alert = this.alertCtrl.create();
    alert.setTitle('确认');
    alert.setMessage(msg)
    alert.addButton({
      text: '确定',
      handler: () => {
        this.confirmedLogOut();
      }
    });
    alert.addButton('取消');

    alert.present();
  }

  toAboutVj() {
    this.app.getRootNav().push('AboutVjPage');
  }

  toManageAddress() {
    if(this.isLoggedIn)
      this.app.getRootNav().push('ManageAddressPage', {mobile: this.mobile, action: 'edit'});
    else
      this.app.getRootNav().push('LoginPage');
  }

  toContactUs() {
    this.app.getRootNav().push('ContactUsPage');
  }

  toMyOrder() {
    if(this.isLoggedIn) {
      let params = {'mobile': this.mobile, 'status': 'fromMyvjPage'}
      this.app.getRootNav().push('MyOrderTabsPage', {params: params});
    }
    else
      this.app.getRootNav().push('LoginPage');
  }

  toMyCoupon() {
    if(this.isLoggedIn)
      this.app.getRootNav().push('MyCouponPage', {mobile: this.mobile});
    else
      this.app.getRootNav().push('LoginPage');
  }

  toMyComment() {
    this.app.getRootNav().push('MyCommentListPage', {mobile: this.mobile});
  }

  toCustomerService() {
    this.app.getRootNav().push('CustomerServicePage', {mobile: this.mobile});
  }

  toQuestionAndAnswer() {
    this.app.getRootNav().push('QuestionAndAnswerPage');
  }

}
