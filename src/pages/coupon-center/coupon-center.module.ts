import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponCenterPage } from './coupon-center';


@NgModule({
  declarations: [
    CouponCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(CouponCenterPage),
  ],
})
export class CouponCenterPageModule {}
