import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { VJAPI } from '../services/vj.services';
import { InitEnv } from '../utils/initEnv';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CartPage } from '../pages/cart/cart';
import { CategoryPage } from '../pages/category/category';
import { MyvjPage } from '../pages/myvj/myvj';

import { ComponentsModule } from '../components/components.module';
import { CoordinateTransform } from '../services/baidu.gps.service';

import { Alipay } from '@ionic-native/alipay';
import { AppAvailability } from '@ionic-native/app-availability';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    CartPage,
    CategoryPage,
    MyvjPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      backButtonIcon: 'custom-goback'
    }),
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    CartPage,
    CategoryPage,
    MyvjPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    VJAPI,
    InitEnv,
    Alipay,
    AppAvailability,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
 //   {provide: 'API_BASE_URL', useValue: 'http://192.168.1.66:8000/'},
    {provide: 'API_BASE_URL', useValue: 'http://vjshop.yitongxun.cn:8080/api/'},
    CoordinateTransform,
  ]
})
export class AppModule {}
