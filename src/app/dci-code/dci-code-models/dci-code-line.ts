import { Dci } from './../../dci/dci-models/dci';
import { Dosage } from 'src/app/dosage/models/dosage';

export class DciCodeLine {
    public id : string;
    public dosage: Dosage [] = [] ;
    public inn : Dci [] = [];
    public dosageId : string;
    public innId : string;
}