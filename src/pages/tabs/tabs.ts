import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CartPage } from '../cart/cart';
import { CategoryPage } from '../category/category';
import { MyvjPage } from '../myvj/myvj';

@Component({
  selector: 'tabs-home',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  home = HomePage;
  cart = CartPage;
  category = CategoryPage;
  myvj = MyvjPage;

  constructor(public navCtrl: NavController) {

  }
}
