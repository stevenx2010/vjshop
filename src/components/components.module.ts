import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SeperatorComponent } from './seperator/seperator';
import { CounterComponent } from './counter/counter';

@NgModule({
	declarations: [SeperatorComponent,
    CounterComponent],
	imports: [IonicModule],
	exports: [SeperatorComponent,
    CounterComponent]
})
export class ComponentsModule {}
