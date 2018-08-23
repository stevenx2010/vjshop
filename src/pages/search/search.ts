import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProductDetail } from '../../models/product-detail.model';
import { VJAPI } from '../../services/vj.services';
import { SearchHistoryEntry } from '../../models/search-history-entry.model';

import { Constants } from '../../models/constants.model';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  //SEARCH_HISTORY_KEY: 'search-history';
  searchHistory: SearchHistoryEntry[];
  items: string[];
  searchKeyword: string;
  searchedProducts: ProductDetail[];
  isShowHistory: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI, private alertCtrl: AlertController) {
  	this.searchHistory = new Array<SearchHistoryEntry>();

  	this.storage.ready().then(() => {this.storage.get(Constants.SEARCH_HISTORY_KEY).then((data) => {
  		if(data) 
  			{
  				this.searchHistory = data;
  			}
  	})}).catch(console.log);

  	this.searchedProducts = new Array<ProductDetail>();
	  this.items = new Array<string>();

	  this.isShowHistory = true;
  }


  ionViewDidEnter() {
  	this.setItems();
  }


  filterItems(event: any) {
  	this.isShowHistory = false;
  	let keyword = this.searchKeyword;
  	this.vjApi.getSearchedProducts(keyword).subscribe(

  		(data) => {
  			this.searchedProducts = data;
  			if(data.length > 0) {
  				console.log(keyword);
  				let index = this.searchHistory.findIndex((a) => {return a.keyword === keyword;});
  				if(index == -1) {
 					this.searchHistory.push(new SearchHistoryEntry(keyword, 1, Date.now()));

  				} else {
  					this.searchHistory[index].freq += 1;
  					this.searchHistory[index].date = Date.now();
  				}
  				this.storage.set(Constants.SEARCH_HISTORY_KEY, this.searchHistory);
  			}			
  		},
  		(err) => console.log(err)
  	);
  	console.log(this.items);
/*
  	let val = event.target.val;
  		if(val && val.trim() !== '') {
  			this.items = this.items.filter((item) => {
  				return item.toLowerCase().includes(val.toLowerCase())
  		});
  	}*/
  }

  setItems() {
  	this.searchHistory.sort((a, b) => {
  		if(a.date > b.date) return -1;
  		else if(a.date < b.date) return 1;
  		return 0;
  	}).sort((a, b) => {
  		if(a.freq > b.freq) return -1;
  		else if(a.date < b.date) return 1;
  		return 0;
  	});

  	this.searchHistory.forEach((historyEntry) => this.items.push(historyEntry.keyword));
  }

  clearHistory() {
  	this.items = [];
  	this.searchHistory = [];
  	this.storage.ready().then(() => {this.storage.set(Constants.SEARCH_HISTORY_KEY, this.searchHistory);}).catch(console.log);
  }

  doPrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('提示');
    alert.setMessage('请确认真的要删除搜索历史记录吗？');
    alert.addButton({
      text: '确定',
      handler: () => {this.clearHistory()}
    });
    alert.addButton({
      text: '取消',
      handler: () => {}
    });

    alert.present();
  }

  setSearchKeyword(kw: string) {
  	this.searchKeyword = kw;
  	this.filterItems(event);
  }

  toProductDetailPage(productId: number):void {
  	this.navCtrl.push('ProductDetailPage', {productId});
  }

  showHistory(): void {
  	this.isShowHistory = true;
  }

  goBack(): void {
    this.navCtrl.pop();
  }
}
