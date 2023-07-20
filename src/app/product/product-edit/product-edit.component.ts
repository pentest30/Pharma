import { DciCode } from './../../dci-code/dci-code-models/dci-code';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navigation, Router } from '@angular/router';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Product } from '../prodcut-models/product';
import { BrandAddComponent } from 'src/app/brand/brand-add/brand-add.component';
import { ManufacturerService } from 'src/app/services/manufacturer.service';
import { TaxGroupService } from 'src/app/services/tax-group.service';
import { ProductClassService } from 'src/app/product-class/product-class-list/product-class.service';
import { DciCodeService } from 'src/app/services/dci-code.service';
import { FormService } from 'src/app/services/form.service';
import { PackagingService } from 'src/app/services/packaging.service';
import { ListService } from 'src/app/services/list.service';
import { BrandService } from 'src/app/services/brand.service';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DciCodeAddComponent } from 'src/app/dci-code/dci-code-add/dci-code-add.component';
import { ProductClassAddComponent } from 'src/app/product-class/product-class-add/product-class-add.component';
import { FormAddComponent } from 'src/app/form/form-add/form-add.component';
import { PackagingAddComponent } from 'src/app/packaging/packaging-add/packaging-add.component';
import { PickingZoneAddComponent } from 'src/app/picking-zone/picking-zone-add/picking-zone-add.component';
import { ListsAddComponent } from 'src/app/lists/lists-add/lists-add.component';
import { Manufacturer } from 'src/app/manufacturer/models/manufacturer-model';
import { Brand } from 'src/app/brand/models/brand-model';
import { TaxGroup } from 'src/app/tax-group/models/tax-group';
import { ProductClass } from 'src/app/product-class/models/product-class-model';
import { Packaging } from 'src/app/packaging/models/packaging';
import { PickingZone } from 'src/app/picking-zone/models/picking-zeone';
import { Lists } from 'src/app/lists/models/list-model';
import { Form } from 'src/app/form/models/form-model';
import { TherapeuticClassService } from 'src/app/services/therapeutic-class-service';
import { PharmacologicalService } from 'src/app/services/pharmacological-class.service';
import { ITherapeuticClass } from 'src/app/services/interfaces/therapeutic-class';
import { Pharmacological } from 'src/app/pharmacological-class/models/pharmacological-model';
import { TherapeuticClassAddComponent } from 'src/app/therapeutic-class/therapeutic-class-add/therapeutic-class-add.component';
import { PharmacologicalClassAddComponent } from 'src/app/pharmacological-class/pharmacological-class-add/pharmacological-class-add.component';
import { ActionsPermissions } from '../prodcut-models/product.permission';
import { PermissionService } from 'src/app/services/permission.service';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import * as Editor from '@ckeditor/ckeditor5-build-classic'

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.sass']
})
export class ProductEditComponent implements OnInit {
  public manufacturers: Manufacturer[];
  public brands: Brand[];
  public taxGroups: TaxGroup[];
  public productClasses: ProductClass[];
  public dciCodes: DciCode[];
  color = 'primary';
  mode = 'determinate';
  value = 0;
  public packagings: Packaging[];
  public pickingZones: PickingZone[];
  public lists: Lists[];
  public isDrug: boolean = false;
  public code?: any;
  public fullName: string = "";
  public description?: string = "";
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
  public productClassId: string;
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
  public externalCode? : string;
  private product: Product;
  state$: any;
  navigation: Navigation;
  public isLoading: boolean = false;
  public therapeuticCalsses: ITherapeuticClass[];
  public pharmacologicalClasses: Pharmacological[];
  public width: number;
  public height: number;
  public length: number;
  public productState: number;
  hasQuota : boolean  = false;

