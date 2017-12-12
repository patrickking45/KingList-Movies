import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SearchResultModel, MovieResultModel} from '../Model/SearchResults';

@Injectable()
export class MoviesServices{
  private baseUrl: string = 'https://api.themoviedb.org/3/';
  private authKey: string = "2d44d46e717253582ca52ef982239536";

  private pageCompteur: number = 1;

  constructor(private http : Http){
  }

//GET SEARCH
  getMovieFromSearchQuery(query:string): Observable<SearchResultModel[]>{
    let lists$ = this.http
      .get(`${this.baseUrl}search/multi?api_key=${this.authKey}&query=${query}&page=${this.pageCompteur}`, {headers: this.getHeaders()})
      .map(mapSearchResult)
      .catch(handleError);
      return lists$;
  }

//GET MOVIE BY ID
  getMovie(id:number): Observable<MovieResultModel>{
    let lists$ = this.http
      .get(`${this.baseUrl}movie/${id}?api_key=${this.authKey}`, {headers: this.getHeaders()})
      .map(mapMovie)
      .catch(handleError);
      return lists$;
  }

//HEADERS
  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

  private getHeadersPOST(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    return headers;
  }
}

//MAP
function mapSearchResult(response:Response): SearchResultModel[]{
   return response.json().results.map(toSearchResult);
}

function mapMovie(response:Response): MovieResultModel{
  return toMovieResult(response.json());
}

function toSearchResult(r:any): SearchResultModel{
  let list = <SearchResultModel>({
    Id: r.id,
    Title: r.title,
    Video: r.video,
    Type: r.media_type,
    Popularity: r.popularity
  });

  if(list.Type == "tv"){
    list.Title = r.name;
    if(r.first_air_date != ""){
      list.ReleaseDate = new Date(r.first_air_date);
    }
  }
  else{
    if(r.release_date != ""){
      list.ReleaseDate = new Date(r.release_date);
    }
  }

  if(list.ReleaseDate == null){
    list.ReleaseDate = new Date("0001-01-01");
  }

  return list;
}

function toMovieResult(r:any): MovieResultModel{
  let movie = <MovieResultModel>({
    Title: r.title
  });

  if(r.release_date != "" && r.release_date != null){
    movie.ReleaseDate_Cinema = new Date(r.release_date);
  }
  else{
    movie.ReleaseDate_Cinema = new Date("0001-01-01");
  }

  movie.Producer = "";
  movie.ReleaseDate_DVD = new Date("0001-01-01");

  return movie;
}

//ERROR
function handleError (error: any) {
  let errorMsg = error.message || `Problèmes avec les services de MovieDB`
  console.error(errorMsg);
  return Observable.throw(errorMsg);
}
