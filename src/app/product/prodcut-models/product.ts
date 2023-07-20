import { ɵclearOverrides } from "@angular/core";

export class Product {
    public code?: any;
    public fullName: string;
    public description?: string;
    public registrationNumber?: string;
    public publicPrice: number;
    public referencePrice: number;
    public imported: boolean = false;
    public refundable: boolean = false;
    public psychotropic: boolean = false;
    public thermolabile: boolean;
    public removed: boolean = false;
    public forHospital : boolean = false;
    public packagingContent?: string;
    public packagingContentUnit?: string;
    public productClassId: string;
    public therapeuticClassId?: string;
    public pharmacologicalClassId?: string;
    public innCodeId?: string;
    public innCodeName: string;
    public taxGroupId: string;
    public tax: number;
    public brandId: string;
    public manufacturerId: string;
    public pickingZoneId : string;
    public defaultLocation : string;
    public id: string;
    public dciConcat : string="";
    public dosageConcat : string="";
    public packaging : number ;
    public listId? : string;
    public formId : string;
    public princeps : boolean;
    public manufacturerName: string;
    public productClassName : string;
    public productState : string;
    public purchasePrice : number;
    public salePrice : number;
    public packagingId? : string ;
    public externalCode?  : string; 
    public shp : number;
    public height :  number;
    public width :  number;
    public length :  number;
    public state : number;
    public quota : number;
    public hasQuota : boolean;
    quantity: number;
    totalQnt : number;
    totalRQ : number

    
} 