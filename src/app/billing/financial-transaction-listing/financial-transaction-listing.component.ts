import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-financial-transaction-listing',
  templateUrl: './financial-transaction-listing.component.html',
  styleUrls: ['./financial-transaction-listing.component.sass']
})
export class FinancialTransactionListingComponent extends BaseComponent implements OnInit {

  @ViewChild('grid') public grid: GridComponent;
  public dropStates: string[]  = Object.keys(this.enumLookupData["financialTransactionType"]);

  public fieldType: object = { text: 'financialTransactionType', value: 'financialTransactionType' };
  constructor(
    private authService : AuthService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private signalRService : SignalRService
  ) {
    super(authService,'financial-transaction/');
  }
  ngOnInit(): void {
    this.loadData();
  }
  public dataBound(e) {

    this.grid.selectRow(0);
  }
}
