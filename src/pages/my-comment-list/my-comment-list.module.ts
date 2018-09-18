import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCommentListPage } from './my-comment-list';
import { ComponentsModule } from '../../components/components.module'

@NgModule({
  declarations: [
    MyCommentListPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCommentListPage),
    ComponentsModule,
  ],
})
export class MyCommentListPageModule {}
