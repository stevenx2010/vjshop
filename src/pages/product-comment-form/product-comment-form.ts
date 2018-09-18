import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Product } from '../../models/product.model';
import { Comment } from '../../models/comment-model';
import { Constants } from '../../models/constants.model';
import { VJAPI } from '../../services/vj.services';
import { Tools } from '../../utils/Tools';

@IonicPage()
@Component({
  selector: 'page-product-comment-form',
  templateUrl: 'product-comment-form.html',
})
export class ProductCommentFormPage {

  product: Product;
  orderId: number;
  baseUrl: string;
  comment: string;
  rating: number = 0;
  mobile: string;
  saved: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject('API_BASE_URL') private apiUrl: string,
  				private storage: Storage, private vjApi: VJAPI) 
  {
  	this.product = new Product();

  	this.product = this.navParams.get('product');
  	console.log(this.product);
  	this.orderId = this.navParams.get('orderId');
  	console.log(this.orderId);
  	this.baseUrl = this.apiUrl;
  }

  ionViewWillLoad() {
  	this.storage.ready().then(() => {
  		this.storage.get(Constants.USER_MOBILE_KEY).then((m) => {
  			if(m) {
  				this.mobile = m;
  			}
  		})
  	})
  }

  save() {
  	let comment = new Comment();
  	comment.order_id = this.orderId;
  	comment.product_id = this.product.id;
  	comment.comment = this.comment;

  	comment.comment_date = Tools.getDateTime();
  	comment.rating = this.rating;
  	comment.comment_owner = this.mobile;

  	this.vjApi.updateComment(comment).subscribe((resp) => console.log(resp));

  	this.saved = true;
  }

  ratingClicked(event) {
  	this.rating = event;  	
  }
}
