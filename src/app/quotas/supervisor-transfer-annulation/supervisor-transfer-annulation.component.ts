import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { PermissionService } from 'src/app/services/permission.service';
import { QuotaService } from 'src/app/services/quota.service';
import { UserService } from 'src/app/services/user.service';
import { DateHelper } from 'src/app/shared/date-helper';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-supervisor-transfer-annulation',
  templateUrl: './supervisor-transfer-annulation.component.html',
  styleUrls: ['./supervisor-transfer-annulation.component.sass']
})
export class SupervisorTransferAnnulationComponent implements OnInit {
  salespersons : any [] = [];
  canSave = false;
  salespersonsSource : any [] = [];
  currentUser: any;
  constructor(private dialogRef: MatDialogRef<SupervisorTransferAnnulationComponent>,
    private quotaService: QuotaService, 
    private notif: NotificationHelper,
    private inventService : InventSumService,
    private userService: UserService,
    private authService: AuthService,
    private customerService : CustomerService) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getUser();
    var currentId = this.currentUser.sub;
    this.salespersons = await this.userService.getSalesPersonsBySupervisor(currentId).toPromise();
  }
  onSelectSalesPerson($event) {
    if($event) this.canSave = true;
    else this.canSave = false;

  }
  async save() {
    var cmd = {salesPersonIds :  this.salespersonsSource};
    var r = await this.customerService.cancelActualSalesPerson(cmd).toPromise();
    this.notif.showNotification(
      "mat-success",
      "L'annulation a été terminée avec succès",
      "top",
      "right"
    );
    this.close();
  }
  close(){
    this.dialogRef.close();
  }
}
