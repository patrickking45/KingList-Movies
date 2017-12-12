import {Item} from './Item';

export class List{
  listID:number;
  userID:number;
  title:string;
  listItems:Item[];
  creationDate:Date;
  isDeleted:boolean;
  deletionDate:Date;

  constructor(_listID?:number,_listItems?:Item[], _userID?:number, _title?:string, _creationDate?:Date, _isDeleted?:boolean, _deletionDate?:Date){
    if(_listID){
      this.listID = _listID;
    }
    else{
      this.listID = 0;
    }
    this.userID = _userID;
    this.listItems = _listItems;
    this.title = _title;
    this.creationDate = _creationDate;
    this.isDeleted = _isDeleted;
    this.deletionDate = _deletionDate;
  }
};
