import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//import { DistributorOrdersPage } from '../distributor-orders/distributor-orders';
//import { DistributorInventoryPage } from '../distributor-inventory/distributor-inventory';
//import { DistributorStatisticsPage } from '../distributor-statistics/distributor-statistics';
//import { DistributorMyPage } from '../distributor-my/distributor-my';

/**
 * Generated class for the DistributorToolsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-distributor-tools',
  templateUrl: 'distributor-tools.html',
})
export class DistributorToolsPage {
	orders = 'DistributorOrdersPage';
	inventories = 'DistributorInventoryPage';
  statistics = 'DistributorStatisticsPage'
	my = 'DistributorMyPage';

  mobile: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mobile = this.navParams.get('mobile');
    console.log(this.mobile);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DistributorToolsPage');
  }

}
