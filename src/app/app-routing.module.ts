import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/AuthGuard';
import { RestaurantComponent } from './layout/restaurant/restaurant.component';
import { ProductComponent } from './layout/product/product.component';
import { DeliveryboysComponent } from './layout/deliveryboys/deliveryboys.component';
import { OrdersComponent } from './layout/orders/orders.component';
import { ReportComponent } from './layout/report/report.component';
import { CommonPageComponent } from './layout/common-page/common-page.component';
import { AllRestaurantComponent } from './layout/all-restaurant/all-restaurant.component';

const routes: Routes = [
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'layout', component:LayoutComponent, canActivate:[AuthGuard],
    children:[
      {path:'', redirectTo:'allRestaurant', pathMatch:'full'},
      {path:'allRestaurant', component:AllRestaurantComponent},
      {path:'restaurant', component:RestaurantComponent},
      {path:'rest-menu/:restId', component:CommonPageComponent},
      {path:'product', component:ProductComponent},
      {path:'rider', component:DeliveryboysComponent},
      {path:'orders', component:OrdersComponent},
      {path:'report', component:ReportComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
