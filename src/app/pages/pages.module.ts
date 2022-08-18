/*
    Pages Module
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { NgModule } from "@angular/core"
import { PagesRoutingModule } from './pages-routing.module'
import { PagesComponent } from './pages.component'
import { CatalogComponent } from './catalog/catalog.component'
import { NgbModalModule, NgbDropdownModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { NgSelect2Module } from 'ng-select2'
import { HomeComponent } from './home/home.component'
import { FormsModule } from '@angular/forms'
import { ModalAllergenComponent, ModalCartComponent, ModalMenuComponent, ModalAllergenDetailsComponent, ModalSuggestionComponent, ModalOrderTypeComponent, ModalLoginComponent, ModalRegisterComponent, ModalForgotComponent, ModalPseudoComponent } from '../@core/modal'
import { HeaderHomeComponent, HeaderCatalogComponent, HeaderCatalogMobileComponent, HeaderSingleComponent, HeaderSingleMobileComponent } from '../@core/header'
import { CartComponent, SideCartComponent, SideCartOrderComponent, DetailCartComponent } from './cart'
import { ProductComponent, MenuComponent } from './single'
import { LoginComponent, ForgotComponent, RegisterComponent, ProfileComponent, SideProfileComponent, MyOrdersComponent, WalletComponent, PseudoComponent } from './customer'
import { OrderComponent } from './order/order.component'
import { TrackingComponent } from './tracking/tracking.component'
import { MyQrCodeComponent } from './customer/profile/my-qr-code.component'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
import { ScanComponent } from './scan/scan.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';
import { ReactiveFormsModule } from '@angular/forms';

// Essential Variables and Annotations
@NgModule({
    imports: [
        PagesRoutingModule,
        ZXingScannerModule,
        NgSelect2Module,
        NgbModalModule,
        NgbDropdownModule,
        NgbCarouselModule,

        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        PagesComponent,
        HomeComponent,

        CatalogComponent,

        CartComponent,
        SideCartComponent,
        SideCartOrderComponent,
        DetailCartComponent,

        ProductComponent,
        MenuComponent,

        LoginComponent,
        ForgotComponent,
        RegisterComponent,
        ProfileComponent,
        SideProfileComponent,
        MyOrdersComponent,
        WalletComponent,
        PseudoComponent,
        OrderComponent,

        HeaderHomeComponent,
        HeaderCatalogComponent,
        HeaderCatalogMobileComponent,
        HeaderSingleComponent,
        HeaderSingleMobileComponent,

        ModalAllergenComponent,
        ModalAllergenDetailsComponent,
        ModalCartComponent,
        ModalMenuComponent,
        ModalSuggestionComponent,
        ModalOrderTypeComponent,


        ModalLoginComponent,
        ModalRegisterComponent,
        ModalForgotComponent,
        ModalPseudoComponent,

        MyQrCodeComponent,

        TrackingComponent,
        ScanComponent,
        StripePaymentComponent,
    ],
    entryComponents: [
        ModalAllergenComponent,
        ModalAllergenDetailsComponent,
        ModalCartComponent,
        ModalMenuComponent,
        ModalSuggestionComponent,
        ModalOrderTypeComponent
    ]
})

// Export Modules
export class PagesModule { }