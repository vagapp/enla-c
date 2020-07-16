import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConsulteComponent } from './consulte/consulte.component';


@NgModule({
    declarations: [ConsulteComponent],
    imports: [],
    exports: [ConsulteComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
})
export class ComponentsModule {}