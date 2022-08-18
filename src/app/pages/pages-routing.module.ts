/*
    Pages Routing Module
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Routes, RouterModule } from "@angular/router"
import { PagesComponent } from './pages.component'
import { NgModule } from '@angular/core'
import { HomeComponent } from './home/home.component'
import { CatalogComponent } from './catalog/catalog.component'
import { ProductComponent } from './single/product.component'
import { MenuComponent } from './single/menu.component'
import { CartComponent } from './cart'
import { AllowOrderGuard, AuthGuardCatalog, AuthGuardCustomer, DeGuardCustomer, OrderGuardCustomer } from '../@core/services'
import { PseudoComponent, LoginComponent, RegisterComponent, ForgotComponent, ProfileComponent, MyOrdersComponent, WalletComponent, NavProfileMobileComponent, MyQrCodeComponent } from './customer'
import { OrderComponent } from './order/order.component'
import { TrackingComponent } from './tracking/tracking.component'

import { ScanComponent } from './scan/scan.component'


// Essential Variables and Annotations
const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        { path: 'scan/:consumerCode/:id', component: ScanComponent },
        { path: 'home', component: HomeComponent },
        { path: 'catalog', canActivate: [AuthGuardCatalog], component: CatalogComponent },

        { path: 'single-product', canActivate: [AuthGuardCatalog], component: ProductComponent },
        { path: 'single-menu', canActivate: [AuthGuardCatalog], component: MenuComponent },

        { path: 'cart', canActivate: [AuthGuardCatalog, AllowOrderGuard], component: CartComponent },
        { path: 'order', canActivate: [AuthGuardCatalog, OrderGuardCustomer, AllowOrderGuard], component: OrderComponent },
        { path: 'tracking/:orderkeys', component: TrackingComponent },

        { path: 'login', canActivate: [AuthGuardCatalog, DeGuardCustomer, AllowOrderGuard], component: LoginComponent },
        { path: 'register', canActivate: [AuthGuardCatalog, DeGuardCustomer, AllowOrderGuard], component: RegisterComponent },
        { path: 'forgot', canActivate: [AuthGuardCatalog, DeGuardCustomer, AllowOrderGuard], component: ForgotComponent },
        { path: 'pseudo', canActivate: [AuthGuardCatalog, DeGuardCustomer, AllowOrderGuard], component: PseudoComponent },
        { path: 'nav-profile', canActivate: [AuthGuardCatalog, AuthGuardCustomer, AllowOrderGuard], component: NavProfileMobileComponent },
        { path: 'profile', canActivate: [AuthGuardCatalog, AuthGuardCustomer, AllowOrderGuard], component: ProfileComponent },
        { path: 'my-orders', canActivate: [AuthGuardCatalog, AuthGuardCustomer, AllowOrderGuard], component: MyOrdersComponent },
        { path: 'my-qr-code', canActivate: [AuthGuardCatalog, AuthGuardCustomer, AllowOrderGuard], component: MyQrCodeComponent },
        { path: 'wallet', canActivate: [AuthGuardCatalog, AuthGuardCustomer, AllowOrderGuard], component: WalletComponent },

        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: '**', redirectTo: 'home' }
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

// Export Modules
export class PagesRoutingModule { }