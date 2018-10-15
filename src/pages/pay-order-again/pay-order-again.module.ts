import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayOrderAgainPage } from './pay-order-again';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PayOrderAgainPage,
  ],
  imports: [
    IonicPageModule.forChild(PayOrderAgainPage),
    ComponentsModule,
  ],
})
export class PayOrderAgainPageModule {}
