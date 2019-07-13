import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { VJAPI } from '../../services/vj.services';

@IonicPage()
@Component({
  selector: 'page-agreement',
  templateUrl: 'agreement.html',
})
export class AgreementPage {
  agreement: any;
  content: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI,
  				private sanitizer: DomSanitizer) {
  }

  ionViewDidLoad() {
  	this.vjApi.showLoader();
    this.vjApi.getAgreementPageInfo().subscribe((info) => {
    	console.log(info);
    	this.content = info.json();
    	if(this.content) {
    		this.agreement = this.sanitizer.bypassSecurityTrustHtml(this.content);
    		this.displayContent();
    	}
    	this.vjApi.hideLoader();
    }, (err) => {
    	console.log(err);
    	this.vjApi.hideLoader();
    });
  }

  displayContent() {
  	return this.agreement;
  }

}
