import { DosageListComponent } from './dosage-list/dosage-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {
      path: '',
      redirectTo: 'dosage-list',
      pathMatch: 'full'
    },
    {
      path: 'dosage-list',
      component: DosageListComponent
    },
   
    
  ];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class DosageRouting {

}