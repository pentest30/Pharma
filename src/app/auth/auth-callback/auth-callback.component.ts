import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  error: boolean;
  message: string;
  subscription: Subscription;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit() {

    console.log("auth callback");
    // check for error
    if (this.route.snapshot.fragment.indexOf('error') >= 0) {
      this.error = true;
      return;
    }

    await this.authService.completeAuthentication();
    let profile = this.authService.profile;
    console.log(profile);

    if (Array.isArray(profile['role'])) {
      if (profile['role'].some(x => x == 'SalesPerson')) {
        this.router.navigate(['/sales/sales-person-orders']);
      } else if (profile['role'].some(x => x == 'InventoryManager')) {
        this.router.navigate(['/inventory/inventsum/inventsum-list']);
      } else if (profile['role'].some(x => x == 'Buyer' || x == 'BuyerGroup')) {
        this.router.navigate(['/procurment/supplier-orders-list']);
      }
      else this.router.navigate(['/']);

    } else {
      switch (profile.role) {
        case 'SalesPerson':
          this.router.navigate(['/sales/sales-person-orders']);
          break;
        case 'Buyer':
          this.router.navigate(['/procurment/supplier-orders-list']);
          break;
        case 'BuyerGroup':
          this.router.navigate(['/procurment/supplier-orders-list']);
          break;
        case 'PrintingAgent':
          this.router.navigate(['/preparation-orders/preparation-orders-list']);
          break;
        case 'Controller':
          this.router.navigate(['/preparation-orders/form-op']);
          break;
        case 'Consolidator':
          this.router.navigate(['/preparation-orders/consolidation-op']);
          break;
        case 'Executer':
          this.router.navigate(['/preparation-orders/expedition-op']);
          break;
        default:
          this.router.navigate(['/']);
          break;
      }

    }


    // await this.authService.completeAuthentication();
    // this.router.navigate(['/']);
  }
}
