import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';

import { AccService } from '../services/acc.service';
import { TokenStorageService } from '../services/token.storage.service';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
@Component({
  selector: 'app-artistsearch',
  templateUrl: './artistsearch.component.html',
  styleUrls: ['./artistsearch.component.less']
})
export class ArtistsearchComponent implements OnInit {

  constructor(
    private tokenService:TokenStorageService,
    private router: Router,
    private accountService:AccService
  ) { }
  maxHeight=0;
  page=12;
  offset=0;
  timer=true;
  searchKey='';
  next=false;
  data:any=[];
  searchBox:any;
  ngOnInit(): void {
    
    if(this.tokenService.loadToken()!=null){
      Notiflix.Loading.init({svgColor:"#32aec6",fontFamily:"roboto",});
      this.maxHeight= document.body.offsetHeight-60;
      let result=this.tokenService.getArtistInfo();
      if(result!=null){
          this.data=result.searchResult;
          this.offset=result.offset;
          this.page= result.page;
          this.searchKey=result.searchKey;
          this.next=true;
          this.tokenService.removeArtistsInfo();
          this.tokenService.removeArtist();
      }
    }
    else{
      this.tokenService.deleteAll();
      this.router.navigate(['/login']);
    }
    let searchBox = document.getElementById('search');
    let keyup$ :any;
    if(searchBox!=null){
      keyup$= fromEvent(searchBox, 'keyup');
      keyup$
      .pipe(
        map((i: any) => i.currentTarget.value),
        debounceTime(1000)
      )
      .subscribe((d:any)=>{
        console.log(d);
        this.search(d);
      });
    
      }
    }
 

  search(event:any){
    
    this.offset=0;
    if(event.target==undefined){
      this.searchKey=event;
    }
    else{
      this.searchKey=event.target.value;
    }
 
    if(this.searchKey.length>=3){
      this.tokenService.removeArtistsInfo();
      let main=this;
      Notiflix.Loading.standard("Loading...");
      // if(this.timer==true){
        // setTimeout(function () {
         
          main.timer=true;
          main.accountService.getArtists(  main.searchKey,'artist',main.page,main.offset).subscribe(d=>{
            Notiflix.Loading.remove();
            if(d.artists.items.length>0){
              main.timer=false;
              main.data=[];
              main.data=d.artists.items; 
              main.next=true;
            }
            else{
              main.next=false;
            }
     
          },(error)=>{
            Notiflix.Loading.remove();
            if(error.error.error.message.includes('token')){
              main.tokenService.deleteAll();
              main.router.navigate(['/login']);
            } 
          })
        // }, 1000);
      }
    else{
      this.data=[];
    }
  }
  getPaginationInfo(event:any) {
    if (
    (event.target.scrollTop + event.target.clientHeight >=
      event.target.scrollHeight)  && this.next==true 
    ){

      Notiflix.Loading.standard("Loading...");
      this.offset+=this.page;
      this.accountService.getArtists( this.searchKey,'artist',this.page,this.offset).subscribe(d=>{
        Notiflix.Loading.remove();
        if(d.artists.items.length==0)
        {
          this.next=false;
        }
        else{
          d.artists.items.forEach((element:any)=>{
            this.data.push(element);
          })
        }
    

      },(error)=>{
        this.offset-=this.page;
        Notiflix.Loading.remove();
        if(error.error.error.message.includes('token')){
          this.tokenService.deleteAll();
          this.router.navigate(['/login']);
        } 
      }
      )
    }
   
  }
  toAlbums(detail:any){
    let infos={
      searchResult:this.data,
      offset: this.offset,
      page:this.page,
      searchKey:this.searchKey
    }
    // this.accountService.changeMessage(detail);
    this.tokenService.saveArtist(detail);
    this.tokenService.saveArtistInfo(infos);
    this.router.navigate(['/albums',detail.name]);

  }

}
