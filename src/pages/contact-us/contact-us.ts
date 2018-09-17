import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var BMap;

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  @ViewChild('map') map_container: ElementRef;
  map: any;
  marker: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
  	this.map = new BMap.Map(this.map_container.nativeElement, { enableMapClick: true});
  	let point = new BMap.Point(120.936486,31.500371);
  	this.map.centerAndZoom(point, 17);

  	this.map.addControl(new BMap.MapTypeControl());
  	let sizeMap = new BMap.Size(10, 80);
  	this.map.addControl(new BMap.NavigationControl());

  	this.map.enableScrollWheelZoom(true);
  	this.map.enableContinuousZoom(true);

  	let myIcon = new BMap.Icon("assets/icon/venjong.ico", new BMap.Size(300, 157), {anchor: new BMap.Size(64, 112)});

  	this.marker = new BMap.Marker(point, {icon:myIcon});
  	this.map.addOverlay(this.marker);
  }

}
