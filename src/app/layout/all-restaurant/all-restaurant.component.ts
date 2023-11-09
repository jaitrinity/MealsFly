import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Constant } from 'src/app/constant/Constant';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { CommonFunction } from 'src/app/shared/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-all-restaurant',
  templateUrl: './all-restaurant.component.html',
  styleUrls: ['./all-restaurant.component.scss']
})
export class AllRestaurantComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  restList:any = [];
  searchRestList:any = [];
  constructor(private sharedService: SharedService, 
    private layout: LayoutComponent,
    private router: Router, 
    private _title: Title,
    ){
    _title.setTitle("MealsFly | Restaurants")
    $(document).ready(function(){
      $('.turn').on('click', function(){
        var angle = ($('.viewImg').data('angle') + 90) || 90;
        $('.viewImg').css({'transform': 'rotate(' + angle + 'deg)'});
        $('.viewImg').data('angle', angle);
      });
    })
  }

  ngOnInit(): void {
    this.getRestList();
  }

  getRestList(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType:"restaurant"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restList = result;
        this.searchRestList = this.restList;
        this.layout.spinnerHide();

        this.myPagination.itemCount = this.searchRestList.length;
        this.myPagination.createPagination();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurant"))
      }
    })
  }

  public isTrue(value:any) :boolean{
    if(value != null && value != ''){
      return true;
    }
    return false
  }

  viewImgUrl: any = ""
  viewImage(imgUrl:any){
    this.viewImgUrl = imgUrl;
    this.openAnyModal('imageModal');
  }

  getRestItem(restObj:any){
    let restId = restObj.restId; 
    this.router.navigate(['/layout/rest-menu/'+restId]);
  }

  dis(type:any,restId:any,oldPriority:any){
    if(type == 0){
      $("#label-"+restId).hide();
      $("#text-"+restId).show();
      $("#new-"+restId).val(oldPriority);
    }
    else if(type == 1){
      let newPriority = $("#new-"+restId).val();
      let searchData = this.searchRestList.filter((x: { displayOrder: any; }) => x.displayOrder == newPriority);
      
      if(oldPriority == newPriority){
        this.layout.warningSnackBar("old and new priority should be different");
      }
      else if(searchData.length !=0){
        this.layout.warningSnackBar(newPriority+" priority already available to other restaurant");
      }
      else{
        this.changeRestPriority(restId,newPriority);
      }
      
    }
    else if(type == 2){
      $("#text-"+restId).hide();
      $("#label-"+restId).show();
    }
  }
  changeRestPriority(restId:any,newPriority:any){
    let jsonData = {
      updateType:'updateRestPriority',
      restId:restId,
      priority: newPriority
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.layout.successSnackBar(result.message)
          this.getRestList();
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("updateRestPeriority"))
      }
    })
    // console.log(jsonData)
  }

  searchRestId: any="";
  searchRestName: any="";
  searchRestMobile: any="";
  searchRestPriority: any="";
  searchRestApprove: any="";
  searchRestEnable: any="";
  searchRestaurant(evt:any){
    if(this.searchRestId.trim() == "" && this.searchRestName.trim() == "" && this.searchRestMobile.trim() == "" && 
    this.searchRestPriority.trim() == "" && this.searchRestApprove.trim() == "" && this.searchRestEnable.trim() == ""){
      this.searchRestList = this.restList;
    }
    else{
      if(this.searchRestId.trim() != ""){
        let searchData = this.searchRestList.filter((x: { restId: any; }) => x.restId.includes(this.searchRestId));
        this.searchRestList = searchData;
      }
      if(this.searchRestName.trim() != ""){
        let searchData = this.searchRestList.filter((x: { name: any; }) => x.name.toLowerCase().includes(this.searchRestName.toLowerCase()));
        this.searchRestList = searchData;
      }
      if(this.searchRestMobile.trim() != ""){
        let searchData = this.searchRestList.filter((x: { mobile: any; }) => x.mobile.toLowerCase().includes(this.searchRestMobile.toLowerCase()));
        this.searchRestList = searchData;
      }
      if(this.searchRestPriority.trim() != ""){
        let searchData = this.searchRestList.filter((x: { displayOrder: any; }) => x.displayOrder.includes(this.searchRestPriority));
        this.searchRestList = searchData;
      }
      if(this.searchRestApprove.trim() != ""){
        let searchData = this.searchRestList.filter((x: { approveTxt: any; }) => x.approveTxt.toLowerCase().includes(this.searchRestApprove.toLowerCase()));
        this.searchRestList = searchData;
      }
      if(this.searchRestEnable.trim() != ""){
        let searchData = this.searchRestList.filter((x: { enableTxt: any; }) => x.enableTxt.toLowerCase().includes(this.searchRestEnable.toLowerCase()));
        this.searchRestList = searchData;
      }
    }
    this.myPagination.itemCount = this.searchRestList.length;
    this.myPagination.createPagination();
  }

  exportRestaurant(){
    if(this.searchRestList.length != 0 ){
      let columnKeyArr:any = ["displayOrder","name","mobile","enableTxt"];
      let columnTitleArr:any = ["Priority","Name","Mobile","Enable"];
      CommonFunction.downloadFile(this.searchRestList,
        'Restaurant.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

  openAnyModal(modalId:any){
    // $("#"+modalId).modal({
    //   backdrop : 'static',
    //   keyboard : false
    // });
    $("#"+modalId).modal("show");
  }

  closeAnyModal(modalId:any){
    $("#"+modalId).modal("hide");
  }

}
