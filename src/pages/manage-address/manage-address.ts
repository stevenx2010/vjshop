import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { Address } from '../../models/address.model';
import { Constants } from '../../models/constants.model';


@IonicPage()
@Component({
  selector: 'page-manage-address',
  templateUrl: 'manage-address.html',
})
export class ManageAddressPage {
  address: Address;
  addresses: Address[];
  mobile: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private vjApi: VJAPI,
              private events: Events, private toastCtrl: ToastController) 
  {
  	this.address = new Address();
  	this.addresses = new Array<Address>();
  }

  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get(Constants.USER_MOBILE_KEY).then((m) => {
        if(m) {
          this.mobile = m;
          /*
          let regex = /^(\d{3})\d{4}(\d{4})$/gi;
          this.hidedMobile = this.mobile.replace(regex, '$1****$2');*/
          this.getAddresses();
        }
      });
    }); 

    this.presentToaster();   
  }


  getAddresses() {
    this.vjApi.showLoader();
  	this.vjApi.getAddressAll(this.mobile).subscribe((data) => {
  			if(data.length > 0) {
          this.addresses = data;
  			  
          //find the default address &  save it to local
          this.addresses.forEach((a) => {
            if(a.default_address) {
              this.storage.ready().then(() => {
                this.storage.set(Constants.SHIPPING_ADDRESS_KEY, a);
              })
            }
          })
        }
  		});
    this.vjApi.hideLoader();
  }

  editAddress(index) {
    this.navCtrl.push('AddAdressPage', {'mobile': this.mobile, 'address': this.addresses[index], 'action': 'edit'});
  }

  createAddress() {
    this.navCtrl.push('AddAdressPage', {'mobile': this.mobile, 'action': 'create'});
  }

  deleteAddress(index: number) {
    let addressId = this.addresses[index].id;

    this.vjApi.showLoader();
    this.vjApi.deleteAddressById(addressId).subscribe((resp) => {
      console.log(resp)
      this.getAddresses();
    });
    this.vjApi.hideLoader();
  }

  selectAddress(index) {
    this.storage.ready().then(() => {
      this.storage.set(Constants.SHIPPING_ADDRESS_KEY, this.addresses[index]);
      //this.navCtrl.pop();
      //this.editAddress(index);
      // set ad default address
      this.vjApi.setAddressAsDefault(this.addresses[index].id).subscribe((data) => {
        console.log(data);
        this.getAddresses();
      });
    });
  }

  ionViewCanLeave() {
    this.events.publish('address_changed');
  }

  presentToaster() {
    let toast = this.toastCtrl.create({
      message: '向左滑动地址栏可对地址进行编辑和删除; 点击将该地址设置为默认地址。',
      duration: 3500,
      position: 'bottom'
    });

    toast.present();
  }
}
