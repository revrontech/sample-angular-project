/*
    Core Module
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { NgModule, ModuleWithProviders } from "@angular/core"
import { AuthService, AuthGuardCompany, AuthGuardCustomer, BearerInterceptor, ErrorInterceptor, AuthGuardCatalog } from './services'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AllowOrderGuard, DeGuardCustomer, OrderGuardCustomer } from './services/authorization/authguard.service'

// Essential Variables and Annotations
export const CORE_PROVIDERS = [
    AuthGuardCompany,
    AuthGuardCustomer,
    AuthGuardCatalog,
    DeGuardCustomer,
    OrderGuardCustomer,
    AllowOrderGuard,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
]

@NgModule({
    imports: [],
    declarations: []
})

// Export Modules
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                ...CORE_PROVIDERS
            ]
        }
    }
}