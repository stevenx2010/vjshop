import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmOrderPage } from './confirm-order';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ConfirmOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmOrderPage),
    ComponentsModule,
  ],
})
export class ConfirmOrderPageModule {}
