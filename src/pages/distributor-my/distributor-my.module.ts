import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DistributorMyPage } from './distributor-my';

@NgModule({
  declarations: [
    DistributorMyPage,
  ],
  imports: [
    IonicPageModule.forChild(DistributorMyPage),
  ],
})
export class DistributorMyPageModule {}
