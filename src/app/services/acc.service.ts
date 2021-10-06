import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token.storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccService {

  constructor(
    private http: HttpClient,
    private tokenService:TokenStorageService
    ) {

  }
  public sendDetail: any = [];
  private messageSource = new BehaviorSubject(this.sendDetail);
  currentMessage = this.messageSource.asObservable();


  changeMessage(message: any) {
    // this.messageSource=new BehaviorSubject(this.editDataDetails);
    this.messageSource.next(message);
  }
  getArtists(key:any,type:any,page:any,offset:any){
    return this.http.get<any>(
      environment.spotify +
        '/search?query='+key +"&type="+type+"&offset="+offset+"&limit="+page,
        { headers: {
          Authorization: `Bearer ${this.tokenService.loadToken()}`
      }}
    );
  }
  getAlbums(artistId:any,page:any,offset:any){
    return this.http.get<any>(
      environment.spotify +
        '/artists/'+artistId+'/albums?limit='+page+'&offset='+offset,
        { headers: {
          Authorization: `Bearer ${this.tokenService.loadToken()}`
      }}
    );
  }
  getArtistById(artistId:any){
    return this.http.get<any>(
      environment.spotify +
        '/artists/'+artistId,
        { headers: {
          Authorization: `Bearer ${this.tokenService.loadToken()}`
      }}
    );
  }

}
