import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Product } from '../../models/product.model';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the DistributorInventoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-distributor-inventory',
  templateUrl: 'distributor-inventory.html',
})
export class DistributorInventoryPage {

  products: Product[];
  mobile: string;
  baseUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string, 
  				private app: App) 
  {
  	this.products = new Array<Product>();
  	this.mobile = this.navParams.data;
  	this.baseUrl = this.apiUrl;
  }

  ionViewDidEnter() {
    this.vjApi.getInventoriesOfDistributor(this.mobile).subscribe((data) => {
    	if(data.length > 0) {
    		this.products = data;
    	}
    })
  }

  exit() {
    this.app.getRootNav().push(TabsPage);
  }
}
