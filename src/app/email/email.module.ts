import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailListComponent } from './email-list/email-list.component';
import { EmailAddComponent } from './email-add/email-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [ EmailListComponent, EmailAddComponent],
  exports: [ EmailListComponent, EmailAddComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule, 
    MatButtonModule,
    MatSortModule,
    MatIconModule
  ]
})
export class EmailModule { }
