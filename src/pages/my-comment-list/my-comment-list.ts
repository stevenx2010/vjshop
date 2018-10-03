import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Tools } from '../../utils/Tools';

@IonicPage()
@Component({
  selector: 'page-my-comment-list',
  templateUrl: 'my-comment-list.html',
})
export class MyCommentListPage {

  mobile: string;
  results: any;
  baseUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
              @Inject('API_BASE_URL') private apiUrl: string) 
  {
  	this.mobile = this.navParams.get('mobile');
    this.baseUrl = this.apiUrl;
  }

  ionViewDidEnter() {
    this.vjApi.showLoader();
    this.vjApi.getCommentByMobile(this.mobile).subscribe((c) => {
      let resp = c.json();
      if(resp.length > 0) {
        this.results = resp;
        console.log(this.results);
      }
    })
    this.vjApi.hideLoader();
  }

  commentAgain(i, j) {
    let order = this.results[i];
    let product = order.products[j];

    this.navCtrl.push('ProductCommentFormPage', { product: product, orderId: order.id});
  }

}
