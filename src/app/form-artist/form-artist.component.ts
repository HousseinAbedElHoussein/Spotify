import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-artist',
  templateUrl: './form-artist.component.html',
  styleUrls: ['./form-artist.component.less']
})
export class FormArtistComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }
@Input() detail:any;
followerString='followers';
@Output() toalbums=new EventEmitter<any>();
  ngOnInit(): void {
    if(this.detail!=null){
        if(this.detail.followers.total==1){
              this.followerString="follower";
        }
    }
  }
  toAlbums(){
    if(this.detail!=null){
      this.toalbums.emit(this.detail);
      // this.router.navigate(['/albums', this.detail.name]);
    }
  }
}
