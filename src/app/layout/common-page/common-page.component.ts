import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { Constant } from 'src/app/constant/Constant';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { CommonFunction } from 'src/app/shared/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-common-page',
  templateUrl: './common-page.component.html',
  styleUrls: ['./common-page.component.scss']
})
export class CommonPageComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  imgWidth: number = 0;
  imgHeight: number = 0; 
  imgInfo: string = "";
  imgRatio = 0.26;
  bnrRatio = 0.30;
  restImgInfo: string = "Height = Width * "+this.imgRatio+";\n"+
                        "Height = 500px * "+this.imgRatio+" = 130px";
  restBnrInfo: string = "Height = Width * "+this.bnrRatio+";\n"+
                        "Height = 500px * "+this.bnrRatio+" = 150px";
  restDisplayOrder: number = 0;
  restId: any = "";
  restData: any = "";
  restName: any = "";
  restMobile: any = "";
  restAddress: any = "";
  restLatLong: any = "";
  restImage: any = "";
  restBanner: any = "";
  itemList: any = [];
  searchItemList: any = [];
  categoryList: any = [];
  unitList: any = [];
  isItemLoaded: boolean = false;
  noItemFound: boolean = false;
  constructor(private activeRoute: ActivatedRoute, private layout:LayoutComponent, 
    private sharedService: SharedService){
      this.imgWidth = Constant.IMG_WIDTH;
      this.imgHeight = Constant.IMG_HEIGHT;
      this.imgInfo = "Image dimension should be equal to ("+this.imgWidth+"x"+this.imgHeight+")px";
    $(document).ready(function(){
      $('.turn').on('click', function(){
        var angle = ($('.viewImg').data('angle') + 90) || 90;
        $('.viewImg').css({'transform': 'rotate(' + angle + 'deg)'});
        $('.viewImg').data('angle', angle);
      });
    })

  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(param =>{
      this.restId = param.get("restId");
      this.searchItemName = "";
      this.searchCategory = "";
      this.getAllCategory();
      this.getRestaurantData();
    })
  }
  getAllCategory(){
    let jsonData = {
      searchType:"allCategory",
      restId: this.restId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.categoryList = result.categoryList;
        this.unitList = result.unitList;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("allCategory"))
      }
    })
  }
  getRestaurantData(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType: "restaurantData",
      restId: this.restId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restData = result;
        this.layout.setPageTitle(this.restData.name);
        this.layout.spinnerHide();
        this.resetItemList();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurantData"))
      }
    })
  }

  actionOnRestaurant(){
    let jsonData = {
      searchType: "restaurantData",
      restId: this.restId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restData = result;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurantData"))
      }
    })
  }

  deleteItem(itemId:any){
    let isConfirm = confirm("Are u sure want to delete this item?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType: "deleteRestItem",
      itemId: itemId
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.resetItemList();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("deleteRestItem"))
      }
    })
  }

  editItemId:any = "";
  editItemObj:any;
  editCatId: any ="";
  editItemName: any ="";
  editCustomize: any ="";
  editItemUnitList:any=[];
  editItem(itemObj:any){
    this.editItemObj = itemObj;
    this.editItemId = itemObj.itemId;
    this.editCatId = itemObj.catId;
    this.editItemName = itemObj.itemName;
    this.editCustomize = itemObj.customize;
    // this.showEditUnit();
    this.editItemUnitList = itemObj.itemUnitList;
    this.openAnyModal("editItemModal");
  }

  selectCateList: any = [];
  selectCategory(catId:any, catName:any){
    let isChecked = $("#cat"+catId).prop("checked");
    if(isChecked){
      let catJson = {
        catId: catId, catName:catName
      }
      this.selectCateList.push(catJson);
    }
    else{
      // let indexOf = this.selectCateList.findIndex((object: { catId: any; }) =>{
      //   return object.catId == catId;
      // });
      // this.selectCateList.splice(indexOf, 1);

      let newList = this.selectCateList.filter((object: { catId: any; }) =>{
        return object.catId !== catId;
      });
      this.selectCateList = newList;
    }
  }

  addCatItem(){
    this.openAnyModal("addItemModal");
  }

  addMore: any=1;
  addMoreItem(){
    this.addMore++;
  }

  removeItem(){
    if(this.addMore > 1){
      this.addMore--;
    } 
  }
  showUnit(itemId:any){
    let customize = $("#itemCustomize"+itemId).val();
    if(customize == ""){
      return [];
    }
    customize = parseInt(customize);
    let unitObj = this.unitList.filter((x: { custId: any; }) => x.custId === customize)[0];
    return unitObj.unit;
  }
  isOriginal: boolean = true;
  newEditUnitList:any = [];
  showEditUnit(){
    if(this.editItemObj.customize == this.editCustomize){
      this.isOriginal = true;
    }
    else{
      this.isOriginal = false;
      let customize = this.editCustomize;
      if(customize == ""){
        return [];
      }
      customize = parseInt(customize);
      let unitObj = this.unitList.filter((x: { custId: any; }) => x.custId === customize)[0];
      this.newEditUnitList = unitObj.unit;
      return this.newEditUnitList;
    }
  }
  createRange(number:any){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }
  saveItem(){
    let newUnitList = [];
    if(this.isOriginal){
      for(let i=0;i<this.editItemUnitList.length;i++){
        let obj = this.editItemUnitList[i];
        let objVal = $("#editUnit_"+obj.itemUnitId).val();
        if(objVal.trim() != ""){
          let unitJson = {
            title: obj.unit,
            price: objVal
          }
          newUnitList.push(unitJson);
        }  
      }
    }
    else{
      for(let i=0;i<this.newEditUnitList.length;i++){
        let obj = this.newEditUnitList[i];
        let objVal = $("#editUnit_"+obj).val();
        if(objVal.trim() != ""){
          let unitJson = {
            title: obj,
            price: $("#editUnit_"+obj).val()
          }
          newUnitList.push(unitJson);
        } 
      }
    }
    if(newUnitList.length == 0){
      this.layout.warningSnackBar("Please enter one unit price");
      return;
    }
    let jsonData = {
      updateType: 'updateItem',
      restId: this.restId,
      itemId: this.editItemId,
      name: this.editItemName,
      catId: this.editCatId,
      customize:this.editCustomize,
      image64: this.editItemImageBase64,
      unitList: newUnitList
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.closeAnyModal('editItemModal')
          $(".resetField").val("");
          this.resetItemList();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message);
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("updateItem"))
      }
    })
  }
  moreItemList: any = [];
  submitItem(){
    this.moreItemList = [];
    for(let i=0;i<this.addMore;i++){
      let id = i+1;
      let itemCategory = $("#itemCategory"+id).val();
      let itemName = $("#itemName"+id).val();
      let itemImage = $("#txt_itemImage"+id).val();
      let itemCustomize = $("#itemCustomize"+id).val();
      if(itemCategory.trim() == ""){
        this.layout.warningSnackBar("Select category");
        $("#itemCategory"+id).focus();
        return;
      }
      else if(itemName.trim() == ""){
        this.layout.warningSnackBar("Enter name");
        $("#itemName"+id).focus();
        return;
      }
      else if(itemImage == ""){
        this.layout.warningSnackBar("Select a image");
        $("#itemName"+id).focus();
        return;
      }
      else if(itemCustomize == ""){
        this.layout.warningSnackBar("Select unit");
        $("#itemCustomize"+id).focus();
        return;
      }

      let itemUnit = [];
      itemCustomize = parseInt(itemCustomize);
      let unitObj = this.unitList.filter((x: { custId: any; }) => x.custId === itemCustomize)[0];
      let unitList = unitObj.unit;
      for(let j=0;j<unitList.length;j++){
        let unit = unitList[j];
        let itemData = $("#item"+unit+""+id).val();
        if(itemData.trim() == ""){
          // this.layout.warningSnackBar("enter "+unit+" of "+id);
          // $("#item"+unit+""+id).focus();
          // break;
        }
        else{
          let unitJson = {
            title:unit,
            price: itemData
          }
          itemUnit.push(unitJson);
        }
      }
      if(itemUnit.length == 0){
        this.layout.warningSnackBar("Please enter one unit price  of "+id+" row");
        return
      }
      else{
        let itemJson = {
          id: id,
          catId: itemCategory,
          name: itemName,
          image: itemImage,
          customize: itemCustomize,
          unitList: itemUnit
        }
        this.moreItemList.push(itemJson);
      }
    }
    let jsonData = {
      insertType: "moreItem",
      restId: this.restId,
      itemList: this.moreItemList
    }
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.closeAnyModal('addItemModal')
          $(".resetField").val("");
          this.resetItemList();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message);
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("moreItem"))
      }
    })
  }

  public isTrue(value:any) :boolean{
    if(value != null && value != ''){
      return true;
    }
    return false
  }

  appRejRestaurant(restId:any, action:any, actionTxt:any){
    let isConfirm = confirm("Do u want to "+actionTxt+" this restaurant?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType: 'appRejRest',
      restId: restId,
      action: action
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.actionOnRestaurant();
          this.layout.successSnackBar(result.message)
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("appRejRest"))
      }
    })
  }

  enaDisRestaurant(restId:any, action:any, actionTxt:any){
    let isConfirm = confirm("Do you want to "+actionTxt+" this restaurant?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType: 'enaDisRest',
      restId: restId,
      action: action
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.actionOnRestaurant();
          this.layout.successSnackBar(result.message)
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("enaDisRest"))
      }
    })
  }

  resetItemList(){
    this.itemList = [];
    this.searchItemList = [];
    this.isItemLoaded = true;
    this.noItemFound = false;
    let jsonData = {
      searchType: "resetItemList",
      restId: this.restId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.itemList = result;
        this.searchItemList = this.itemList;
        if(this.itemList == 0){
          this.noItemFound = true;
        }
        this.isItemLoaded = false;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("resetItemList"))
      }
    })
  }

  validateRestData() : any{
    if(this.restName.trim() == ""){
      this.layout.warningSnackBar("Enter name");
      return false;
    }
    else if(this.restMobile.trim() == ""){
      this.layout.warningSnackBar("Enter mobile");
      return false;
    }
    else if(this.restMobile.length != 10){
      this.layout.warningSnackBar("Mobile length should be 10");
      return false;
    }
    else if(this.restLatLong.trim() == ""){
      this.layout.warningSnackBar("Latlong should be fill")
    }
    return true;
  }

  saveRestaurant(){
    if(!this.validateRestData()){
      return;
    }
    let jsonData = {
      updateType: "editRestaurant",
      restId: this.restId,
      name: this.restName,
      mobile: this.restMobile,
      address: this.restAddress,
      latlong: this.restLatLong,
      image64:this.restImageBase64,
      banner64:this.restBannerBase64,
      displayOrder: this.restDisplayOrder
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.layout.successSnackBar(result.message);
          // $(".resetField").val("");
          this.closeAnyModal("editRestModal");
          this.actionOnRestaurant();
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("editRestaurant"))
      }
    })
  }

  catImageBase64: any="";
  restImageBase64: any="";
  restBannerBase64: any="";
  editItemImageBase64: any="";
  changeListener($event:any, imageId:any):void{
    const selectedFile = $event.target.files[0];
    if (selectedFile) {
      this.checkImageDimensions(selectedFile,imageId);
    }
  }
  checkImageDimensions(file: File, imageId:any) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const width = img.width;
        let aspectHeight = width;
        let alertMsg = "";
        if(imageId == "restImage"){
          aspectHeight = Math.floor(width * this.imgRatio);
          alertMsg = 'Image dimensions must equal to ('+width+'x'+aspectHeight+')px.';
        }
        else if(imageId == "restBanner"){
          aspectHeight = Math.floor(width * this.bnrRatio);
          alertMsg = 'Banner dimensions must equal to ('+width+'x'+aspectHeight+')px.';
        }
        else if(imageId == "editItemImage"){
          alertMsg = 'Image dimensions must equal to ('+width+'x'+aspectHeight+')px.';
        }
        else{
          alertMsg = 'Image dimensions must equal to ('+width+'x'+aspectHeight+')px.';
        }
        const height = img.height;
        if (height != aspectHeight) {
          if(imageId == 0){
            this.catImageBase64 = "";
            $("#file_catImage").val("");
          }
          else if(imageId == "restImage"){
            this.restImageBase64 = "";
            $("#restImageBase64").val("");
          }
          else if(imageId == "restBanner"){
            this.restBannerBase64 = "";
            $("#restBannerBase64").val("");
          }
          else if(imageId == "editItemImage"){
            this.editItemImageBase64 = "";
            $("#editItemImageBase64").val("");
          }
          else{
            $("#file_itemImage"+imageId).val("");
            $("#txt_itemImage"+imageId).val("");
          }
          alert(alertMsg);
        } else {
          // You can proceed with the image upload here
          // alert('Image dimensions are valid.');
          // Example: call a function to upload the image.
          this.uploadImage(file,imageId);
        }
      };
    };

    reader.readAsDataURL(file);
  }
  // checkImageDimensions(file: File, imageId:any) {
  //   const reader = new FileReader();

  //   reader.onload = (e: any) => {
  //     const img = new Image();
  //     img.src = e.target.result;

  //     img.onload = () => {
  //       const width = img.width;
  //       const height = img.height;

  //       if (width > this.imgWidth || height > this.imgHeight) {
  //         if(imageId == 0){
  //           this.catImageBase64 = "";
  //           $("#file_catImage").val("");
  //         }
  //         else if(imageId == "restImage"){
  //           this.restImageBase64 = "";
  //           $("#restImageBase64").val("");
  //         }
  //         else if(imageId == "restBanner"){
  //           this.restBannerBase64 = "";
  //           $("#restBannerBase64").val("");
  //         }
  //         else if(imageId == "editItemImage"){
  //           this.editItemImageBase64 = "";
  //           $("#editItemImageBase64").val("");
  //         }
  //         else{
  //           $("#file_itemImage"+imageId).val("");
  //           $("#txt_itemImage"+imageId).val("");
  //         }
  //         alert('Image dimensions must be less than or equal to '+this.imgWidth+'x'+this.imgHeight+'.');
  //       } else {
  //         // You can proceed with the image upload here
  //         // alert('Image dimensions are valid.');
  //         // Example: call a function to upload the image.
  //         this.uploadImage(file,imageId);
  //       }
  //     };
  //   };

  //   reader.readAsDataURL(file);
  // }

  uploadImage(file: File, imageId: any){
    let wrongFile = false;
    let fileName = file.name;
    if(!(fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1 || 
    fileName.indexOf(".png") > -1)){
      this.layout.warningSnackBar("only .jpg, .jpeg, .png format accepted, please choose right file.");
      wrongFile = true;
    }
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      if(imageId == "restImage"){
        this.restImageBase64 = image;
      }
      else if(imageId == "restBanner"){
        this.restBannerBase64 = image
      }
      else if(imageId == "editItemImage"){
        this.editItemImageBase64 = image;
      }
      else if(imageId == 0){
        this.catImageBase64 = image;
      }
      else{
        $("#txt_itemImage"+imageId).val(image);
      }
      
      if(wrongFile){
        this.restImageBase64 = "";
        this.restBannerBase64 = "";
        if(imageId == 0){
          this.catImageBase64 = "";
          $("#file_catImage").val("");
        }
        else{
          $("#file_itemImage"+imageId).val("");
          $("#txt_itemImage"+imageId).val("");
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  // changeListener($event:any, imageId:any): void {
  //   this.readThis($event.target, imageId);
  // }

  // readThis(inputValue: any, imageId:any): void {
  //   var file: File = inputValue.files[0];
  //   let wrongFile = false;
  //   let fileName = file.name;
  //   if(!(fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1 || 
  //   fileName.indexOf(".png") > -1)){
  //     this.layout.warningSnackBar("only .jpg, .jpeg, .png format accepted, please choose right file.");
  //     wrongFile = true;
  //   }
  //   var myReader: FileReader = new FileReader();

  //   myReader.onloadend = (e) => {
  //     let image = myReader.result;
  //     if(imageId == "restImage"){
  //       this.restImageBase64 = image;
  //     }
  //     else if(imageId == "restBanner"){
  //       this.restBannerBase64 = image
  //     }
  //     else if(imageId == 0){
  //       this.catImageBase64 = image;
  //     }
  //     else{
  //       $("#txt_itemImage"+imageId).val(image);
  //     }
      
  //     if(wrongFile){
  //       this.restImageBase64 = "";
  //       this.restBannerBase64 = "";
  //       if(imageId == 0){
  //         this.catImageBase64 = "";
  //         $("#file_catImage").val("");
  //       }
  //       else{
  //         $("#file_itemImage"+imageId).val("");
  //         $("#txt_itemImage"+imageId).val("");
  //       }
  //     }
  //   }
  //   myReader.readAsDataURL(file);
  // }

  addNewCategory(){
    this.closeAnyModal("addItemModal");
    this.openAnyModal("newCategoryModal");
  }

  newCatName:any = "";
  submitCategory(){
    let jsonData ={
      insertType: "addCategory",
      restId: this.restId,
      category: this.newCatName,
      imageBase64: this.catImageBase64
    }
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          $(".resetField").val("");
          this.getAllCategory();
          this.closeAndOpenModal('newCategoryModal','addItemModal');
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("addCategory"))
      }
    })
  }

  viewImgUrl: any = ""
  viewImage(imgUrl:any){
    this.viewImgUrl = imgUrl;
    this.openAnyModal('imageModal');
  }

  editViewRestData(){
    this.openAnyModal("editRestModal");
    this.restName = this.restData.name;
    this.restMobile = this.restData.mobile;
    this.restAddress = this.restData.address;
    this.restLatLong = this.restData.latLong;
    this.restDisplayOrder = this.restData.displayOrder;
  }

  searchItemName:any = "";
  searchCategory:any = "";
  searchItem(evt:any){
    // let value = evt.target.value;
    // this.searchItemList = [];
    if(this.searchItemName.trim() == "" && this.searchCategory.trim() == ""){
      this.searchItemList = this.itemList;
    }
      
    else if(this.searchItemName != "" && this.searchCategory == ""){
      this.searchItemList = this.itemList.filter((x: { itemName: any; }) => x.itemName.toLowerCase().includes(this.searchItemName.toLowerCase()));
    }
    else if (this.searchItemName == "" && this.searchCategory != ""){
      this.searchItemList = this.itemList.filter((x: { catName: any; }) => x.catName.toLowerCase().includes(this.searchCategory.toLowerCase()));
    }
    else if(this.searchItemName != "" && this.searchCategory != ""){
      this.searchItemList = this.itemList.filter((x: { itemName: any;catName: any; }) => x.itemName.toLowerCase().includes(this.searchItemName.toLowerCase()) && x.catName.toLowerCase().includes(this.searchCategory.toLowerCase()));
    }

    if(this.searchItemList.length == 0){
      this.noItemFound = true;
    }
    else{
      this.noItemFound = false;
    }
    this.myPagination.itemCount = this.searchItemList.length;
    this.myPagination.createPagination();
  }

  exportItem(){
    if(this.searchItemList.length != 0 ){
      let columnKeyArr:any = ["itemName","catName","itemUnit"];
      let columnTitleArr:any = ["Name","Category","Customize"];
      CommonFunction.downloadFile(this.searchItemList,
        'Item.csv', 
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
  closeAndOpenModal(closeModalId:any, openModalId:any){ 
    this.closeAnyModal(closeModalId);
    this.openAnyModal(openModalId);
  }
}
