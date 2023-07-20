import { QuotaService } from './../../services/quota.service';
import { PermissionService } from './../../services/permission.service';
import { UrlAdaptor } from '@syncfusion/ej2-data';
import { environment } from './../../../environments/environment';
import { DataManager } from '@syncfusion/ej2-data';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GroupSettingsModel } from '@syncfusion/ej2-angular-grids';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';

declare const $: any;
declare const Chart: any;
declare const window: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BaseComponent implements OnInit {
  customers: any[] = [];
  dashboard: any;
  quotas: DataManager;
  data: DataManager;
  ca: string | number = 0;
  gridLines: string;
  percentageValue: (value: number) => string;

  @ViewChild('grid') public grid: GridComponent;
  monthlyResult: number = 0;
  monthlyObj: number = 0;
  monthlyBenefit: number = 0;
  sumPurchase: number = 0;
  rate: string = '0';
  ecart: string | number = 0;
  marge: string | number = 0;
  resultRate: string = '0';
  monthlyResultFixed: number = 0;
  isSales: boolean = false;
  isSuprvisor: boolean = false;
  SupervisorAndSales: boolean = false;
  details: any[] = [];
  public groupOptions: GroupSettingsModel;
  public groupOptions2: GroupSettingsModel;

  constructor(
    private customerService: CustomerService,
    private quotaService: QuotaService,
    private notif: NotificationHelper,
    private _auth: AuthService, private permService: PermissionService) {
    super(_auth, 'customers/salesperson/dash/');
    setCulture('fr');
    loadCldr(require('./../../sales/numbers.json'));
    this.percentageValue = function (value: number): string {
      return `${Math.round(value)} / ${this['max']}`;
    };

  }
  daily_loading: boolean;
  monthly_loading: boolean;
  customers_loading: boolean;
  async ngOnInit() {
    this.daily_loading = true;
    this.monthly_loading = true;
    this.customers_loading = true;
    this.gridLines = 'Both';
    //
    this.groupOptions2 = { showDropArea: false, columns: ['salesPersonName'] };
    var totalRequestQuota = await this.quotaService.getTotal().toPromise();
    console.log(totalRequestQuota);
    if (parseInt(totalRequestQuota) > 0)
      this.notif.showNotification('mat-success', "Vous avez des nouvelles demandes QUOTA: " + totalRequestQuota, 'top', 'right');

    this.isSales = this.permService.isBuyer() || this.permService.isBuyerGroup();
    this.isSuprvisor = this.permService.isSupervisor(); // NOTE: Not used
    this.SupervisorAndSales = this.permService.isSupervisor() || this.permService.isBuyer() || this.permService.isBuyerGroup(); //
    if (
      (this._auth.profile['role'] == 'SalesPerson' || this._auth.profile['role'] == 'Supervisor') ||
      (Array.isArray(this._auth.profile['role']) &&
        this._auth.profile['role'].some(x => x == 'SalesPerson') || this._auth.profile['role'].some(x => x == 'Supervisor'))


    ) {
      if (
        (Array.isArray(this._auth.profile['role']) &&
          this._auth.profile['role'].some(x => x == 'Supervisor'))
        ||
        (this._auth.profile['role'] == 'Supervisor')
      ) {
        this.grid.allowGrouping = true;
        this.groupOptions = { showDropArea: false, columns: ['defaultSalesPersonName'] };

      }
      this.customerService.GetTodayDashboard().subscribe(
        async res => {

          this.ca = res.ca
          this.daily_loading = false;
        }
      );
      this.customerService.GetMonthlyDashboard().subscribe(
        async (res) => {
          this.monthlyResultFixed = this.monthlyResult = res.totalOrdersMonthly;
          this.monthlyObj = res.monthlyObjective;
          this.monthlyBenefit = res.orderTotalMonthBenefit;
          this.resultRate = (this.monthlyObj == 0 ? '0' : ((this.monthlyResult * 100) / this.monthlyObj).toFixed(2));
          this.ecart = (-this.monthlyObj + this.monthlyResult);
          this.marge = res.orderTotalMonthBenefitRate;
          this.monthly_loading = false;

        }
      );


      this.customerService.GetCustomerBySalesPersonDash().subscribe(
        async res => {
          this.customers = res;



          if (this.customers.length > 0) {
            let active = this.customers.filter(x => x.hasOrderToDay);
            this.rate = ((active.length * 100) / this.customers.length).toFixed(2);
          }

          this.customers_loading = false;

        }
      );
      this.loadData();
      this.loadQuotas();

    }



  }
  getIndexRow(index) {
    return parseInt(index) + 1;
  }

  loadQuotas() {
    this.quotas = new DataManager({
      url: environment.ResourceServer.Endpoint + "quotas/" + "search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.token }],

    });
  }
  rowSelected($event) {
    console.log($event.data.productId);
    this.quotaService.getQuotadetails($event.data.productId, $event.data.salesPersonId).subscribe((res) => {
      this.details = res;

    });
  }
}
