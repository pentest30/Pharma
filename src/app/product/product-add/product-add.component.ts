import { UploadFileService } from './../../services/upload-file.service';
import { Pharmacological } from './../../pharmacological-class/models/pharmacological-model';
import { ProductService } from './../../services/product.service';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { PickingZone } from './../../picking-zone/models/picking-zeone';
import { BrandAddComponent } from './../../brand/brand-add/brand-add.component';
import { BrandService } from 'src/app/services/brand.service';
import { ListsAddComponent } from './../../lists/lists-add/lists-add.component';
import { ListService } from './../../services/list.service';
import { Lists } from './../../lists/models/list-model';
import { PackagingService } from 'src/app/services/packaging.service';
import { FormAddComponent } from './../../form/form-add/form-add.component';
import { Form } from './../../form/models/form-model';
import { DciCodeService } from 'src/app/services/dci-code.service';
import { ProductClassService } from './../../product-class/product-class-list/product-class.service';
import { TaxGroupService } from './../../services/tax-group.service';
import { ManufacturerService } from 'src/app/services/manufacturer.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Manufacturer } from 'src/app/manufacturer/models/manufacturer-model';
import { TaxGroup } from 'src/app/tax-group/models/tax-group';
import { ProductClass } from 'src/app/product-class/models/product-class-model';
import { ProductClassAddComponent } from 'src/app/product-class/product-class-add/product-class-add.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DciCode } from 'src/app/dci-code/dci-code-models/dci-code';
import { DciCodeAddComponent } from 'src/app/dci-code/dci-code-add/dci-code-add.component';
import { FormService } from 'src/app/services/form.service';
import { Packaging } from 'src/app/packaging/models/packaging';
import { PackagingAddComponent } from 'src/app/packaging/packaging-add/packaging-add.component';
import { Brand } from 'src/app/brand/models/brand-model';
import { PickingZoneAddComponent } from 'src/app/picking-zone/picking-zone-add/picking-zone-add.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../prodcut-models/product';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Router } from '@angular/router';
import { ITherapeuticClass } from 'src/app/services/interfaces/therapeutic-class';
import { TherapeuticClassService } from 'src/app/services/therapeutic-class-service';
import { PharmacologicalService } from 'src/app/services/pharmacological-class.service';
import { TherapeuticClassAddComponent } from 'src/app/therapeutic-class/therapeutic-class-add/therapeutic-class-add.component';
import { PharmacologicalClassAddComponent } from 'src/app/pharmacological-class/pharmacological-class-add/pharmacological-class-add.component';
import { PermissionService } from 'src/app/services/permission.service';
import { ActionsPermissions } from '../prodcut-models/product.permission';
import { ManufacturerAddComponent } from 'src/app/Manufacturer/manufacturer-add/manufacturer-add.component';
import { TaxGroupAddComponent } from 'src/app/tax-group/tax-group-add/tax-group-add.component';
import { UploadImageAddComponent } from 'src/app/upload-image/upload-image-add/upload-image-add.component';
import * as uuid from 'uuid';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, ReplaySubject } from 'rxjs';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import * as Editor from '@ckeditor/ckeditor5-build-classic'
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.sass']
})
export class ProductAddComponent implements OnInit {
  public manufacturers: Manufacturer[];
  public brands: Brand[];
  public taxGroups: TaxGroup[];
  public productClasses: ProductClass[];
  public therapeuticCalsses: ITherapeuticClass[];
  public pharmacologicalClasses: Pharmacological[];
  public dciCodes: DciCode[];
  public filteredPharmacologicals: ReplaySubject<Pharmacological[]> = new ReplaySubject<Pharmacological[]>(1);
  public packagings: Packaging[];
  public pickingZones: PickingZone[];
  public lists: Lists[];
  public isDrug: boolean = false;
  public code?: any;
  public fullName: string = "";
  public description?: string = "Some text here";
  public registrationNumber?: string = "";
  public publicPrice: number;
  public referencePrice: number;
  public imported: boolean;
  public refundable: boolean;
  public psychotropic: boolean;
  public thermolabile: boolean;
  public removed: boolean;
  public forHospital: boolean;
  public packagingContent?: string;
  public packagingContentUnit?: string;
  public productClassId: string ;
  public therapeuticClassId?: string;
  public pharmacologicalClassId?: string;
  public innCodeId?: string;
  public taxGroupId: string;
  public brandId: string;
  public manufacturerId: string;
  public pickingZoneId: string;
  public defaultLocation: string = "";
  public id: string;
  public dciConcat: string = "";
  public dosageConcat: string = "";
  public productionDate?: Date;
  public listId?: string;
  public formId: string;
  public forms: Form[];
  public form: FormGroup;
  public loading: boolean;
  public shp: number;
  public princeps: boolean;
  public packagingId: any;
  public packaging: number = 0;
  public purchasePrice: number;
  public salePrice: number;
  public externalCode?: string;
  public height: number;
  public width: number;
  public length: number;
  public hasQuota : boolean = false;
  public files: any[] = [];
  public draftCreator: boolean = false;
  perm : ActionsPermissions;
  public productId: string;