  perm : ActionsPermissions;
  public Editor = Editor;

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
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private route: Router,
    private dialog: MatDialog, 
    private permissionService :PermissionService) {
    this.navigation = route.getCurrentNavigation();
  }
  addCodeDci() {
    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(DciCodeAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadDciCodes();
    });
  }
  addClass() {
    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(ProductClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadProductClasses();
    });
  }
  private initModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    return dialogConfig;
  }

  addForm() {

    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(FormAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadFroms();
    });
  }
  addPackaging() {

    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(PackagingAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadPackaging();
    });
  }
  addPikingZone() {
    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(PickingZoneAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadPickingZones();
    });
  }
  addtherapeuticCalsse() {
    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(TherapeuticClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadThearapeuticClasses();
    });
  }
  addPharmacologicalClasses() {
    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(PharmacologicalClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadPharmacologicalClasses();
    });
  }
  addList() {

    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(ListsAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadLists();
    });
  }
  addBrand() {

    const dialogConfig = this.initModal();
    const modalRef = this.dialog.open(BrandAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      this.loadBrands();
    });
  }

  onSelectProductClass($evt) {
    var item = this.productClasses.filter(f => f.id == $evt)[0];
    this.isDrug = (item)? item.isMedicamentClass : false;
  }
  onSelectList($evt) {

    var item = this.lists.filter(f => f.id == $evt)[0];
    this.shp = item.shp;
  }
  ngOnInit(): void {
    this.perm = this.permissionService.getCatalogModulePermissions();
    this.isLoading = true;
    this.createForm();
    this.value = 25;
    try {
      var p = this.navigation.extras.state.product as Product;
      this.value = 50;
      this.service.getById(p).subscribe(resp => {
        this.product = resp as Product;
        this.initForm();
     

      });
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }

  }
 
  private async initForm() {
    this.manufacturers = await this.manufacturerService.getAll().toPromise();
    this.taxGroups = await this.taxService.getAll().toPromise();
    this.forms = await this.loadFroms();
    this.packagings = await this.loadPackaging();
    this.lists = await this.loadLists();
    this.brands = await this.loadBrands();
    this.pickingZones = await this.loadPickingZones();
    this.pharmacologicalClasses = await this.loadPharmacologicalClasses();
    this.therapeuticCalsses = await this.loadThearapeuticClasses();
    this.productClasses = await this.productClassService.getAllProductClasses().toPromise();
    this.dciCodes = await this.loadDciCodes();
    var dciCode = this.dciCodes != undefined ? this.dciCodes.filter(f => f.id == this.product.innCodeId)[0] : new DciCode;
    var item = this.productClasses.filter(f => f.id == this.product.productClassId)[0];
    this.value = 95;
    this.form.patchValue({
      id: this.product.id,
      code: this.product.code,
      fullName: this.product.fullName,
      description: this.product.description,
      imported: this.product.imported,
      innCodeId: this.product.innCodeId,
      listId: this.product.listId,
      manufacturerId: this.product.manufacturerId,
      formId: dciCode != undefined ? dciCode.formId : null,
      forHospital: this.product.forHospital,
      packaging: this.product.packaging,
      productClassId: this.product.productClassId,
      princeps: this.product.princeps,
      taxGroupId: this.product.taxGroupId,
      brandId: this.product.brandId,
      removed: this.product.removed,
      refundable: this.product.refundable,
      registrationNumber: this.product.registrationNumber,
      salePrice: this.product.salePrice,
      purchasePrice: this.product.purchasePrice,
      packagingContent: this.product.packagingContent,
      packagingId: this.product.packagingId,
      pickingZoneId: this.product.pickingZoneId,
      defaultLocation: this.product.defaultLocation,
      therapeuticClassId: this.product.therapeuticClassId,
      pharmacologicalClassId: this.product.pharmacologicalClassId,
      shp: this.product.shp,
      externalCode : this.externalCode,
      width: this.width,
      height: this.height,
      length: this.length,
      productState: this.product.productState
      ,hasQuota : this.product.hasQuota, 
      referencePrice : this.product.referencePrice,
      publicPrice : this.product.publicPrice
    });
    this.isDrug = (item)? item.isMedicamentClass : false;
    if (dciCode !=undefined &&dciCode.innCodeDosages != undefined) {
      this.concatDci(dciCode);
      this.concatDosage(dciCode);
    }
    this.isLoading = false;
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
          this.updateProduct();
    
       });
    }
  
    else{
        if (this.form.invalid)
        return;
      this.updateProduct();
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
        this.updateProduct();
  
     });
  }
  else
  {
      if (this.form.invalid)
      return;
    this.updateProduct();
  }
  }
}
  private updateProduct() {
    var product = new Product();
    console.log(this.form.value);
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
      if (product.hasQuota == null)
      product.hasQuota = false;
    if (product.publicPrice == null)
      product.publicPrice = 0;
    if (product.referencePrice == null)
      product.referencePrice = 0;
    if (product.packaging == null)
      product.packaging = 0;
    if (product.salePrice == null) product.salePrice = 0;
    if (product.purchasePrice == null) product.purchasePrice = 0;
    if (product.width == null) product.width = 0;
    if (product.height == null) product.height = 0;
    if (product.length == null) product.length = 0;
    this.service.update(product).subscribe(msg => {
      this.notif.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.close();
    }, (error) => {
      this.notif.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  private loadThearapeuticClasses() {
    return this.therapeuticClassService.getAll().toPromise();
  }
  private loadPharmacologicalClasses() {
    return this.pharmacologicalService.getAll().toPromise()
  }
  onSelectDciCode($evt) {
    var item = this.dciCodes.filter(f => f.id == $evt)[0];
    this.formId = item.formId;
     this.form.patchValue({formId: item.formId});
    this.concatDci(item);
    if (this.isDrug)
      this.concatDosage(item);

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
    console.log(this.product);
    if(this.dciConcat=="")
      this.dciConcat = this.product.dciConcat;
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
    return this.dciCodeService.getAll().toPromise();
  }
  private loadProductClasses() {
    return this.productClassService.getAllProductClasses().toPromise();
  }
  private loadFroms() {
    return this.formService.getAll().toPromise();
  }
  private loadPackaging() {
    return this.packaginService.getAll().toPromise();
  }
  private loadLists() {
    return this.listSerivce.getAll().toPromise();
  }
  private loadBrands() {
    return this.brandService.getAll().toPromise();
  }
  private loadPickingZones() {
    return this.pickingZoneService.getAll().toPromise();
  }
  createForm() {

    this.form = this.fb.group({
      code: [this.code, [Validators.required]],
      fullName: [this.fullName, [Validators.required]],
      description:[this.description,[]],
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
      externalCode : [this.externalCode, []],
      width: [this.width, []],
      height: [this.height, []],
      length: [this.length, []],
      productState: [this.productState, []],
      hasQuota: [this.hasQuota, []],
    });
  }
  close() {
    this.route.navigate(["/product/product-list"]);
  }

}
