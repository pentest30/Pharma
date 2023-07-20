import { Component, OnInit, ViewChild } from "@angular/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { setCurrencyCode } from "@syncfusion/ej2-base";
import { AuthService } from "src/app/services/auth.service";
import { InvoiceService } from "src/app/services/invoice.service";
import { PermissionService } from "src/app/services/permission.service";
import { BaseComponent } from "src/app/shared/BaseComponent";
import { DateHelper } from "src/app/shared/date-helper";

@Component({
  selector: "app-turnover-customers",
  templateUrl: "./turnover-customers.component.html",
  styleUrls: ["./turnover-customers.component.sass"],
})
export class TurnoverCustomersComponent
  extends BaseComponent
  implements OnInit
{
  totalAmount: number = 0;
  toolbar: any[];
  turnoverOfAllCustomers: any = [];
  turnoverOfAllSalesPeron: any = [];
  turnoverOfAllSalesGroup: any = [];
  loading: boolean = false;
  isAmountCalculated = false;
  @ViewChild("grid") public grid: GridComponent;
  @ViewChild("grid2") public grid2: GridComponent;
  @ViewChild("grid3") public grid3: GridComponent;
  start: any;
  isSalesPesron: any;

  constructor(
    private _auth: AuthService,
    private invoiceService: InvoiceService,
    private prems: PermissionService,
    private dateHelper: DateHelper
  ) {
    super(_auth, "");
  }

  async ngOnInit() {
    this.toolbar = ["ExcelExport"];
    this.isSalesPesron =
      this.prems.isSalesPerson() &&
      !this.prems.isSupervisor() &&
      !this.prems.isBuyer() &&
      !this.prems.isBuyerGroup() && 
      !this.prems.isSuperAdmin();
    await this.loadReports();
    // console.log(this.turnoverOfAllCustomers);
  }
  private async loadReports() {
    this.loading = true;
    var result = await this.invoiceService
      .getTurnoversOfCustomers(this.dateHelper.toShorDate(this.start))
      .toPromise();
    if (result["first_report"])
      this.turnoverOfAllCustomers = result["first_report"];
    if (result["third_report"])
      this.turnoverOfAllSalesPeron = result["third_report"];
    if (result["second_report"])
      this.turnoverOfAllSalesGroup = result["second_report"];
    this.loading = false;
  }

  toolbarClick($event) {
    this.grid.excelExport();
  }
  toolbarClickSP($event) {
    this.grid2.excelExport();
  }
  toolbarClickSv($event){
    this.grid3.excelExport();
  }
  public dataBound($event) {
    this.totalAmount = 0;

    for (let index = 0; index < this.turnoverOfAllCustomers.length; index++) {
      var element = this.turnoverOfAllCustomers[index] as any;
      this.totalAmount += parseFloat(element.dailyTurnover);
    }
  }
  async onStrtChange($event) {
    await this.loadReports();
  }
  public async refresh() {
    await this.loadReports();
  }
}
