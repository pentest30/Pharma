import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-preparation-order-detail',
  templateUrl: './preparation-order-detail.component.html',
  styleUrls: ['./preparation-order-detail.component.sass']
})
export class PreparationOrderDetailComponent implements OnInit {

  @ViewChild('grid') public grid: GridComponent;
  bl: any;
  items: any = [];
  constructor(
    private authService : AuthService,
    private orderPreparationService : PreparationOrdersService,
    private notif: NotificationHelper,
    private dialogRef: MatDialogRef<PreparationOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private permService: PermissionService
  ) { }

  ngOnInit(): void {
    this.bl = this.data.bl;
    if(this.data.pickingZoneId == null ) this.items = this.bl.preparationOrderItems;
    else this.items  = Object.assign(this.bl.preparationOrderItems.filter(c => c.pickingZoneId == this.data.pickingZoneId));

  }
  close (){
    this.dialogRef.close(null);
  }
}