  public Editor = Editor;

  public pharmacologicalClassFilterCtrl: FormControl = new FormControl();
  @ViewChild('matSelectInfiniteScroll', { static: true } )
  infiniteScrollSelect: MatSelect;

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  constructor(private manufacturerService: ManufacturerService,
    private taxService: TaxGroupService,
    private productClassService: ProductClassService,
    private dciCodeService: DciCodeService,
    private formService: FormService,
    private packaginService: PackagingService,
    public listSerivce: ListService,
    public brandService: BrandService,
    public pickingZoneService: PickingZoneService,
    private therapeuticClassService: TherapeuticClassService,
    private pharmacologicalService: PharmacologicalService,
    public service: ProductService,
    public uploadService: UploadFileService,
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private route: Router,
    private permissionService: PermissionService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.createForm();
    this.productId =  uuid.v4();
    this.perm = this.permissionService.getCatalogModulePermissions();
   console.log(this.perm);
    if (!this.perm.canCreate  &&! this.perm.canCreateDraft) {
      this.notif.showNotification('mat-warn', "Vous n'avez pas l'autorisation d'accéder a cette ressource. contactez votre administrateur", 'top', 'right');
      this.close();
      return
    }



    this.loading = true;
    this.loadDataRefrences();

    this.loading = false;
  }

  private loadDataRefrences() {
    this.loadManufacturer();
    this.loadTaxGroup();
    this.loadDciCodes();
    this.loadFroms();
    this.loadPharmacologicalClasses();
    this.loadThearapeuticClasses();
    this.loadProductClasses();
    this.loadPackaging();
    this.loadLists();
    this.loadBrands();
    this.loadPickingZones();
    this.loadCodeProduct();
  }
   pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  loadCodeProduct() {
    this.service.getLastCode().subscribe(resp=> {
      this.code = resp;
     if(resp) this.form.patchValue({code : this.pad(this.code, 8, '0')});
     else this.form.patchValue({code : "00000000"})
    })
  }

  loadManufacturer() {
    this.manufacturerService.getAll().subscribe(resp => {
      this.manufacturers = resp;
    });
  }
  loadTaxGroup() {
    this.taxService.getAll().subscribe(resp => {
      this.taxGroups = resp;
    });
  }
  onSelectDciCode($evt) {
    var item = this.dciCodes.filter(f => f.id == $evt)[0];
    var form = this.forms.find(x=>x.id == item.formId);
   if(item){
    this.formId = item.formId;
     this.form.patchValue({formId: form.id});
    //
    this.concatDci(item);
    if (this.isDrug)
      this.concatDosage(item);
   }

  }
  private concatDci(item: DciCode) {
    this.dciConcat = "";
    if (item.innCodeDosages.length == 1)
      this.dciConcat =(item.innCodeDosages[0])?item.innCodeDosages[0].inn.name : "";
    else {
      for (let index = 0; index < item.innCodeDosages.length - 1; index++) {
        const element = item.innCodeDosages[index];
        this.dciConcat +=element.inn? element.inn.name + "/" : "";
      }
      this.dciConcat +=item.innCodeDosages[0]? item.innCodeDosages[item.innCodeDosages.length - 1].inn.name : "";
    }
  }

  private concatDosage(item: DciCode) {
    this.dosageConcat = "";
    if (item.innCodeDosages.length == 1)
      this.dosageConcat =item.innCodeDosages[0]? item.innCodeDosages[0].dosage.name :"";
    else {
      for (let index = 0; index < item.innCodeDosages.length - 1; index++) {
        const element = item.innCodeDosages[index];
        this.dosageConcat += element.dosage.name + "/";
      }
      this.dosageConcat +=item.innCodeDosages[item.innCodeDosages.length - 1]? item.innCodeDosages[item.innCodeDosages.length - 1].dosage.name : "";
    }
  }

