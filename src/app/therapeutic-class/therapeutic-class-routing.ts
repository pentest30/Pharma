import { TherapeuticClassListComponent } from '../therapeutic-class/therapeutic-class-list/therapeutic-class-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {
      path: '',
      redirectTo: 'therapeutic-class-list',
      pathMatch: 'full'
    },
    {
      path: 'therapeutic-class-list',
      component: TherapeuticClassListComponent
    },
    
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TherapeuticClassRoutingModule { }
  