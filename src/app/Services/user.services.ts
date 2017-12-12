import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { User } from '../Model/User';

@Injectable()
export class UserServices{
  private baseUrl: string = 'http://kinglistapis.azurewebsites.net/api';

  constructor(private http : Http){
  }

//GET ALL
  getAllUsers(): Observable<User[]>{
      let users$ = this.http
        .get(`${this.baseUrl}/UsersAPIs`, {headers: this.getHeaders()})
        .map(mapUsers)
        .catch(handleError);
        return users$;
    }

//GET BY USER LOGIN
    getUsersByUserLogin(userLogin: string): Observable<User[]>{
        let users$ = this.http
          .get(`${this.baseUrl}/UsersAPIs/`+userLogin, {headers: this.getHeaders()})
          .map(mapUsers)
          .catch(handleError);
          return users$;
      }

//POST
      createUser(user: User) : Observable<Response>{
          return this.http.post(`${this.baseUrl}/UsersAPIs/`, JSON.stringify(user), {headers: this.getHeadersPOST()});
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
function mapUsers(response:Response): User[]{
   return response.json().map(toUser);
}

function mapUser(response:Response): User{
  return toUser(response.json());
}

function toUser(r:any): User{
  let user = <User>({
    userID: r.userID,
    login: r.login,
    password: r.password,
    role: r.role
  });
  return user;
}

//ERROR
function handleError (error: any) {
  let errorMsg = error.message || `Problèmes avec le service Web de l'utilisateur`
  console.error(errorMsg);
  return Observable.throw(errorMsg);
}
