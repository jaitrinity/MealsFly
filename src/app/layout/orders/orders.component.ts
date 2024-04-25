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
        this.searchOrder("");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("orders"));
        this.layout.spinnerHide();
      }
    })
  }

  viewOrderId: any;
  viewOrderObj:any = {};
  getOrderItem(orderObj:any){
    this.viewOrderObj = orderObj;
    this.viewOrderId = orderObj.orderId;
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
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("orderItem"));
        this.layout.spinnerHide();
      }
    })
  }

  searchOrderId: any = "";
  searchRestaurant: any = "";
  searchCustomer: any = "";
  searchPrimaryMobile: any = "";
  // searchRiderName: any = "";
  // searchRiderMobile: any = "";
  searchRider: any = "";
  searchPaymentMode: any = "";
  searchGrandTotal: any = "";
  searchInstruction: any = "";
  searchTotalPrice: any = "";
  searchStatus: any = "";
  searchDatatime: any = "";
  searchOrder(event:any){
    this.searchOrderList = this.orderList.filter(
      (
        x: 
        { 
          orderId: any; 
          restName: any;
          custName: any;
          primaryMobile: any;
          // riderName: any;
          // riderMobile: any;
          riderInfo: any;
          paymentMode: any;
          grandTotal: any,
          statusTxt: any;
          orderDatetime: any;
        }
      ) => 
      x.orderId.trim().includes(this.searchOrderId) && 
      x.restName.trim().toLowerCase().includes(this.searchRestaurant.toLowerCase()) && 
      x.custName.trim().toLowerCase().includes(this.searchCustomer.toLowerCase()) && 
      x.primaryMobile.trim().toLowerCase().includes(this.searchPrimaryMobile.toLowerCase()) && 
      // x.riderName.trim().toLowerCase().includes(this.searchRiderName.toLowerCase()) && 
      // x.riderMobile.trim().toLowerCase().includes(this.searchRiderMobile.toLowerCase()) && 
      x.riderInfo.trim().toLowerCase().includes(this.searchRider.toLowerCase()) && 
      x.paymentMode.trim().toLowerCase().includes(this.searchPaymentMode.toLowerCase()) && 
      x.grandTotal.trim().toLowerCase().includes(this.searchGrandTotal.toLowerCase()) && 
      x.statusTxt.trim().toLowerCase().includes(this.searchStatus.toLowerCase()) && 
      x.orderDatetime.trim().includes(this.searchDatatime)
    );
    this.myPagination.itemCount = this.searchOrderList.length;
    this.myPagination.createPagination();
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

  deleteOrder(orderId:any){
    let isConfirm = confirm("Do u want delete this order?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType:"deleteOrder",
      orderId: orderId
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getOrders();
        }
        this.layout.successSnackBar(result.message)
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("deleteOrder"));
        this.layout.spinnerHide();
      }
    })
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
