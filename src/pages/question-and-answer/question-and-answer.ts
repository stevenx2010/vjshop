import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { VJAPI } from '../../services/vj.services';

@IonicPage()
@Component({
  selector: 'page-question-and-answer',
  templateUrl: 'question-and-answer.html',
})
export class QuestionAndAnswerPage {

  qna: any;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private vjApi: VJAPI) {

  }

  ionViewDidLoad() {
  	this.vjApi.showLoader();
    this.vjApi.getQnA().subscribe((q) => {
    	if(q) {
    		this.qna = q.json();
        this.vjApi.hideLoader();
    	}
    }, (err) => {
      this.vjApi.hideLoader();
    })
  }
}
