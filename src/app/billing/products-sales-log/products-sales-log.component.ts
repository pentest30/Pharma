import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import {
  concat,
  Observable,
  of,
  Subject,
  Subscription,
  throwError,
} from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { InvoiceService } from "src/app/services/invoice.service";
import { SignalRService } from "src/app/services/signal-r.service";
import { BaseComponent } from "src/app/shared/BaseComponent";
import { DateHelper } from "src/app/shared/date-helper";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { environment } from "src/environments/environment";
import { saveAs } from "file-saver";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { log } from "console";
@Component({
  selector: "app-products-sales-log",
  templateUrl: "./products-sales-log.component.html",
  styleUrls: ["./products-sales-log.component.sass"],
})
export class ProductsSalesLogComponent extends BaseComponent implements OnInit {
  loading: boolean = false;
  public start: Date = new Date(new Date().getFullYear(), 0, 1);
  public end: Date;
  totalAmount: any;
  customers: Observable<any>;
  customersLoading: boolean = false;
  @ViewChild("grid") public grid: GridComponent;
  @ViewChild("detailgrid") public detailgrid: GridComponent;
  isOpen: any;
  @Input() byCustomer: boolean = true;
  private eventsSubscription: Subscription;
  @Input() customerId: string;
  @Input() eventsProducts: Observable<void>;
  selectedCustomer: any;
  customersInput$ = new Subject<string>();
  constructor(
    private authService: AuthService,
    private invoiceService: InvoiceService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private http: HttpClient,
    private signalRService: SignalRService,
    private dateHelper: DateHelper,
    private httpClient: HttpClient
  ) {
    super(authService, "invoices/");
  }

  ngOnInit(): void {
    this.selectionOptions = { checkboxMode: "ResetOnRowClick" };
    this.eventsSubscription = this.eventsProducts.subscribe(() =>
      this.loadInvoices()
    );
    if (!this.byCustomer) {
      this.loadCustomers();
    }
  }
  async loadInvoices() {
    let url = this.customerId
      ? environment.ResourceServer.Endpoint +
        this.baseUrl +
        this.customerId +
        "/sales-product-log"
      : environment.ResourceServer.Endpoint +
        this.baseUrl +
        "reporting/sales-product-log";

    this.data = new DataManager({
      url: url,
      adaptor: new UrlAdaptor(),
      headers: [
        {
          Authorization: "Bearer " + this.token,
          start: this.dateHelper.toShorDate(this.start),
          end: this.dateHelper.toShorDate(this.end),
        },
      ],
    });
    if (this.byCustomer) {
      this.invoiceService
        .getTurnoverOfCustomer(
          this.customerId,
          this.dateHelper.toShorDate(this.start),
          this.dateHelper.toShorDate(this.end)
        )
        .subscribe((rep) => {
          this.totalAmount = rep;
        });
    }
  }
  public dataBound(e) {}
  async print(row) {}
  async printSelectedInvoices() {}
  async view(salesInvoice) {}
  onStrtChange($event) {
    this.loadInvoices();
  }
  onEndChange($event) {
    this.loadInvoices();
  }
  toggleSearch($event) {}
  onCustomerSelection($event) {
    console.log($event);
    if ($event) {
      console.log($event.id);
      this.byCustomer = true;
      this.customerId = $event.id;
      this.loadInvoices();
      this.byCustomer = false;
    } else {
      this.customerId = null;
      this.loadInvoices();
      this.byCustomer = false;
    }
  }

  exportExcel() {
    console.log("exportation of excel here");
    var url = this.customerId
      ? environment.ResourceServer.Endpoint +
        "invoices/" +
        this.customerId +
        "/export-products-excel"
      : environment.ResourceServer.Endpoint + "invoices/export-products-excel";

    let header = new HttpHeaders();
    header.set("Authorization", "Bearer " + this.authService.getToken);
    if (this.start) url += "?start=" + this.dateHelper.toShorDate(this.start);
    if (this.end && this.start) {
      url += "&&end=" + this.dateHelper.toShorDate(this.end);
    } else if (this.end) {
      url += "?end=" + this.dateHelper.toShorDate(this.end);
    }

    this.http
      .get(url, { headers: header, responseType: "blob" })
      .subscribe((data) => this.saveFile(data)), // console.log(data),
      (error) => console.log("Error downloading the file."),
      () => console.info("OK");
  }
  saveFile(data: any) {
    const contentType =
      "application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet";
    const blob = new Blob([data], { type: contentType });
    //const url = window.URL.createObjectURL(blob);
    saveAs(blob, "journal-ventes" + ".xlsx");
    // window.open(url);
  }

  loadCustomers() {
    this.customers = concat(
      of([]), // default items
      this.customersInput$.pipe(
        filter((res) => {
          return res !== null && res.length >= 3;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => (this.customersLoading = true)),
        switchMap((term) => {
          return this.getCustomers(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.customersLoading = false))
          );
        })
      )
    );
  }
  getCustomers(term: string): Observable<any> {
    let url =
      environment.ResourceServer.Endpoint +
      "customers/salesperson/search?term=" +
      term;
    return this.http.get(url).pipe(
      map((resp) => {
        if (!resp) {
          throwError(resp);
        } else {
          return resp;
        }
      })
    );
  }
}
