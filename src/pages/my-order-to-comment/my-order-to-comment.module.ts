import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrderToCommentPage } from './my-order-to-comment';

@NgModule({
  declarations: [
    MyOrderToCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(MyOrderToCommentPage),
  ],
})
export class MyOrderToCommentPageModule {}
