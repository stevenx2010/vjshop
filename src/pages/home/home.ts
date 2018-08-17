import { Component, ViewChild, Inject } from '@angular/core';
import { Content, Slides, NavController } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Image } from '../../models/image.model';

import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  remoteImages: Image[][];
  imageUrls: string[][];

  // Image urls for area 1, 2, 3, and 4
  imageUrls_1: string[] = [''];
  imageUrls_2: string[] = [''];
  imageUrls_3: string[] = [''];
  imageUrls_4: string[] = [''];

  contentWidth: number;
  contentHeight: number;

  constructor(public navCtrl: NavController, private vjApi: VJAPI, @Inject('API_BASE_URL') private apiUrl: string, private http: Http ) {
  	// initialize arrays
  	this.remoteImages = new Array<Array<Image>>();
  	this.imageUrls = new Array<Array<string>>();
  }

  ionViewDidEnter() {
  	this.contentWidth = this.content.contentWidth;
  	this.contentHeight = this.content.contentHeight;
  	this.slides.autoplayDisableOnInteraction = false;
  	this.slides.startAutoplay();
  }

  image_2: string;

  ionViewWillLoad() {
  	this.vjApi.getHomePageImages().subscribe(
  		(data) => { 
  			this.remoteImages = data.json();

  			for(let i in this.remoteImages){
  				this.imageUrls[i] = new Array<string>();
  				for(let j in this.remoteImages[i]) {
  					this.imageUrls[i].push(this.apiUrl + this.remoteImages[i][j].image_url);
  				}
  			}

  			this.imageUrls_1 = this.imageUrls[1];
  			this.imageUrls_2 = this.imageUrls[2];
  			this.imageUrls_3 = this.imageUrls[3];
  			this.imageUrls_4 = this.imageUrls[4];

  			this.http.get(this.imageUrls_2[0]).subscribe((data1) => this.image_2 = data1.json());
  			console.log(this.imageUrls_2[0]);

  			console.log(this.imageUrls);

  			this.vjApi.hideLoader();
  		},
  		(err) => {
  			console.log('error: ', err);
  			this.vjApi.hideLoader();
  		});
  }
}