  private loadDciCodes() {
    this.dciCodeService.getAll().subscribe(resp => {
      console.log(resp);
      this.dciCodes = resp;

    })
  }
  private loadThearapeuticClasses() {
    this.therapeuticClassService.getAll().subscribe(resp => {
      this.therapeuticCalsses = resp;
    })
  }
  private loadPharmacologicalClasses() {
    this.pharmacologicalService.getAll().subscribe(resp => {
      this.pharmacologicalClasses = resp;
    })
  }
  private loadProductClasses() {
    this.productClassService.getAllProductClasses().subscribe(resp => {
      this.productClasses = resp;
    });
  }
  private loadFroms() {
    this.formService.getAll().subscribe(resp => {
      this.forms = resp;
    });
  }
  private loadPackaging() {
    this.packaginService.getAll().subscribe(resp => {
      this.packagings = resp;

    });
  }
  private loadLists() {
    this.listSerivce.getAll().subscribe(resp => {
      this.lists = resp;

    });
  }
  private loadBrands() {
    this.brandService.getAll().subscribe(resp => {
      this.brands = resp;

    });
  }
  private loadPickingZones() {
    this.pickingZoneService.getAll().subscribe(resp => {
      this.pickingZones = resp;

    });
  }
  save() {

    if(this.form.value.purchasePrice!=null && this.form.value.salePrice!=null
      && (this.form.value.purchasePrice==0 || this.form.value.salePrice==0)){
    const message = 'Le prix d\achat et de vente ne peuvent pas être nuls?\nVoulez vous continuer?';
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(!dialogResult)   return;
      if(this.form.value.purchasePrice!=null && this.form.value.salePrice!=null
        && this.form.value.purchasePrice>this.form.value.salePrice){
      const message2 = 'Le prix d\'achat est supérieur au prix de vente!\nVoulez vous continuer? ';
      const dialogData2 = new ConfirmDialogModel("Confirmation", message2);
      const dialogRef2 = this.dialog.open(ConfimDialogComponent, {
        maxWidth: "400px",
        data: dialogData2
      });

      dialogRef2.afterClosed().subscribe(dialogResult => {
       if(!dialogResult)     return;
      if (this.form.invalid)
      return;
            this.addProduct(false);

       });
    }

    else{
        if (this.form.invalid)
        return;
        this.addProduct(false);
    }
    }
    );
  }
  else
  {
    if(this.form.value.purchasePrice!=null && this.form.value.salePrice!=null
      && this.form.value.purchasePrice>this.form.value.salePrice){
    const message2 = 'Le prix d\'achat est supérieur au prix de vente!\nVoulez vous continuer? ';
    const dialogData2 = new ConfirmDialogModel("Confirmation", message2);
    const dialogRef2 = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData2
    });

    dialogRef2.afterClosed().subscribe(dialogResult => {
     if(!dialogResult)     return;
    if (this.form.invalid)
    return;
          this.addProduct(false);

     });
  }
  else
  {
      if (this.form.invalid)
      return;
      this.addProduct(false);
  }
  }
}
  saveAndContinue() {
    if (this.form.invalid)
      return;
    this.addProduct(true);

  }

  uploadFile(product,file) {
    const formData = new FormData();
    file.forEach(element => {
      formData.append('file[]', element.data);
    });
    file.inProgress = true;
    this.uploadService.upload(product, formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.notif.showNotification('mat-primary', "Le chargement de l'image est terminé avec succès", 'top', 'right');
          console.log(event.body);
        }
      });
  }
  onFileChanged($evt: any) {
    this.files = $evt.target.files;
  }
  private addProduct(cont: boolean) {
    var product = new Product();
    product = this.form.value;
    if (product.refundable == null)
      product.refundable = false;
    if (product.removed == null)
      product.removed = false;
    if (product.forHospital == null)
      product.forHospital = false;
    if (product.imported == null)
      product.imported = false;
    if (product.princeps == null)
      product.princeps = false;
    if (product.thermolabile == null)
      product.thermolabile = false;
    if (product.psychotropic == null)
      product.psychotropic = false;
    if (product.publicPrice == null)
      product.publicPrice = 0;
    if (product.referencePrice == null)
      product.referencePrice = 0;
    if (product.packaging == null)
      product.packaging = 0;
      if (product.hasQuota == null)
      product.hasQuota = false;
    if (product.salePrice == null) product.salePrice = 0;
    if (product.purchasePrice == null) product.purchasePrice = 0;
    if (product.width == null) product.width = 0;
    if (product.length == null) product.length = 0;
    if (product.height == null) product.height = 0;
    this.service.add(product).subscribe(msg => {
      this.notif.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.uploadFile(product,this.files);
      if (cont) this.form.reset();
      else this.close();
    }, (error) => {
      this.notif.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  addtherapeuticCalsse() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(TherapeuticClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadThearapeuticClasses();
    });
  }
  addPharmacologicalClasses() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(PharmacologicalClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadPharmacologicalClasses();
    });

  }
  addCodeDci() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(DciCodeAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadDciCodes();
    });
  }
  addClass() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(ProductClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadProductClasses();
    });
  }
  addForm() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(FormAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadFroms();
    });
  }
  addPackaging() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(PackagingAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadPackaging();
    });
  }
  addPikingZone() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(PickingZoneAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if(data!= null) this.form.get('pickingZoneId').setValue(data.id);
      this.loadPickingZones();
    });
  }
  addManufacturer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      showBreadCrumb: false
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '75%';
    const modalRef = this.dialog.open(ManufacturerAddComponent, dialogConfig);

    modalRef.afterClosed().subscribe(data => {
      console.log(data);
      if(data!= null)  {
        this.loadDataRefrences();

        this.form.get('manufacturerId').setValue(data);
      }
    });
  }
  addList() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(ListsAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadLists();
    });
  }
  addBrand() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(BrandAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadBrands();
    });
  }

  addTaxGroup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(TaxGroupAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadTaxGroup();
    });
  }

  onSelectProductClass($evt) {
    console.log($evt)
    var item = this.productClasses.filter(f => f.id == $evt)[0];
    this.isDrug = item.isMedicamentClass;
  }
  onSelectList($evt) {
    var item = this.lists.filter(f => f.id == $evt)[0];
    this.shp = item.shp;
  }
  close() {
    this.route.navigate(["/product/product-list"]);
  }
  uploadImages () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(UploadImageAddComponent, dialogConfig);
    modalRef.beforeClosed().subscribe(result => {
      if(result.length) this.files = this.files.concat(result);
    });


   }
  createForm() {

    this.form = this.fb.group({
      code: [this.code, [Validators.required]],
      fullName: [this.fullName, [Validators.required]],
      description: [this.description, []],
      id: [this.id, []],
      registrationNumber: [this.registrationNumber, []],
      publicPrice: [this.publicPrice, []],
      referencePrice: [this.referencePrice, []],
      imported: [this.imported, []],
      refundable: [this.refundable, []],
      psychotropic: [this.psychotropic, []],
      thermolabile: [this.thermolabile, []],
      removed: [this.removed, []],
      princeps: [this.princeps, []],
      forHospital: [this.forHospital, []],
      packagingContent: [this.packagingContent, []],
      packagingContentUnit: [this.packagingContentUnit, []],
      productClassId: [this.productClassId, [Validators.required]],
      therapeuticClassId: [this.therapeuticClassId, []],
      pharmacologicalClassId: [this.pharmacologicalClassId, []],
      innCodeId: [this.innCodeId, []],
      taxGroupId: [this.taxGroupId, [Validators.required]],
      manufacturerId: [this.manufacturerId, [Validators.required]],
      packaging: [this.packaging, []],
      productionDate: [this.productionDate, []],
      brandId: [this.brandId, []],
      pickingZoneId: [this.pickingZoneId, []],
      defaultLocation: [this.defaultLocation, []],
      formId: [this.formId, []],
      dosageConcat: [this.dosageConcat, []],
      dciConcat: [this.dciConcat, []],
      packagingId: [this.packagingId, []],
      listId: [this.listId, []],
      shp: [this.shp, []],
      purchasePrice: [this.purchasePrice, []],
      salePrice: [this.salePrice, []],
      externalCode: [this.externalCode, []],
      width: [this.width, []],
      height: [this.height, []],
      length: [this.length, []],
      images:[[],[]],
      hasQuota : [this.hasQuota, []]
    });
  }
  protected filterPharmacologicals() {
    if (!this.pharmacologicalClasses) {
      return;
    }
    // get the search keyword
    let search = this.pharmacologicalClassFilterCtrl.value;
    if (!search) {
      this.filteredPharmacologicals.next(this.pharmacologicalClasses.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredPharmacologicals.next(
      this.pharmacologicalClasses.filter(item => item.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
