import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAdressPage } from './add-adress';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    AddAdressPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAdressPage),
        MultiPickerModule
  ],
})
export class AddAdressPageModule {}
