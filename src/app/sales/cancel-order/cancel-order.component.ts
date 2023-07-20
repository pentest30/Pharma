import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/services/orders.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Order } from '../sales-models/Order';
import { UpdateOrderBySalesPersonCommand } from '../sales-models/orderItem';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.sass']
})
export class CancelOrderComponent implements OnInit {
  public form: FormGroup;
  public order: Order;
  public state: number;
  constructor(
    private service  : OrdersService,
    private dialog: MatDialog,
    private notif: NotificationHelper,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CancelOrderComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    
  ) { 
    this.order = data.order;
    this.state = data.state;
  }

  ngOnInit(): void {
    this.createFrom();

  }
  private createFrom() {
    this.form = this.fb.group({
      reason: [null, [Validators.required]],
    });
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    if (this.form.invalid) {
      return;
    }
   
    this.changeState(this.order);

  }
  changeState(order) {
    let command = new UpdateOrderBySalesPersonCommand();
    command = {
      id : order.id,
      orderStatus : this.state,
      supplierId : order.supplierId,
      cancellationReason: (this.state == 70) ? parseInt(this.form.value.reason) : null,
      rejectedReason:(this.state == 80) ? this.form.value.reason : null
    };
    this.service.ChangeState(command).subscribe(result => {
          this.notif.showNotification('mat-success',"La demande d'annulation est terminée avec succès",'top','right');
          this.dialogRef.close(order);
    }, (error) => {
      this.notif.showNotification('mat-warn',error,'top','right');

    });
  }
}
