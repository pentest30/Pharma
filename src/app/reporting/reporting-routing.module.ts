import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllDebtListComponent } from "./all-debt-list/all-debt-list.component";
import { AllReservedQntComponent } from "./all-reserved-qnt/all-reserved-qnt.component";
import { DetailProductListComponent } from "./detail-product-list/detail-product-list.component";
import { TurnoverCustomersComponent } from "./turnover-customers/turnover-customers.component";

const routes: Routes = [
    {
      path: '',
      redirectTo: 'detail-product-list',
      pathMatch: 'full',
    
    },
    {
        path: 'detail-product-list',
        component: DetailProductListComponent
    },
    {
        path: 'all-reserved-qnt',
        component:  AllReservedQntComponent
    },
    {
      path: 'turnover-customers',
      component:  TurnoverCustomersComponent
  },
  {
    path: 'all-debt-list',
    component:  AllDebtListComponent
},
   
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ReportingRoutingModule { }