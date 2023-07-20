import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PermissionService } from 'src/app/services/permission.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DateHelper } from 'src/app/shared/date-helper';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { EmployeeAddComponent } from '../employee-add/employee-add.component';

@Component({
  selector: 'app-listing-employee',
  templateUrl: './listing-employee.component.html',
  styleUrls: ['./listing-employee.component.sass']
})
export class ListingEmployeeComponent extends BaseComponent  implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight - 415 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);
  
  }
  constructor(  
    private service  : OrdersService,
    private employee: EmployeeService, 
    private notif: NotificationHelper,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private dialogHelper: DialogHelper,
    private dateHelper: DateHelper,
    private fb: FormBuilder,
    private _auth: AuthService,
    private route: Router) {
    super(_auth,"employees/");
  }

  ngOnInit(): void {
    if(this.baseUrl != null) this.loadData();

  }
  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
      var modalRef = this.dialog.open(EmployeeAddComponent, dialogConfig);
      modalRef.afterClosed().subscribe(data => {
        if(data!=null)
          this.loadData();
      });
  }
  edit(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    dialogConfig.data = {
      employee: row
    };
    dialogConfig.autoFocus = true;
      var modalRef = this.dialog.open(EmployeeAddComponent, dialogConfig);
      modalRef.afterClosed().subscribe(data => {
        if(data!=null)
          this.loadData();
      });
  }
}
