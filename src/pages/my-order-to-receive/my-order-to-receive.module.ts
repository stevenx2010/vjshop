import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrderToReceivePage } from './my-order-to-receive';

@NgModule({
  declarations: [
    MyOrderToReceivePage,
  ],
  imports: [
    IonicPageModule.forChild(MyOrderToReceivePage),
  ],
})
export class MyOrderToReceivePageModule {}
