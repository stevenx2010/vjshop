import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { VJAPI } from '../../services/vj.services';
import { Loader } from '../../utils/loader';

@IonicPage()
@Component({
  selector: 'page-agreement',
  templateUrl: 'agreement.html',
})
export class AgreementPage {
  agreement: any;
  content: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				private sanitizer: DomSanitizer, private loadingCtrl: LoadingController) {
  }

  ionViewWillEnter() {
  	let loader = new Loader(this.loadingCtrl);
    loader.show();
    this.vjApi.getAgreementPageInfo().subscribe((info) => {
    	console.log(info);
    	this.content = info.json();
    	if(this.content) {
    		this.agreement = this.sanitizer.bypassSecurityTrustHtml(this.content);
    		this.displayContent();
    	}
    	loader.hide();
    }, (err) => {
    	console.log(err);
    	loader.hide();
    });
  }

  displayContent() {
  	return this.agreement;
  }

}
