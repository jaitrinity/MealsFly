import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/SharedService';
import { take } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  loginEmpRoleId: any = "";
  menuList: any = [];
  restMenuList: any = [];
  constructor(private sharedService: SharedService){
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
  }
  ngOnInit(): void {
    this.getMenuList();
    // this.getRestMenuList();
  }

  getMenuList(){
    let jsonData = {
      searchType: "menuList",
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.menuList = result;
      },
      error: _=>{
        alert("Something wrong in menuList service")
      }
    })
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
