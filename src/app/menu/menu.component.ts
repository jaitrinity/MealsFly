import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/SharedService';
import { take } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  restMenuList: any = [];
  constructor(private sharedService: SharedService){

  }
  ngOnInit(): void {
    // this.getRestMenuList();
  }

  getRestMenuList(){
    let jsonData = {
      searchType: "restaurantMenu",
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restMenuList = result;
      },
      error: _=>{
        alert("Something wrong in restaurantMenu service")
      }
    })
  }


}
