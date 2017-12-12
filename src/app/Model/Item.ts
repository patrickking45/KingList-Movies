
export class Item{
  itemID:number;
  listID:number;
  title:string;
  releaseDate_Cinema:Date;
  releaseDate_DVD:Date;
  producer:string;
  isChecked:boolean;
  isFavorite:boolean;
  isDeleted:boolean;
  creationDate:Date;
  deletionDate:Date;

  constructor(_itemID?:number, _listID?:number, _title?:string, _releaseDate_Cinema?:Date, _releaseDate_DVD?:Date, _producer?:string, _isChecked?:boolean, _isFavorite?:boolean, _isDeleted?:boolean, _creationDate?:Date, _deletionDate?:Date){
    this.itemID = _itemID;
    this.listID = _listID;
    this.title = _title;
    this.releaseDate_Cinema = _releaseDate_Cinema;
    this.releaseDate_DVD = _releaseDate_DVD;
    this.producer = _producer;
    this.isChecked = _isChecked;
    this.isFavorite = _isFavorite;
    this.isDeleted = _isDeleted;
    this.creationDate = _creationDate;
    this.deletionDate = _deletionDate;
  }

}
