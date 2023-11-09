import { Component, OnInit,ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { CommonFunction } from 'src/app/shared/CommonFunction';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { Constant } from 'src/app/constant/Constant';
declare var $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  filterStartDate: any = "";
  filterEndDate: any = ""
  orderList: any = [];
  searchOrderList: any = [];
  orderItemList: any = [];
  constructor(private sharedService: SharedService,private layout:LayoutComponent){
    layout.setPageTitle("Order");
  }
  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType: "orders",
      filterStartDate: this.filterStartDate,
      filterEndDate: this.filterEndDate
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.orderList = result;
        this.searchOrderList = this.orderList;
        this.layout.spinnerHide();
        this.myPagination.itemCount = this.searchOrderList.length;
        this.myPagination.createPagination();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("orders"))
      }
    })
  }

  viewOrderId: any;
  // viewTotalPrice:any;
  viewOrderObj:any = {};
  getOrderItem(orderObj:any){
    this.viewOrderObj = orderObj;
    this.viewOrderId = orderObj.orderId;
    // this.viewTotalPrice = orderObj.totalPrice;
    let jsonData = {
      searchType: "orderItem",
      orderId: this.viewOrderId
    }
    this.layout.spinnerShow();
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.orderItemList = result;
        this.layout.spinnerHide();
        this.openAnyModal("viewOrderModal");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("orderItem"))
      }
    })
  }

  refreshSearchFilter(){
    this.searchOrderId = "";
    this.searchRestaurant = "";
    this.searchCustomer = "";
    this.searchPaymentMode = "";
    this.searchInstruction = "";
    this.searchTotalPrice = "";
    this.searchStatus = "";
    this.searchDatatime = "";
    this.searchOrder("");
  }

  searchOrderId: any = "";
  searchRestaurant: any = "";
  searchCustomer: any = "";
  searchPaymentMode: any = "";
  searchInstruction: any = "";
  searchTotalPrice: any = "";
  searchStatus: any = "";
  searchDatatime: any = "";
  searchOrder(event:any){
    if(this.searchOrderId.trim() == "" && this.searchRestaurant.trim() == "" && this.searchCustomer.trim() == "" && 
    this.searchPaymentMode.trim() == "" && this.searchInstruction.trim() == "" && this.searchTotalPrice.trim() == "" && 
    this.searchStatus.trim() == "" && this.searchDatatime.trim() == ""){
      this.searchOrderList = this.orderList;
    }
    else{
      if(this.searchOrderId.trim() != ""){
        let searchData = this.searchOrderList.filter((x: { orderId: any; }) => x.orderId.includes(this.searchOrderId));
        this.searchOrderList = searchData;
      }
      if(this.searchRestaurant.trim() != ""){
        let searchData = this.searchOrderList.filter((x: { restName: any; }) => x.restName.toLowerCase().includes(this.searchRestaurant.toLowerCase()));
        this.searchOrderList = searchData;
      }
      if(this.searchCustomer.trim() != ""){
        let searchData = this.searchOrderList.filter((x: { custName: any; }) => x.custName.toLowerCase().includes(this.searchCustomer.toLowerCase()));
        this.searchOrderList = searchData;
      }
      if(this.searchPaymentMode.trim() != ""){
        let searchData = this.searchOrderList.filter((x: { paymentMode: any; }) => x.paymentMode.toLowerCase().includes(this.searchPaymentMode.toLowerCase()));
        this.searchOrderList = searchData;
      }
      if(this.searchInstruction.trim() != ""){
        let searchData = this.searchOrderList.filter((x: { instruction: any; }) => x.instruction.toLowerCase().includes(this.searchInstruction.toLowerCase()));
        this.searchOrderList = searchData;
      }
      if(this.searchTotalPrice.trim() != ""){
        let searchData = this.searchOrderList.filter((x: { totalPrice: any; }) => x.totalPrice.includes(this.searchTotalPrice));
        this.searchOrderList = searchData;
      }
      if(this.searchStatus.trim() != ""){
        let searchData = this.searchOrderList.filter((x: { statusTxt: any; }) => x.statusTxt.toLowerCase().includes(this.searchStatus.toLowerCase()));
        this.searchOrderList = searchData;
      }
      if(this.searchDatatime.trim() != ""){
        let searchData = this.searchOrderList.filter((x: { orderDatetime: any; }) => x.orderDatetime.includes(this.searchDatatime));
        this.searchOrderList = searchData;
      }
    }
    this.myPagination.itemCount = this.searchOrderList.length;
    this.myPagination.createPagination();
    
    // else{
    //   
    // }
  }

  exportOrder(){
    if(this.searchOrderList.length != 0 ){
      let columnKeyArr:any = ["orderId","restName","custName","paymentMode","instruction","grandTotal","statusTxt","orderDatetime"];
      let columnTitleArr:any = ["Order Id","Restaurant","Customer","Payment Mode","Instruction","Grand Total","Status","Order Date"];
      CommonFunction.downloadFile(this.searchOrderList,
        'Order_Report.csv', 
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
