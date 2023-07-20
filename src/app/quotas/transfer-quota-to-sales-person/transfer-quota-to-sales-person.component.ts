import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataManager } from '@syncfusion/ej2-data';
import { UserApp } from 'src/app/membership/models/user-app';
import { AuthService } from 'src/app/services/auth.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { QuotaService } from 'src/app/services/quota.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-transfer-quota-to-sales-person',
  templateUrl: './transfer-quota-to-sales-person.component.html',
  styleUrls: ['./transfer-quota-to-sales-person.component.sass']
})
export class TransferQuotaToSalesPersonComponent implements OnInit {

  salesPersons: UserApp[];
  currentUser : any;
  selectedSalesPerson : any;
  oldSalesPerson : any;
  constructor(private dialogRef: MatDialogRef<TransferQuotaToSalesPersonComponent>,
    private quotaService: QuotaService, 
    private notif: NotificationHelper,
    private inventService : InventSumService,
    private userService: UserService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private data
    ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getUser();
    this.salesPersons = await this.userService.getSalesPersonsBySupervisor(this.currentUser.sub).toPromise();
    this.salesPersons = this.salesPersons.filter(x => x.id != this.data.salesPersonId);
  }
  save() {
    if(this.selectedSalesPerson){
    var command = {
    oldSalesPersonId : this.data.salesPersonId,
    newSalesPersonId : this.selectedSalesPerson.id,
    productId : this.data.productId
    };
    console.log(this.data);
    this.quotaService.updateQuotaSalesPerson(command).subscribe(
      (result) => {
        //console.log(this.quotaId.availableQuantity);
        this.notif.showNotification(
          "mat-success",
          "Quota transferée avec succès",
          "top",
          "right"
        );

      },
      (error) => {
        this.notif.showNotification("mat-warn", error, "top", "right");
      }
    );

    this.dialogRef.close(null);
    
    }
  }
  close() {
    this.dialogRef.close(null);
  }
  rowSelected($event) {
    console.log($event.data);
    this.selectedSalesPerson = $event.data;
  }
}
