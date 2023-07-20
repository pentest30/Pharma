import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DataManager } from '@syncfusion/ej2-data';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { QuotaService } from 'src/app/services/quota.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DateHelper } from 'src/app/shared/date-helper';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { SupervisorTransferAnnulationComponent } from '../supervisor-transfer-annulation/supervisor-transfer-annulation.component';
import { SupervisorTransfertComponent } from '../supervisor-transfert/supervisor-transfert.component';

@Component({
  selector: 'app-supervisor-transfer-list',
  templateUrl: './supervisor-transfer-list.component.html',
  styleUrls: ['./supervisor-transfer-list.component.sass']
})
export class SupervisorTransferListComponent extends BaseComponent implements OnInit {
  data: DataManager;
  public customerState : string[] = ["Actif", "Bloqué"];
  @ViewChild("grid")
  public grid: GridComponent;
  constructor(private dialog: MatDialog,
    private authService : AuthService,
    private dialogHelper: DialogHelper,
     private quotaService : QuotaService,
     private notif: NotificationHelper,
      private permService: PermissionService, 
       private dateHelper: DateHelper  ) { 
    super(authService, "customers/supervisor/");
  }

  ngOnInit(): void {
    this.loadData();
  }
  quotaTransfer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {requestId : null};
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
   // dialogConfig.width ="700px";
    //dialogConfig.height ="600px";
    var modalRef = this.dialog.open(SupervisorTransfertComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
  }
  cancelQuotaTransfer () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {requestId : null};
    // dialogConfig.maxWidth = '100vw';
    // dialogConfig.maxHeight = "100vh";
    // dialogConfig.height = "100%";
    // dialogConfig.width = "100%";
    // dialogConfig.panelClass= 'full-screen-modal';
    dialogConfig.width ="600px";
    dialogConfig.height ="450px";
    var modalRef = this.dialog.open(SupervisorTransferAnnulationComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
  }
  edit(row) {
    
  }
}
