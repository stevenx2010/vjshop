import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { VJAPI } from '../../services/vj.services';


@IonicPage()
@Component({
  selector: 'page-distributor-statistics',
  templateUrl: 'distributor-statistics.html',
})
export class DistributorStatisticsPage {
  mobile: string;
  date1: any;
  date2: any;

  numOfWaiting: number;
  numOfDelivered: number;
  numOfConfirmed: number;
  total: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, private app: App) {
  	this.mobile = this.navParams.data;
  }

  ionViewDidLoad() {

  }

  exit() {
    this.app.getRootNav().push(TabsPage);
  }

  doSummary() {
  	console.log(this.date1)
  	let body = {
  		'mobile': this.mobile,
  		'date1': this.date1,
  		'date2': this.date2
  	}

  	this.vjApi.showLoader();
  	this.vjApi.summaryOfDistributorOrders(body).subscribe((s) => {
  		console.log(s);
  		let summary = s.json();
  		this.numOfWaiting = summary.waiting;
  		this.numOfDelivered = summary.not_confirmed;
  		this.numOfConfirmed = summary.confirmed;
  		this.total = summary.total;

  		this.vjApi.hideLoader();
  	}, (err) => {
  		this.vjApi.hideLoader();
  	})
  }
}
