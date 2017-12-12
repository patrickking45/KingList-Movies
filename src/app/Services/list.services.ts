import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { List } from '../Model/List';

@Injectable()
export class ListServices{
  private baseUrl: string = 'http://kinglistapis.azurewebsites.net/api/ListsAPIs';

  constructor(private http : Http){
  }

//GET ALL
  getAllLists(): Observable<List[]>{
    let lists$ = this.http
      .get(`${this.baseUrl}`, {headers: this.getHeaders()})
      .map(mapLists)
      .catch(handleError);
      return lists$;
  }

//GET BY USER ID
  getListsByUserId(userID: number): Observable<List[]>{
    let lists$ = this.http
      .get(`${this.baseUrl}/UserID/`+userID, {headers: this.getHeaders()})
      .map(mapLists)
      .catch(handleError);
      return lists$;
  }

//POST
  createList(list: List) : Observable<Response>{
    return this.http.post(`${this.baseUrl}`, toJSON(list), {headers: this.getHeadersPOST()});
  }

//PUT
  updateList(list: List) : Observable<Response>{
    return this.http.put(`${this.baseUrl}/${list.listID}`, toJSON(list), {headers: this.getHeadersPOST()});
  }

//DELETE
  deleteList(listID: number) : Observable<Response>{
    return this.http.delete(`${this.baseUrl}/${listID}`, {headers: this.getHeaders()});
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
function mapLists(response:Response): List[]{
   return response.json().map(toList);
}

function mapList(response:Response): List{
  return toList(response.json());
}

function toList(r:any): List{
  let list = <List>({
    listID: r.listID,
    userID: r.userID,
    title: r.title,
    creationDate: r.creationDate,
    isDeleted: r.isDeleted,
    deletionDate:r.deletionDate,
  });
  return list;
}

function toJSON(list:List): string{
  return JSON.stringify({
    "title": list.title,
    "creationDate": list.creationDate,
    "deletionDate": list.deletionDate,
    "isDeleted": list.isDeleted,
    "listID": list.listID,
    "userID": list.userID
});
}

//ERROR
function handleError (error: any) {
  let errorMsg = error.message || `Problèmes avec le service Web des listes`
  console.error(errorMsg);
  return Observable.throw(errorMsg);
}
