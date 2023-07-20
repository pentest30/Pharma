import { ZoneGroup } from "src/app/zone-group/models/ZoneGroup";

export class PickingZone {
    public id : string ;
    public name: string;
    public order: number;
    zoneGroupId: string;
    public zoneGroup: ZoneGroup;
    zoneType: number;

}
export enum ZoneType{
    
    Fridge = 10,
    Psychtropic = 20,
    Origin = 30,
    Normal = 40,
    ExpensiveSensitive = 50
}