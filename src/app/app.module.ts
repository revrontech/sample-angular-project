/*
    App Module
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ToastrModule } from 'ngx-toastr';
import { BaseComponent } from './base.component';
import { RollbarService, rollbarFactory, RollbarErrorHandler } from './rollbar';
import { DatePipe } from '@angular/common';

// Stripe
import { NgxStripeModule } from 'ngx-stripe';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

// Essential Variables and Annotations
@NgModule({
    declarations: [
        AppComponent,
        BaseComponent
    ],
    imports: [
        HttpClientModule,

        BrowserAnimationsModule,
        NgxSpinnerModule,

        BrowserModule,
        AppRoutingModule,
        CoreModule.forRoot(),
        ToastrModule.forRoot(),
        ReactiveFormsModule
    ],
    providers: [
        { provide: ErrorHandler, useClass: RollbarErrorHandler },
        { provide: RollbarService, useFactory: rollbarFactory },
        DatePipe
    ],
    bootstrap: [AppComponent]
})

// Export Modules
export class AppModule {
}
