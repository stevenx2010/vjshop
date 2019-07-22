import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';
import { Message } from '../../models/message.model';

@IonicPage()
@Component({
  selector: 'page-customer-service',
  templateUrl: 'customer-service.html',
})
export class CustomerServicePage {
  @ViewChild(Content) content: Content;
  mobile:string;
  messages: Message[];
  loggedIn: boolean;
  message: string;

  timer: any;
  preLength: number = 0;

  order_serial: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events, private vjApi: VJAPI) {
    this.messages = new Array<Message>();

  	this.mobile = this.navParams.get('mobile');
    this.order_serial = this.navParams.get('order_serial');

  	if(this.mobile == null) {
  		this.navCtrl.push('LoginPage');
  	}

    this.events.subscribe('login_success', (logged_in, mobile, address) => {
      this.mobile = mobile;
      this.loggedIn = logged_in;
    });
  }

  ionViewWillUnload() {
    this.events.unsubscribe('login_success');
    clearInterval(this.timer);
  }

  ionViewWillLoad() {  
    this.timer = setInterval(() => {
      this.getMessage();
    }, 2000);
  }

  ionViewDidEnter() {
    if(this.order_serial != '') {
      this.message = this.order_serial;
      this.sendMessage();
      this.order_serial ='';
    }

    this.content.scrollToBottom();
  }

  sendMessage() {
    if(this.message && this.message.length > 0) {
      let body = {
        'mobile': this.mobile,
        'message': this.message,
        'who': 1
      }

      this.vjApi.sendMessage(body).subscribe((resp) => {
        console.log(resp);
        this.getMessage();
      });
      
      this.message = '';

    }
  }

  getMessage() {
     this.vjApi.getMessage(this.mobile).subscribe((m) => {
       console.log(this.mobile);
      console.log(m);
      if(m.length > 0) {
        this.messages = m;    

        if(m.length > this.preLength) {
          setTimeout(() => {this.content.scrollToBottom()},300);
          this.preLength = m.length;
        }    
      }
    }, (err) => console.log(err));   
  }
}
