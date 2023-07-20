import { Component, OnInit, ViewChild } from "@angular/core";
import {
  CommandModel,
  DetailRowService,
  EditSettingsModel,
  GridComponent,
  GridModel,
  RowSelectEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { AuthService } from "src/app/services/auth.service";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { TransferLog, TransferLogItem } from "../models/trasfer-log";
import { TransferLogService } from "src/app/services/transfer-log-service";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { BaseComponent } from "src/app/shared/BaseComponent";

@Component({
  selector: "app-transfer-log-list",
  templateUrl: "./transfer-log-list.component.html",
  styleUrls: ["./transfer-log-list.component.sass"],
  providers: [DetailRowService]
})
export class TransferLogListComponent extends BaseComponent implements OnInit {
  public dropStates: string[] = ["Créé", "Enregistré", "Validé", "Annulé"];
  @ViewChild("grid") public grid: GridComponent;
  public data: DataManager;
  gridLines: string;
  public editSettings: EditSettingsModel;
  public commandListing: CommandModel[];
  isOpen: any;
  childGrid: GridModel = {
    dataSource: [],
    queryString: "transferLogId",
    columns: [
      { field: 'transferLogId', headerText: 'N°', textAlign: 'Right',  visible : false},
      { field: 'inventId', headerText: 'N°', textAlign: 'Right',  visible : false},
      { field: "productCode", headerText: "Code produit", width: 90 },
      { field: "productName", headerText: "Nom", width: 250 },
      { field: "internalBatchNumber", headerText: "Lot Int", width: 150 },
      { field: "quantity", headerText: "Qnt", width: 150 },
      
    ],
  };
  constructor(private _auth: AuthService, private route: Router, 
    private transferLogService : TransferLogService,
    private notifHelper :NotificationHelper) {
    super(_auth, "transfer-logs/");
    this.gridLines = "Both";
    this.editSettings = { allowEditing: true, allowDeleting: true };
    this.commandListing = [
      {
        type: "None",
        title: "Editer",
        buttonOption: { iconCss: "e-icons e-edit", cssClass: "e-flat" },
      },
      {
        type: "None",
        title: "Réapprovisioner",
        buttonOption: { iconCss: "e-icons  e-upload", cssClass: "e-flat" },
      },
      {
        type: "None",
        title: "Supprimer",
        buttonOption: { iconCss: "e-icons e-delete", cssClass: "e-flat" },
      },
    ];
  }

  ngOnInit(): void {
    this.loadData();
  }
  ListingCommandClick($event) {
    console.log($event);
  }
  add() {
    this.route.navigate(["/inventory/transfer-log/transfer-log-add"], {
      state: null,
    });
    this.isOpen = false;
  }
  public onChange(args: any): void {
    console.log(args);
    let filter;
    switch (args.value) {
      case "Créé":
        filter = "0";
        break;
      case "Enregistré":
        filter = "1";
        break;
      case "Validé":
        filter = "2";
        break;
      case "Annulé":
        filter = "3";
        break;

      default:
        break;
    }
    console.log(args);
    console.log(filter);

    if (filter != null) this.grid.filterByColumn("status", "equal", filter);
    else this.grid.removeFilteredColsByField("status", true);
  }

  public dataBound($event) {

 var details: TransferLogItem[] = [];

    var data = this.grid.getCurrentViewRecords() as TransferLog[];
    data.forEach(element => {
      for (let index = 0; index < element.items.length; index++) {
        const item = element.items[index];
        details.push(item);
      }
    });
    
    this.grid.childGrid.dataSource = details;
    this.grid.selectRow(0);
  }
  validate(row) {
    console.log(row);
    this.transferLogService.validate(row.transferLogId).subscribe(rsp=> {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.loadData();
     
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });

  }
  edit(row) {
    this.route.navigate(["/inventory/transfer-log/transfer-log-add"], {
      state: {id : row.transferLogId},
    });
  }
  save(row) {
    this.transferLogService.save(row.transferLogId).subscribe(resp => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.loadData();
   }, (err)=>  {
    this.notifHelper.showNotification('mat-warn', err, 'top', 'right');
    return;
   });
  }
  delete(row) {
    this.transferLogService.delete(row.transferLogId).subscribe(resp => {
      this.notifHelper.showNotification('mat-primary', "La suppression est terminée avec succès", 'top', 'right');
      this.loadData();
   }, (err)=>  {
    this.notifHelper.showNotification('mat-warn', err, 'top', 'right');
    return;
   });
  }
}
