import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Item } from '../Model/Item';

@Injectable()
export class ItemServices{
  private baseUrl: string = 'http://kinglistapis.azurewebsites.net/api/ItemsAPIs';

  constructor(private http : Http){
  }

//GET BY LIST ID
  getItemsOfList(listID:number): Observable<Item[]>{
      let items$ = this.http
        .get(`${this.baseUrl}/ListID/` + listID, {headers: this.getHeaders()})
        .map(mapItems)
        .catch(handleError);
        return items$;
    }

//POST
    createItem(item:Item) : Observable<Response>{
      return this.http.post(`${this.baseUrl}`, toJSON(item), {headers: this.getHeadersPOST()});
    }

//PUT
    updateItem(item: Item) : Observable<Response>{
      return this.http.put(`${this.baseUrl}/${item.itemID}`, toJSON(item), {headers: this.getHeadersPOST()});
    }

//DELETE
    deleteItem(itemID: number) : Observable<Response>{
      return this.http.delete(`${this.baseUrl}/${itemID}`, {headers: this.getHeaders()});
    }

//HEADERS
    private getHeaders(){
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      return headers;
    }

    private getHeadersPOST()
    {
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Content-Type', 'application/json');
      return headers;
    }
}

//MAP
function mapItems(response:Response): Item[]{
   return response.json().map(toItem);
}

function mapItem(response:Response): Item{
  return toItem(response.json());
}

function toItem(r:any): Item{
  let item = <Item>({
    itemID: r.itemID,
    listID: r.listID,
    title: r.title,
    releaseDate_Cinema: r.releaseDate_Cinema,
    releaseDate_DVD: r.releaseDate_DVD,
    producer: r.producer,
    isChecked: r.isChecked,
    isFavorite: r.isFavorite,
    isDeleted: r.isDeleted,
    creationDate: r.creationDate,
    deletionDate: r.deletionDate
  });
  return item;
}

function toJSON(item:Item): string{
  return JSON.stringify({
    "itemID": item.itemID,
    "listID": item.listID,
    "title": item.title,
    "releaseDate_Cinema": item.releaseDate_Cinema,
    "releaseDate_DVD": item.releaseDate_DVD,
    "producer": item.producer,
    "creationDate": item.creationDate,
    "deletionDate": item.deletionDate,
    "isDeleted": item.isDeleted,
    "isChecked": item.isChecked,
    "isFavorite": item.isFavorite,
  });
}

//ERROR
function handleError (error: any) {
  let errorMsg = error.message || `Problèmes avec le service Web des items`
  console.error(errorMsg);
  return Observable.throw(errorMsg);
}
