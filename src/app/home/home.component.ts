import {Component} from '@angular/core';
import {ListServices} from '../Services/list.services'
import {ItemServices} from '../Services/item.services'
import {UserServices} from '../Services/user.services'
import {AuthServices} from '../Services/auth.services'
import {MoviesServices} from '../Services/movies.services'
import {List} from '../Model/List';
import {Item} from '../Model/Item';
import {SearchResultModel, MovieResultModel} from '../Model/SearchResults';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import CustomValidators from '../forms/CustomValidators';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
  providers:[
    ListServices,
    UserServices,
    AuthServices,
    ItemServices,
    MoviesServices
  ]
})
export class HomeComponent {
  userLists:List[];
  listItems:Item[];
  searchMovies:SearchResultModel[];

  selectedList:List;

  isLoading: boolean = true;
  errorMessage: string = '';

  listForm:FormGroup;
  itemForm:FormGroup;

  newList:List;
  isAddingList:Boolean = false;

  newItem:Item;
  newMovie:MovieResultModel;
  isAddingItem:Boolean = false;
  isSearchingItem:Boolean = false;

  constructor(private listServices:ListServices, private itemServices:ItemServices, private userServices:UserServices, private authServices:AuthServices, private moviesServices:MoviesServices){
    this.userLists = new Array();
    this.searchMovies = new Array();
  }

  ngOnInit(){
    if(this.authServices.isAuthenticated()){
      this.getListsOfAuthUser();
    }

    this.listForm = new FormGroup({
      title: new FormControl('', Validators.required)
    });

    this.itemForm = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  getListsOfAuthUser(){
    this.listServices
      .getListsByUserId(this.authServices.getUser().userID)
      .subscribe(
         /* happy path */  p=> this.userLists = p,
         /* error path */ e => this.errorMessage = e,
         /* onComplete */ () => this.loadItems());
  }

  loadItems(){
    for(let list of this.userLists){
      this.itemServices
        .getItemsOfList(list.listID)
        .subscribe(
           /* happy path */  p=> list.listItems = p.sort(function(x, y) {return (x.isFavorite === y.isFavorite)? 0 : x.isFavorite? -1 : 1;}),
           /* error path */ e => this.errorMessage = e,
           /* onComplete */ () => this.isLoading = true);
    }
  }

  refreshItem(){
    this.itemServices
      .getItemsOfList(this.selectedList.listID)
      .subscribe(
         /* happy path */  p => this.listItems = p.sort(function(x, y) {return (x.isFavorite === y.isFavorite)? 0 : x.isFavorite? -1 : 1;}),
         /* error path */ e => this.errorMessage = e,
         /* onComplete */ () => this.selectedList.listItems = this.listItems);
  }

  setItems(list:List){
    this.selectedList = list;
    this.listItems = list.listItems;
  }

//LIST
  addList(){
    this.isAddingList = true;
    this.newList = new List();
  }

  cancelAddList(){
    this.isAddingList = false;
  }

  submitListForm(){
    this.newList.userID = this.authServices.getUser().userID;
    this.newList.isDeleted = false;
    this.newList.creationDate = new Date(Date.now());
    this.newList.deletionDate = null;

    this.createList(this.newList);
    this.isAddingList = false;
  }

  createList(list:List){
    this.listServices
      .createList(list)
      .subscribe(() => this.getListsOfAuthUser());
  }

  deleteList(list:List){
      if(confirm("Voulez-vous supprimer la liste : "+list.title+" ?")){
          if(this.selectedList!= null && list.listID == this.selectedList.listID){
            this.selectedList = null;
          }

          list.isDeleted = true;
          list.deletionDate = new Date(Date.now());

          this.listServices
            .updateList(list)
            .subscribe();

          this.userLists.splice(this.userLists.indexOf(list,0), 1);
      }
    }

//ITEM
  addItem(){
    this.isAddingItem = true;
    this.newItem = new Item();
  }

  cancelAddItem(){
    this.isAddingItem = false;
    this.searchMovies = new Array();
  }

  submitItem(movie:SearchResultModel){
    this.moviesServices
      .getMovie(movie.Id)
      .subscribe( p => this.newMovie = p,
                  e => this.errorMessage = e,
                  ()=> this.createItemFromAPI()
                );
  }

  createItemFromAPI(){
        this.newItem.title = this.newMovie.Title;
        this.newItem.releaseDate_Cinema = this.newMovie.ReleaseDate_Cinema;

        this.newItem.listID = this.selectedList.listID;
        this.newItem.isChecked = false;
        this.newItem.isDeleted = false;
        this.newItem.isFavorite = false;
        this.newItem.creationDate = new Date(Date.now());
        this.newItem.deletionDate = null;

        this.createItem(this.newItem);
  }

  submitItemForm(){
    this.newItem.listID = this.selectedList.listID;
    this.newItem.isChecked = false;
    this.newItem.isDeleted = false;
    this.newItem.isFavorite = false;
    this.newItem.creationDate = new Date(Date.now());
    this.newItem.deletionDate = null;
    this.newItem.producer = null;
    this.newItem.releaseDate_Cinema = null;
    this.newItem.releaseDate_DVD = null;

    this.createItem(this.newItem);
  }

  checkItem(item:Item){
    item.isChecked = !item.isChecked;
    this.updateItem(item);
  }

  favItem(item:Item){
    item.isFavorite = !item.isFavorite;
    this.updateItem(item);
  }

  searchItem(query:string){
    this.isSearchingItem = true;
    this.newMovie = new MovieResultModel();
    this.moviesServices
      .getMovieFromSearchQuery(query)
      .subscribe( p => this.searchMovies = p,
                  e => this.errorMessage = e,
                  ()=> this.cleanSearchList()
                );
  }

  cleanSearchList(){
    if(this.searchMovies.length > 2){
      this.searchMovies = this.searchMovies.filter(m=> m.Video == false || m.Video == null).filter(m => m.ReleaseDate != null).filter(m=> m.Popularity >= 5 || m.ReleaseDate.getTime() > Date.now()).sort(function(x, y){return y.Popularity - x.Popularity});
    }
  }

  createItem(item:Item){
    this.isAddingItem = false;
    this.isSearchingItem = false;
    this.searchMovies = new Array();

      this.itemServices
        .createItem(item)
        .subscribe(()=>this.refreshItem());
  }

  updateItem(item:Item){
    this.itemServices
      .updateItem(item)
      .subscribe(()=>this.refreshItem());
  }

  deleteItem(item:Item){
      if(confirm("Voulez-vous supprimer l'item : "+item.title+" ?")){
        item.isDeleted = true;
        item.deletionDate = new Date(Date.now());

        this.itemServices
          .updateItem(item)
          .subscribe();

        this.listItems.splice(this.listItems.indexOf(item,0), 1);
      }
    }
}
