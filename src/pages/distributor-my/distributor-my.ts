import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Distributor } from '../../models/distributor-model';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the DistributorMyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-distributor-my',
  templateUrl: 'distributor-my.html',
})
export class DistributorMyPage {

  distributor: Distributor;
  mobile: string;
  myInfo: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, private app: App) {
  	this.distributor = new Distributor();
  	this.mobile = this.navParams.data;
  	this.myInfo = '1';
  }

  ionViewWillLoad() {
    this.vjApi.getDistributorInfoByMobile(this.mobile).subscribe((data) => {
    	if(data) {
    		this.distributor = data;
    		console.log(this.distributor);
    	}
    });
  }

  exit() {
    this.app.getRootNav().push(TabsPage);
  }
}
