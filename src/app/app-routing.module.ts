import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from '../app/auth/auth-callback/auth-callback.component';

const routes: Routes = [
  { path: "auth-callback", component: AuthCallbackComponent  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
   
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        m => m.AuthenticationModule
      )
  },
  {
    path: 'product-class',
    loadChildren: () =>
      import('./product-class/product-class.module').then(
        m => m.ProductClassModule
      )
  },
  {
    path: 'therapeutic-class',
    loadChildren: () =>
      import('./therapeutic-class/therapeutic-class.module').then(
        m => m.TherapeuticClassModule
      )
  },
  {
    path: 'pharmacological-class',
    loadChildren: () =>
      import('./pharmacological-class/pharmacological-class.module').then(
        m => m.PharmacologicalClassModule
      )
  },
  {
    path: 'manufacturer',
    loadChildren: () =>
      import('./manufacturer/manufacturer.module').then(
        m => m.ManufacturerModule
      )
  },
  {
    path: 'tax-group',
    loadChildren: () =>
      import('./tax-group/tax-group.module').then(
        m => m.TaxGroupModule
      )
  },
  {
    path: 'form',
    loadChildren: () =>
      import('./form/form.module').then(
        m => m.FormModule
      )
  },
  {
    path: 'dosage',
    loadChildren: () =>
      import('./dosage/dosage.module').then(
        m => m.DosageModule
      )
  },
  {
    path: 'packaging',
    loadChildren: () =>
      import('./packaging/packaging.module').then(
        m => m.PackagingModule
      )
  },
  {
    path: 'lists',
    loadChildren: () =>
      import('./lists/lists.module').then(
        m => m.ListsModule
      )
  },
  {
    path: 'membership/users',
    loadChildren: () =>
      import('../app/membership/users/users.module').then(
        m => m.UsersModule
      )
  },
  {
    path: 'membership/roles',
    loadChildren: () =>
      import('../app/membership/roles/roles.module').then(
        m => m.RolesModule
      )
  },
  {
    path: 'dci',
    loadChildren: () =>
      import('./dci/dci.module').then(
        m => m.DciModule
      )
  },
  {
    path: 'dci-code',
    loadChildren: () =>
      import('./dci-code/dci-code.module').then(
        m => m.DciCodeModule
      )
  },
  {
    path: 'picking-zone',
    loadChildren: () =>
      import('./picking-zone/picking-zone.module').then(
        m => m.PickingZoneModule
      )
  },
  {
    path: 'zone-group',
    loadChildren: () =>
      import('./zone-group/zone-group.module').then(
        m => m.ZoneGroupModule
      )
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./product/product.module').then(
        m => m.ProductModule
      )
  },
  {
    path: 'brand',
    loadChildren: () =>
      import('./brand/brand.module').then(
        m => m.BrandModule
      )
  }
  ,
  {
    path: 'inventory/inventsum',
    loadChildren: () =>
      import('./inventory/inventsum/inventsum.module').then(
        m => m.InventSumModule
      )
  },
  {
    path: 'inventory/batch',
    loadChildren: () =>
      import('./inventory/batch/batch.module').then(
        m => m.BatchModule
      )
  },
  {
    path: 'inventory/invent',
    loadChildren: () =>
      import('./inventory/invent/invent.module').then(
        m => m.InventModule
      )
  },
  {
    path: 'inventory/transfer-log',
    loadChildren: () =>
      import('./inventory/transfer-log/transfer-log.module').then(
        m => m.TransferLogModule
      )
  },
  {
    path: 'tiers/customer',
    loadChildren: () =>
      import('./tiers/customer/customer.module').then(
        m => m.CustomerModule
      )
  },
  {
    path: 'tiers/supplier',
    loadChildren: () =>
      import('./tiers/supplier/supplier.module').then(
        m => m.SupplierModule
      )
  }
 
  ,
  {
    path: 'tiers/client',
    loadChildren: () =>
      import('./tiers/client/client.module').then(
        m => m.ClientModule
      )
  },
  
  {
    path: 'tiers/sector-client',
    loadChildren: () =>
      import('./tiers/sector-client/sector-client.module').then(
        m => m.SectorClientModule
      )
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('./sales/sales.module').then(
        m => m.SalesModule
      )
  },
  {
    path: 'rh',
    loadChildren: () =>
      import('./rh/rh.module').then(
        m => m.RhModule
      )
  },
  {
    path: 'quotas',
    loadChildren: () =>
      import('./quotas/quotas.module').then(
        m => m.QuotasModule
      )
  },
  {
    path: 'transaction-type',
    loadChildren: () =>
      import('./transaction-type/transaction-type.module').then(
        m => m.TransactionTypeModule
      )
  },
  {
    path: 'discounts',
    loadChildren: () =>
      import('./discounts/discounts.module').then(
        m => m.DiscountsModule
      )
  },
  {
    path: 'preparation-orders',
    loadChildren: () =>
      import('./preparation-orders/preparation-orders.module').then(
        m => m.PreparationOrdersModule
      )
  },
  {
    path: 'procurment',
    loadChildren: () =>
      import('./procurment/procurment.module').then(
        m => m.ProcurmentModule
      )
  },
  {
    path: 'billing',
    loadChildren: () =>
      import('./billing/billing.module').then(
        m => m.BillingModule
      )
  },
  {
    path: 'reporting',
    loadChildren: () =>
      import('./reporting/reporting.module').then(
        m => m.ReportingModule
      )
  },
  {
    path: 'customer-credit',
    loadChildren: () =>
      import('./customer-credit/customer-credit.module').then(
        m => m.CustomerCreditModule
      )
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {
    useHash: false,
    enableTracing: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
