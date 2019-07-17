import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { VJAPI } from '../../services/vj.services';
import { Address } from '../../models/address.model';
import { Constants } from '../../models/constants.model';

import { Loader } from '../../utils/loader';


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
              private events: Events, private toastCtrl: ToastController, private loadingCtrl: LoadingController) 
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
    let loader = new Loader(this.loadingCtrl);
    loader.show();
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
        loader.hide();
  		}, (err) => {
        loader.hide();
      });
  }

  editAddress(index) {
    this.navCtrl.push('AddAdressPage', {'mobile': this.mobile, 'address': this.addresses[index], 'action': 'edit'});
  }

  createAddress() {
    this.navCtrl.push('AddAdressPage', {'mobile': this.mobile, 'action': 'create'});
  }

  deleteAddress(index: number) {
    let addressId = this.addresses[index].id;

    let loader = new Loader(this.loadingCtrl);
    loader.show();
    this.vjApi.deleteAddressById(addressId).subscribe((resp) => {
      console.log(resp)
      this.getAddresses();
      loader.hide();
    }, (err) => {
      loader.hide();
    });
  }

  selectAddress(index) {
    if(this.addresses.length > 1) {
      this.storage.ready().then(() => {
        this.storage.set(Constants.SHIPPING_ADDRESS_KEY, this.addresses[index]);
        let loader = new Loader(this.loadingCtrl);
        loader.show();
        this.vjApi.setAddressAsDefault(this.addresses[index].id).subscribe((data) => {
          console.log(data);
          this.getAddresses();
          loader.hide();
        }, (err) => {
          loader.hide();
        });
      });
    }
  }

  ionViewWillLeave() {
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
