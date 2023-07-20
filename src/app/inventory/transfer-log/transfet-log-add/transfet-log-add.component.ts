import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  CommandClickEventArgs,
  GridComponent,
  KeyboardEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { loadCldr, setCulture } from "@syncfusion/ej2-base";
import {
  ConfimDialogComponent,
  ConfirmDialogModel,
} from "src/app/confim-dialog/confim-dialog.component";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { DateHelper } from "src/app/shared/date-helper";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { TransferInventAddComponent } from "../transfer-invent-add/transfer-invent-add.component";
import * as uuid from "uuid";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { TransferLogService } from "src/app/services/transfer-log-service";
@Component({
  selector: "app-transfet-log-add",
  templateUrl: "./transfet-log-add.component.html",
  styleUrls: ["./transfet-log-add.component.sass"],
})
export class TransfetLogAddComponent implements OnInit {
  public form: FormGroup;
  navigation: any;
  gridLines: string;
  toolbarItems: (
    | { text: string; tooltipText: string; id: string; cssClass?: undefined }
    | { text: string; tooltipText: string; id: string; cssClass: string }
  )[];
  editOptions: {
    allowEditing: boolean;
    allowAdding: boolean;
    allowDeleting: boolean;
    mode: string;
  };
  commands: {
    type: string;
    buttonOption: { iconCss: string; cssClass: string };
  }[];
  supplierId: any;
  supplier: any;
  selectedSupplier: any;
  suppliers: any[] = [];
  currentSupplier: any;
  isPsy: boolean;
  cachedProduct: any[] = [];
  products: any[] = [];
  rows: any[] = [];
  selected: any[] = [];
  dialogOpend: any;
  zoneId: string;
  zoneDestId: string;
  stockStateId: string;
  stockStateSourceId: string;
  
