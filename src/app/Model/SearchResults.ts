
export interface SearchResultModel {
    Id: number;
    Title: string;
    Video: Boolean;
    Type: string;
    ReleaseDate: Date;
    Popularity: number;
}

export class MovieResultModel{
  Title:string;
  ReleaseDate_Cinema:Date;
  ReleaseDate_DVD:Date;
  Producer:string;
}
