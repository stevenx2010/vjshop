import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrderToConfirmPage } from './my-order-to-confirm';

@NgModule({
  declarations: [
    MyOrderToConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(MyOrderToConfirmPage),
  ],
})
export class MyOrderToConfirmPageModule {}
