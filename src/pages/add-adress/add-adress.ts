import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ChineseCities }  from '../../models/chinese-cities';
import { Address } from '../../models/address.model';
import { MultiPicker } from 'ion-multi-picker';
import { Constants } from '../../models/constants.model';


/**
 * Generated class for the AddAdressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-adress',
  templateUrl: 'add-adress.html',
})
export class AddAdressPage {
  @ViewChild(MultiPicker) multiPicker: MultiPicker;
  @ViewChild('mobile') mobile;
  @ViewChild('tel') tel;

	cityColumns: any;
  simpleColumns: any;
  address: Address;
  saveBtnDisable: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage) {
    this.cityColumns = ChineseCities.cities;
    this.address = new Address('', '', '', '', '', false);
  }

  validate(): void {
    this.address.city = this.multiPicker._text;

    //check mobile number validity
    let regex_mobile ='^1[0-9]{10}';
    if(!(this.address.mobile.match(regex_mobile)) && this.address.mobile != '') {
      this.address.mobile="";
      this.doPromptMobile(this.mobile);
    } 

    //check validity of tel
    let regex_tel = '^0[1-9]{1,2}[0-9]-[1-9][0-9]{7}';
    if(!(this.address.tel.match(regex_tel)) && this.address.tel != '') {
      this.address.tel = "";
      this.doPromptTel(this.tel);
    }

    //check if all fields has properly filled
    if(this.address.username != '' && this.address.mobile != '' && this.address.city != '' && this.address.street != '') {
      this.saveBtnDisable = false;
    }
  }

  doPromptMobile(obj) {
    let alert = this.alertCtrl.create({
      title: '输入错误',
      message: '手机号码为11位数字',
      buttons: [{
        text: '确定',
        handler: () =>{obj.setFocus();}
      }]
    });

    alert.present();
  }

  doPromptTel(obj) {
    let alert = this.alertCtrl.create();
    alert.setTitle('输入错误');
    alert.setMessage('电话号码的格式为：区号-8为电话号码');
    alert.addButton({
      text: '确定',
      handler: data => {obj.setFocus();}
    });

    alert.present();
  }

  saveAddress(): void {
    //save to server -- this must be done after login

    //save to local, note: only default address is saved locally
    this.storage.set(Constants.SHIPPING_ADDRESS_KEY, this.address); 
  }
}
