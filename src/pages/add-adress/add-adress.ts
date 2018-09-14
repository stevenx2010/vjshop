import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ChineseCities }  from '../../models/chinese-cities';
import { Address } from '../../models/address.model';
import { MultiPicker } from 'ion-multi-picker';
import { Constants, Login } from '../../models/constants.model';
import { VJAPI } from '../../services/vj.services';

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
  @ViewChild('mobile') mobileElement;
  @ViewChild('tel') tel;

	cityColumns: any;
  simpleColumns: any;
  address: Address;
  saveBtnDisable: boolean = true;
  action: string;

  placeholder='省/市/区';
  caption='新建收货地址';

  mobile: string;
  userId: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage, private vjApi: VJAPI,
              private events: Events) 
  {
    this.cityColumns = ChineseCities.cities;
    this.address = new Address();
    this.address.mobile = '';

    this.action = this.navParams.get('action');
    this.mobile = this.navParams.get('mobile');
  }

  ionViewWillLoad() {
    if(this.action == 'create')    // Create new Address
    {
      if(this.navParams.get('mobile')) {
        this.address.mobile = this.navParams.get('mobile');
      }
      else {
        this.storage.ready().then(() => {
          this.storage.get(Constants.USER_MOBILE_KEY).then((data) => {
            if(data) {
              this.address.mobile = data;
              this.mobile = data;
            }
          })
        })
      }
    } else if(this.action == 'edit') {      // Edit current address
      this.address = this.navParams.get('address');
      this.placeholder = this.address.city;
      this.caption = '编辑收货地址';
    }   

    // Get current user id
    this.vjApi.showLoader();
    this.vjApi.getUserId(this.mobile).subscribe((resp) => {
      if(resp.json()) {
        this.userId = (resp.json()).user_id;
      }
    });
    this.vjApi.hideLoader();

  }

  validate(): void {

    //check mobile number validity
    let regex_mobile ='^1[0-9]{10}';
    if(this.address.mobile && !(this.address.mobile.match(regex_mobile))) {
      this.address.mobile="";
      this.doPromptMobile(this.mobileElement);
    } 

    //check validity of tel
    let regex_tel = '^0[1-9]{1,2}[0-9]-[1-9][0-9]{7}';
    if(this.address.tel && !(this.address.tel.match(regex_tel))) {
      this.address.tel = "";
      this.doPromptTel(this.tel);
    }

    //check if all fields has properly filled
    if(this.address.username != '' && this.address.mobile != '' && this.address.city != '' && this.address.street != '') {
      this.saveBtnDisable = false;
    }

    //check if there's no default address, if so, cannot untoggle this address.
    this.vjApi.getDefaultAddress(this.mobile).subscribe((d) => {
      if(!d || d.length <= 0) {
        this.address.default_address = true;
      }
    })
  }

  setCity() {
    this.address.city = this.multiPicker._text;
    this.validate();
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
    //check if it's the only address, if so, set it as default address
    this.storage.ready().then(() => {
      this.storage.get(Constants.SHIPPING_ADDRESS_KEY).then((data) => {
        if(data == null)
          this.address.default_address = true;
        
        //get user id

        //save to server -- this must be done after login
        let body = {
          "user_id": this.userId,
          "command": Login.CREATE_SHIPPING_ADDDRESS,
          "username": this.address.username,
          "mobile": this.address.mobile,
          "tel": this.address.tel,
          "city": this.address.city,
          "street": this.address.street,
          "default_address": this.address.default_address
        }

        this.vjApi.showLoader();
        this.vjApi.auth(JSON.stringify(body)).subscribe((data) => {
            console.log(data);
            let response = data.json();
            console.log(response);
            console.log(response.status);
            console.log(Login.CREATE_SHIPPING_ADDRESS_SUCCESS);
            if(response.status === Login.CREATE_SHIPPING_ADDRESS_SUCCESS) {
              // get the address id
              this.address.id = response.address.id;
               //save to local, note: only default address is saved locally
              this.storage.set(Constants.SHIPPING_ADDRESS_KEY, response.address);
              this.saveBtnDisable = true;
              this.doPromptFinish();          
            } else {
              this.doPromptError();
            }
        },
        (err) => {
          this.doPromptError();
        });

        this.vjApi.hideLoader();
      })     
    });  
  }

  doPromptFinish() {
    let alert = this.alertCtrl.create();
    alert.setTitle('提示');
    alert.setMessage('新地址已经保存，请继续！');
    alert.addButton({
      text: '确定',
      handler: () => {
        this.navCtrl.pop().then(() => {
          this.events.publish('login_address_added');
        });
      }
      });

    alert.present();
  }
  doPromptError() {
     let alert = this.alertCtrl.create();
    alert.setTitle('警告');
    alert.setMessage('出现错误，无法保存地址，请稍后重试！');
    alert.addButton('确定'); 

    alert.present();
  }

}

