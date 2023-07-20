import { PickingZone } from "src/app/picking-zone/models/picking-zeone";

export class ZoneGroup  {
    id: string;
    name: string;
    order: string;
    description: string | null;
    pickingZones: PickingZone[];
}