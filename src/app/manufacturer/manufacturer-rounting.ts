
import { ManufacturerAddComponent } from '../Manufacturer/manufacturer-add/manufacturer-add.component';
import { ManufacturerListComponent } from '../manufacturer/manufacturer-list/manufacturer-list.component';
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ManufacturerEditComponent } from './manufacturer-edit/manufacturer-edit.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'manufacturer-list',
      pathMatch: 'full'
    },
    {
      path: 'manufacturer-list',
      component: ManufacturerListComponent
    },
    {
        path: 'manufacturer-add',
        component: ManufacturerAddComponent
      },
      {
        path: 'manufacturer-edit',
        data : {id : ''},
        component: ManufacturerEditComponent
      }
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ManufacturerRouting {
      
  }