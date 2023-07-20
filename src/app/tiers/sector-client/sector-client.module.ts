import { MaterialModule } from 'src/app/shared/material-module';
import { NgModule } from '@angular/core';
import { SectorListComponent } from './sector-list/sector-list.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { AddressModule } from 'src/app/address/address.module';
import { PhoneModule } from 'src/app/phone/phone.module';
import { EmailModule } from 'src/app/email/email.module';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { SectorRouting } from './sector-routing';
import { SectorAddComponent } from './sector-add/sector-add.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [SectorListComponent, SectorAddComponent],
  imports: [
    CommonModule,
    SectorRouting,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule ,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
    MatSortModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatBadgeModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatCardModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSliderModule,
    MatTabsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIconModule,
    NgSelectModule ,
    MaterialModule
  ]
})
export class SectorClientModule { }
