import { MaterialModule } from './shared/material-module';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import { RightSidebarService } from './services/rightsidebar.service';
import { WINDOW_PROVIDERS } from './services/window.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDateFormats, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMaskModule } from 'ngx-mask';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgmCoreModule } from '@agm/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { AdvanceTableService } from '../app/tables/advance-table/advance-table.service';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { ConfimDialogComponent } from './confim-dialog/confim-dialog.component';
import { GlobalErrorHandler } from './shared/global-error-handler';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { AuthCallbackComponent } from '../app/auth/auth-callback/auth-callback.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { AppAutofocusDirective } from './shared/appAutoFocus.directive';
import { FormDirective } from './shared/focusInvalidInput.directive';
import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/fr/ca-gregorian.json';
import * as numbers from 'cldr-data/main/fr/numbers.json';
import * as timeZoneNames from 'cldr-data/main/fr/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);

import { NgSelectModule } from '@ng-select/ng-select';
import { DialogHelper } from './shared/DialogHelper';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { HttpCancelService } from './services/httpCancelService';
import { CustomSelectComponent } from './shared/layout/custom-select/custom-select.component';

// Import your library
import { NgxPermissionsModule } from 'ngx-permissions';
import { PermissionsService } from './services/permissions.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

const MY_FORMAT: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
const dbConfig: DBConfig = {
  name: 'coolDB',
  version: 3,
  objectStoresMeta: [
    {
      store: 'products',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
        { name: 'salePrice', keypath: 'salePrice', options: { unique: false } },
        { name: 'code', keypath: 'code', options: { unique: false } },
        { name: 'fullName', keypath: 'fullName', options: { unique: false } },
        { name: 'unitPrice', keypath: 'unitPrice', options: { unique: true } },
        { name: 'defaultLocation', keypath: 'defaultLocation', options: { unique: true } },
        { name: 'discount', keypath: 'discount', options: { unique: true } },
        { name: 'hasQuota', keypath: 'hasQuota', options: { unique: true } },
        { name: 'innCodeId', keypath: 'innCodeId', options: { unique: true } },
        { name: 'innCodeName', keypath: 'innCodeName', options: { unique: true } },
        { name: 'manufacturer', keypath: 'manufacturer', options: { unique: true } },
        { name: 'organizationId', keypath: 'organizationId', options: { unique: true } },
        { name: 'pfs', keypath: 'pfs', options: { unique: true } },
        { name: 'pickingZoneId', keypath: 'pickingZoneId', options: { unique: true } },
        { name: 'productClassName', keypath: 'productClassName', options: { unique: true } },
        { name: 'productId', keypath: 'productId', options: { unique: true } },
        { name: 'psychotropic', keypath: 'psychotropic', options: { unique: true } },
        { name: 'purchasePrice', keypath: 'purchasePrice', options: { unique: true } },
        { name: 'quantity', keypath: 'quantity', options: { unique: true } },
        { name: 'tax', keypath: 'tax', options: { unique: true } },
        { name: 'taxGroup', keypath: 'taxGroup', options: { unique: true } },
        { name: 'thermolabile', keypath: 'thermolabile', options: { unique: true } },
        { name: 'totalQnt', keypath: 'totalQnt', options: { unique: true } },
        { name: 'thermolabile', keypath: 'thermolabile', options: { unique: true } },
        { name: 'totalRQ', keypath: 'totalRQ', options: { unique: true } }
      ]
    }, {
      store: 'zones',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'groupName', keypath: 'groupName', options: { unique: false } },
        { name: 'order', keypath: 'order', options: { unique: false } },
        { name: 'zoneGroupId', keypath: 'zoneGroupId', options: { unique: false } },
        { name: 'zoneType', keypath: 'zoneType', options: { unique: false } },
        { name: 'zoneGroup', keypath: 'zoneGroup', options: { unique: false } },

      ]

    }]
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    ConfimDialogComponent,
    AuthCallbackComponent,
    AppAutofocusDirective,
    FormDirective,
    CustomSelectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatMenuModule,
    ClickOutsideModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    NgxDatatableModule,
    MaterialModule,
    MatTableModule,
    MatSelectModule,
    Ng2TelInputModule,
    NgSelectModule,
    NgxPermissionsModule.forRoot(),
    NgxMaskModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'YOUR API KEY'
    }),
    NgxIndexedDBModule.forRoot(dbConfig),

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    //{ provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG.handlers,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    DynamicScriptLoaderService,
    RightSidebarService,
    MatSnackBar,
    AuthService,
    DialogHelper,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
    HttpCancelService,
    //AdvanceTableService,
    WINDOW_PROVIDERS,
    PermissionsService
  ],
  entryComponents: [
    MatDialogModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
