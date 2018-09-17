import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrderTabsPage } from './my-order-tabs';
import { MyOrderToPayPageModule } from '../my-order-to-pay/my-order-to-pay.module';
import { MyOrderToDeliverPageModule } from '../my-order-to-deliver/my-order-to-deliver.module';
import { MyOrderToReceivePageModule } from '../my-order-to-receive/my-order-to-receive.module';
import { MyOrderToCommentPageModule } from '../my-order-to-comment/my-order-to-comment.module';

@NgModule({
  declarations: [
    MyOrderTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyOrderTabsPage),
    MyOrderToPayPageModule,
    MyOrderToDeliverPageModule,
    MyOrderToReceivePageModule,
    MyOrderToCommentPageModule,
  ],
})
export class MyOrderTabsPageModule {}
