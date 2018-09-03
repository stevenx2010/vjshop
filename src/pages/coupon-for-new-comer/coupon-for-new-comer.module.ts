import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponForNewComerPage } from './coupon-for-new-comer';

@NgModule({
  declarations: [
    CouponForNewComerPage,
  ],
  imports: [
    IonicPageModule.forChild(CouponForNewComerPage),
  ],
})
export class CouponForNewComerPageModule {}
