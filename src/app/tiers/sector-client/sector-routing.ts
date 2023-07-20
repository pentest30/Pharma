import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/services/auth.guard";
import { SectorListComponent } from "./sector-list/sector-list.component";


const routes: Routes = [
    {
      path: '',
      redirectTo: 'sector-list',
      pathMatch: 'full'
    },
    {
      path: 'sector-list',
      component: SectorListComponent,
      canActivate:[AuthGuard]
    },
   
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SectorRouting {
      
  }