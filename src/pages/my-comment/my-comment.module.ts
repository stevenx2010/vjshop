import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCommentPage } from './my-comment';

@NgModule({
  declarations: [
    MyCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCommentPage),
  ],
})
export class MyCommentPageModule {}
