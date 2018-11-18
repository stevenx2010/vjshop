import { Component, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { About } from '../../models/about-model';


@IonicPage()
@Component({
  selector: 'page-about-vj',
  templateUrl: 'about-vj.html',
})
export class AboutVjPage {
  @ViewChild('content') viewContent: ElementRef;
  @ViewChild(Slides) slides: Slides;

  about: any;
  images: any[];
  base_url: string;
  content: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI, 
  				@Inject('API_BASE_URL') private apiUrl: string, private renderer: Renderer2) {

  	this.about = new About();
  	this.images = new Array<any>();
  	this.base_url = this.apiUrl;
  }

  ionViewWillLoad() {
  	this.vjApi.showLoader();
  	this.vjApi.getAboutPageInfo().subscribe((info) => {
 		this.about = info.json();
  		if(this.about) {
  			this.images = this.about.images;
  			this.content = this.about[0].content;
  			this.displayContent();
  		}
  		this.vjApi.hideLoader();
  	}, (err) => {
  		console.log(err);
  		this.vjApi.hideLoader();
  	});
  }

  ionViewDidEnter() {
  	this.slides.autoplayDisableOnInteraction = false;
  	this.slides.startAutoplay();
  }

  displayContent() {
  	let contentArray = this.content.split("|");

  	contentArray.forEach((item) => {
  		let p = this.renderer.createElement('p');
	  	let text = this.renderer.createText(item);
	  	this.renderer.appendChild(p, text);
	  	this.renderer.appendChild(this.viewContent.nativeElement, p);
  	})
  }
}
