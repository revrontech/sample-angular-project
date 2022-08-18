/*
    App Routing Module
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { NgModule } from '@angular/core'
import { Routes, RouterModule, ExtraOptions } from '@angular/router'
import { AuthGuardCompany } from './@core/services'
import { BaseComponent } from './base.component'
import { PayCheckComponent } from './pay-check.component'

// Essential Variables and Annotations
const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuardCompany],
    loadChildren: () => import('./pages/pages.module').then(module => module.PagesModule)
  },
  { path: 'base', component: BaseComponent },
  { path: 'paycheck', component: PayCheckComponent },
  { path: '', redirectTo: 'base', pathMatch: 'full' },
  { path: '**', redirectTo: 'base' }
]

const config: ExtraOptions = {
  useHash: true,
}

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})

// Export Modules
export class AppRoutingModule { }
