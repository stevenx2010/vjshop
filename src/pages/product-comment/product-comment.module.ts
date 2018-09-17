import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductCommentPage } from './product-comment';

@NgModule({
  declarations: [
    ProductCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductCommentPage),
  ],
})
export class ProductCommentPageModule {}
