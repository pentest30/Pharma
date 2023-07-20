import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-transaction-listing',
  templateUrl: './transaction-listing.component.html',
  styleUrls: ['./transaction-listing.component.sass']
})
export class TransactionListingComponent extends BaseComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  public data: DataManager;
  gridLines: string;
  public editSettings: EditSettingsModel;
  public commandListing: CommandModel[];
  public dropTransactionTypes: string[] = ["Réception fournisseur","Facture fournisseur","Réajustement inventaire","Transfert inter-filiale","Bon de livraison client","Facture client","Incineration","Transfert"];
  public fields: object = { text: 'transactionType', value: 'transactionType' };
  filters: object = {};
  public dropZoneName: string[]  = Object.keys(this.enumLookupData["zoneId"]);
  public dropStockState: string[]  = Object.keys(this.enumLookupData["stockStateId"]);

  constructor(private _auth: AuthService) {
    super(_auth,"transactions/");
  }

  ngOnInit(): void {
    this.loadData();
  }
}
