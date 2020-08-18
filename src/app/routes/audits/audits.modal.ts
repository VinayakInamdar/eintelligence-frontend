import { Interface } from "readline";

export interface IAudits {
    id:number;
    website: string;
    grade: string;
    date_created:string;    
    sent:boolean;
}