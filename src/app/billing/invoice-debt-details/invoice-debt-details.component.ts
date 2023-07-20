import { HttpClient } from "@angular/common/http";
import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { InvoiceService } from "src/app/services/invoice.service";
import { SignalRService } from "src/app/services/signal-r.service";
import { DateHelper } from "src/app/shared/date-helper";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-invoice-debt-details",
  templateUrl: "./invoice-debt-details.component.html",
  styleUrls: ["./invoice-debt-details.component.sass"],
})
export class InvoiceDebtDetailsComponent implements OnInit {
  total: number;
  totalHtt: number;
  loading: boolean = false;
  public start: Date;
  public end: Date;
  totalAmount: any;
  @ViewChild("grid") public grid: GridComponent;
  isOpen: any;

  @Input() customerId: string;
  @Input() envetsInvoice: Observable<void>;
  baseUrl: string = "invoices/";
  token: string;
  parms: any;
  gridLines: string;
  debtDetails: any = [];
  customerCode: string;
  constructor(
    private authService: AuthService,
    private invoiceService: InvoiceService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private http: HttpClient,
    private signalRService: SignalRService,
    private dateHelper: DateHelper,
    private dialogRef: MatDialogRef<InvoiceDebtDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.customerId = this.data.customerId;
    this.parms = this.data.item;
    this.customerCode = this.data.customerCode;
  }

  ngOnInit(): void {
    this.gridLines = "Both";
    this.loadDebtDetails();
  }
  loadDebtDetails() {
    let url = this.customerId
      ? environment.ResourceServer.Endpoint +
        "invoices/" +
        this.customerId +
        "/customer-debt-details"
      : environment.ResourceServer.Endpoint +
        "invoices/" +
        this.customerCode +
        "/customer-debt-details";
    var headers = this.customerId
      ? [
          {
            Authorization: "Bearer " + this.authService.getToken,
            year: this.parms.invoiceYear,
            month: this.parms.invoiceMonth,
          },
        ]
      : [{ Authorization: "Bearer " + this.authService.getToken }];
    this.debtDetails = new DataManager({
      url: url,
      adaptor: new UrlAdaptor(),
      headers: headers,
    });
  }
  close() {
    this.dialogRef.close();
  }
  dataBound(e) {}
  begin(e) {}
}
