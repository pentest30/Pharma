
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductRouting } from './product-routing';
import { CommandColumnService, EditService, FilterService, GridAllModule, GroupService, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from '../shared/material-module';
import { PipesModule } from '../pipes/pipes.module';
const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  providers: [PageService,
    SortService,
    FilterService,
    GroupService, EditService, CommandColumnService],
  declarations: [ProductListComponent, ProductAddComponent, ProductEditComponent],
  imports: [
    CommonModule,
    ProductRouting,
    MaterialModule,
    PipesModule,
    ]
})
export class ProductModule { }
