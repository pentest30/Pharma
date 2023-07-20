import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductClassListComponent } from './product-class-list/product-class-list.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'product-class-list',
    pathMatch: 'full'
  },
  {
    path: 'product-class-list',
    component: ProductClassListComponent
  },
  
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductClassRoutingModule { }
