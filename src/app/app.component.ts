import { Component } from '@angular/core';
import { Platform , App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from  '../pages/tabs/tabs';

/*
import { Storage } from '@ionic/storage';
import { Location } from '../models/location.model';
import { Constants } from '../models/constants.model';
*/

declare let baidumap_location: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  city: any;
  location: Location;

  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private app: App,
              private alertCtrl: AlertController/*, private storage: Storage*/) 
  {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

/*
  ngOnInit() {

    this.platform.ready().then(() => {
        baidumap_location.getCurrentPosition((data) => {

        let result = data;
        console.log(result);
        this.city = result.province;//;'北京市'
        if(this.city && this.city !=  '') {
         this.storage.ready().then(() => {
           //this.storage.set(Constants.LOCATION_KEY, this.city);
           this.location = new Location(data);
           console.log(this.location);
           this.storage.set(Constants.LOCATION_KEY, this.location);
         });
        }
     }, (err) => {
       console.log(err);
     });
    })
  }*/

}

