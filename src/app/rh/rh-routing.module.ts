import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListingEmployeeComponent } from "./employee/listing-employee/listing-employee.component";

const routes: Routes = [
    {
      path: '',
      redirectTo: 'employee-list',
      pathMatch: 'full'
    },
    {
        path: 'employee-list',
        component: ListingEmployeeComponent
    },

  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RhRoutingModule { }
  