  @ViewChild("batchgrid") public grid: GridComponent;
  quantityRules: { required: any[] };
  AmountTTCRules: { required: any[] };
  @ViewChild("refDocument") refDocumentRef: ElementRef;
  @ViewChild("totalAmount") totalAmountRef: ElementRef;
  @ViewChild("totalAmountExcTax") totalAmountExcTaxRef: ElementRef;
  isItemsAlreadyCreated: boolean = false;
  setFocus: any;
  totalAmountExlTax: any;
  transferLogId = uuid.v4();
  currentTransferLog: any;

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.dialogOpend) {
      switch (event.key) {
        case "+":
          event.preventDefault();
          if (this.form.value.supplierId == null) {
            this.notif.showNotification(
              "mat-danger",
              "Merci de  selectionner votre fournisseur",
              "top",
              "right"
            );
          } else {
            this.addProductLine();
          }
          break;
        case "-":
          event.preventDefault();
           this.deleteItem();
          break;
        case "F2":
          event.preventDefault();
          this.SaveStatus();
          break;
        case "F3":
          event.preventDefault();
          this.addProductLine();
          break;
        case "F9":
          var ele = document
            .getElementsByClassName("e-filtertext")
            .namedItem("productName_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
          break;

       
        default:
          break;
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private route: Router,

    private userService: UserService,
    private transferLogService: TransferLogService,
    private _auth: AuthService,
    private dateHelper: DateHelper,
    private dialog: MatDialog,
    private el: ElementRef
  ) {
    this.navigation = route.getCurrentNavigation();

    setCulture("fr");
  }

  async ngOnInit() {
    this.gridLines = "Both";

    this.toolbarItems = [
      {
        text: "Ajouter Article (F3 / +)",
        tooltipText: "",
        id: "addarticle",
      },
      {
        text: "Supprimer Article (-)",
        tooltipText: "",
        id: "deletearticle",
      },

      {
        text: "Sauvgarder (F2)",
        tooltipText: "",
        id: "save",
      },
    ];

    this.editOptions = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Normal",
    };

    this.commands = [
      {
        type: "None",
        buttonOption: { iconCss: "e-icons e-delete", cssClass: "e-flat" },
      },
    ];
    if (this.navigation.extras.state) {
      await this.LoadData();
      this.stockStateId = this.currentTransferLog.stockStateId;
     this.stockStateSourceId = this.currentTransferLog.stockStateSourceId;
      this.zoneDestId = this.currentTransferLog.zoneDestId;
      this.zoneId = this.currentTransferLog.zoneSourceId;
      this.transferLogId = this.currentTransferLog.transferLogId;
    }
  }
  private async LoadData() {
    var id = "";
    if (this.navigation.extras.state) {
      id = this.navigation.extras.state.id;
    } else id = this.currentTransferLog.id;
     
    this.currentTransferLog = await this.transferLogService
      .getById(id)
      .toPromise();
    this.rows = this.currentTransferLog.items;
  }

  clickHandler(args: ClickEventArgs): void {
    if (args.item.id == "addarticle") {
      this.addProductLine();
    }
    if (args.item.id == "save") {
      this.SaveStatus();
    }
    if(args.item.id ==="deletearticle") {
      this.deleteItem();

    }
   
  }

  private deleteItem() {
    var index = this.grid.selectedRowIndex;
    this.transferLogService.deleteItem(this.transferLogId, this.rows[index].productId, this.rows[index].internalBatchNumber).subscribe(res => {
      this.notif.showNotification(
        "mat-primary",
        "La suppression est terminée avec succès",
        "top",
        "right"
      );

      this.rows = this.rows.filter(x => x.internalBatchNumber != this.rows[index].internalBatchNumber && x.productId != this.rows[index].productId);
      this.grid.refresh();
    }, (err) => {
      this.notif.showNotification("mat-warn", err, "top", "right");

    });
  }

  private SaveStatus() {
    if(this.rows .length == 0) 
   {
    this.notif.showNotification("mat-warn", "Journal de transfert sans aucune ligne.", "top", "right");
    return;
   } 
    this.transferLogService.save(this.transferLogId).subscribe(
      (resp) => {
        this.notif.showNotification(
          "mat-primary",
          "L'enregistrement est terminé avec succès",
          "top",
          "right"
        );
        this.route.navigate(["/inventory/transfer-log/transfer-log-list"]);
      },
      (err) => {
        this.notif.showNotification("mat-warn", err, "top", "right");
        return;
      }
    );
  }

  public dataBound(e) {
    this.grid.autoFitColumns();
    this.grid.selectRow(0);
  }
  load(args) {
    console.log(args);
    document
      .getElementsByClassName("e-grid")[0]
      .addEventListener("keydown", this.keyDownHandler.bind(this));

    this.grid.element.addEventListener("keypress", (e: KeyboardEventArgs) => {
      if (e.key == "*") {
        if ((e.target as HTMLElement).classList.contains("e-rowcell")) {
          console.log(this.grid.getSelectedRowCellIndexes());

          if (this.grid.isEdit) this.grid.endEdit();

          let index: number = parseInt(
            (e.target as HTMLElement).getAttribute("Index")
          );
          let colindex: number = parseInt(
            (e.target as HTMLElement).getAttribute("aria-colindex")
          );
          let field: string = this.grid.getColumns()[colindex].field;
          let columns = <any[]>this.grid.columns;

          this.grid.selectRow(index);
          this.grid.startEdit();

          let focusColumns = columns.find((c) => c.field == field);
          console.log(focusColumns);
          focusColumns.edit.obj.element.focus();
        }
      }
    });
  }
  keyDownHandler(e: KeyboardEventArgs) {
    if (e.key === "F2") {
      e.preventDefault();
      this.grid.endEdit();
      e.cancel = true;
      this.SaveStatus();
    }
  }

  commandClick(args: CommandClickEventArgs): void {
    var currentRow = args.rowData as any;
    this.transferLogService.deleteItem(this.transferLogId,currentRow.productId,currentRow.internalBatchNumber ).subscribe(res=> {
      this.notif.showNotification(
        "mat-primary",
        "La suppression est terminée avec succès",
        "top",
        "right"
      );

      this.rows = this.rows.filter(x=> x!= currentRow);
      this.grid.refresh();
     }, (err)=> {
      this.notif.showNotification("mat-warn", err, "top", "right");
    
     })

  }
  getIndexRow(index) {
    return this.grid.getRowIndexByPrimaryKey(index) + 1;
  }
  created() {
    console.log(this.rows);

    //this.addProductLine();
  }
  actionComplete(args) {
    if (args.requestType === "beginEdit" || args.requestType === "add") {
      this.setFocus.edit.obj.element.focus();
    }
    if (args.requestType === "save") {
      console.log(this.rows);
      this.onLineGridChange(args.rowData, args.data);

      this.grid.refresh();
    }
    
  }
  async onLineGridChange(element: any, updatedElement: any) {
      updatedElement.id = this.transferLogId;
      updatedElement.stockStateId = this.currentTransferLog.stockStateId;
      updatedElement.stockStateSourceId = this.currentTransferLog.stockStateSourceId;
      updatedElement.zoneDestId = this.currentTransferLog.zoneDestId;
      updatedElement.zoneSourceId = this.currentTransferLog.zoneSourceId;
    this.transferLogService.update(updatedElement).subscribe(
      (resp) => {
        this.notif.showNotification(
          "mat-primary",
          "La modification est terminée avec succès",
          "top",
          "right"
        );
      },
      (err) => {
        this.notif.showNotification("mat-warn", err, "top", "right");
        this.LoadData();
        
        return;
      }
    );
  }

  save() {}
  async deleteDeliveryReceiptItem(orderItem: any) {}
  async confirmDialog(message, focusNo: boolean = true) {
    const dialogData = new ConfirmDialogModel(
      "Avertissement",
      message,
      focusNo
    );
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData,
    });

    let dialogResult = await dialogRef.afterClosed().toPromise();
    if (dialogResult) return true;
    else return false;
  }

  addProductLine() {
    const dialogConfig = new MatDialogConfig();
    console.log(this.transferLogId);
    dialogConfig.data = {
      id: this.transferLogId,
      count: this.rows.length,
      stockStateId:this.rows.length>0? this.stockStateId : null,
      zoneDestId: this.rows.length>0 ? this.zoneDestId : null,
      zoneId: this.rows.length> 0 ? this.zoneId : null,
      stockStateSourceId :this.rows.length>0 ?  this.stockStateSourceId : null
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "56%";
    dialogConfig.minHeight = "450px";
    if (!this.dialogOpend) {
      var modalRef = this.dialog.open(TransferInventAddComponent, dialogConfig);
      this.dialogOpend = true;
      modalRef.afterClosed().subscribe((res) => {
        this.dialogOpend = false;
        if (res) {
          console.log(res);
          this.rows.push(res);
          this.currentTransferLog = res;
          this.grid.refresh();
          this.stockStateSourceId = res.stockStateSourceId;
          this.stockStateId = res.stockStateId;
          this.zoneDestId = res.zoneDestId;
          this.zoneId = res.zoneSourceId;
         // this.currentTransferLog.stockStateId  = 
        }
      });
    }
  }
  cancelOrder() {
    //throw new Error('Method not implemented.');
  }
  getLineTotalHt(deliveryReceipt) {}
  getLineTotalTTC(deliveryReceipt) {}
  getTotalLineTva(deliveryReceipt: any) {}
  getTotalLineDiscount(deliveryReceipt: any) {}
  getTotalTTCCart() {}
  getTotalDiscountCart() {}
  getTotalTVACart() {}
  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
    console.log(this.setFocus);
  }
}
