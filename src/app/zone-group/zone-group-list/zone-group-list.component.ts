import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { ZoneGroupService } from 'src/app/services/zone-group.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { ZoneGroupAddComponent } from '../zone-group-add/zone-group-add.component';

@Component({
  selector: 'app-zone-group-list',
  templateUrl: './zone-group-list.component.html',
  styleUrls: ['./zone-group-list.component.sass']
})
export class ZoneGroupListComponent implements OnInit {

  data: DataManager;
  isSales : boolean = false;
  isSuprvisor : boolean = false;
  constructor(private dialog: MatDialog, 
    private authService : AuthService,
    private zoneGroupService : ZoneGroupService,
    private notif: NotificationHelper, private permService: PermissionService) { }

  ngOnInit(): void {

   this.loadData();
  }
  confirmDialog(row): void {
    
    const message = 'Est-vous sûr de vouloir supprimer ' + row.name;
 
    const dialogData = new ConfirmDialogModel("Confirmation", message);
 
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
 
    dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult) {
      this.zoneGroupService.deleteZoneGroup(row.id).subscribe(msg => {
        this.notif.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
        this.loadData();
      }, (error) => {
        this.notif.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
     }
    });
   
  }
  loadData() {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "zoneGroups" + "/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
  }
  async edit(row ) {
    console.log(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = row;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(ZoneGroupAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if(data!=null)
        this.loadData();
    });
  }
  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
   // dialogConfig.width ="400px";
    var modalRef = this.dialog.open(ZoneGroupAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
  }
  delete (row) {
    this.confirmDialog(row);
  }
}
