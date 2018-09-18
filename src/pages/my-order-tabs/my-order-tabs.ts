import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MyOrderTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-order-tabs',
  templateUrl: 'my-order-tabs.html',
})
export class MyOrderTabsPage {

  toPay: any = 'MyOrderToPayPage';
  toDeliver: any = 'MyOrderToDeliverPage';
  toReceive: any = 'MyOrderToReceivePage';
  toComment: any = 'MyOrderToCommentPage';

  mobile: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.mobile = this.navParams.get('mobile');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyOrderTabsPage');
  }

}
