import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/services/orders.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Order } from '../sales-models/Order';
import { ChangePaymentStateCommand } from '../sales-models/orderItem';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.sass']
})
export class OrderPaymentComponent implements OnInit {
  public form: FormGroup;
  public order: Order;
  constructor(    
    private service  : OrdersService,
    private dialog: MatDialog,
    private notif: NotificationHelper,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrderPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.order = data.order;
    }

  ngOnInit(): void {
    this.createFrom();

  }
  private createFrom() {
    this.form = this.fb.group({
      paymentStatus: [null, [Validators.required]],
    });
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    let command = new ChangePaymentStateCommand();
    command = {
      id : this.order.id,
      paymentStatus : parseInt(this.form.value.paymentStatus),
   
    };
    this.service.ChangePaymentState(command).subscribe(result => {
          this.notif.showNotification('mat-success',"Le changement du status de paiement est terminée avec succès",'top','right');
          this.dialogRef.close(this.order);
    }, (error) => {
      this.notif.showNotification('mat-warn',error,'top','right');

    });

  }
  
}
