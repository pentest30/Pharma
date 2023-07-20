import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductClassService } from './product-class-list/product-class.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductClassListComponent } from './product-class-list/product-class-list.component';
import { ProductClassRoutingModule } from './product-class.routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductClassAddComponent } from './product-class-add/product-class-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../shared/material-module';
@NgModule({
  declarations: [
    ProductClassListComponent, 
    ProductClassAddComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    ProductClassRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule ,
    MatSlideToggleModule,
    MatSelectModule, 
    MatIconModule, 
    MatButtonModule,
    MatSortModule,
    NgSelectModule, 
    MaterialModule
   
  ],
   providers : [ProductClassService]
})
export class ProductClassModule{ }


