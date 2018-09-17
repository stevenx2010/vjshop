import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrderToDeliverPage } from './my-order-to-deliver';

@NgModule({
  declarations: [
    MyOrderToDeliverPage,
  ],
  imports: [
    IonicPageModule.forChild(MyOrderToDeliverPage),
  ],
})
export class MyOrderToDeliverPageModule {}
