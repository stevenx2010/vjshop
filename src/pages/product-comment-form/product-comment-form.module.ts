import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductCommentFormPage } from './product-comment-form';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ProductCommentFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductCommentFormPage),
    ComponentsModule,
  ],
})
export class ProductCommentFormPageModule {}
