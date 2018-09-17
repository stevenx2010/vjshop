import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrderToPayPage } from './my-order-to-pay';

@NgModule({
  declarations: [
    MyOrderToPayPage,
  ],
  imports: [
    IonicPageModule.forChild(MyOrderToPayPage),
  ],
})
export class MyOrderToPayPageModule {}
