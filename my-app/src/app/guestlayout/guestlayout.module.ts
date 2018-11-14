import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestlayoutComponent } from './guestlayout.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { GuestLayoutRoutingModule } from './guestlayout-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        GuestLayoutRoutingModule
    ],
    declarations: [
        GuestlayoutComponent,
        SigninComponent,
        SignupComponent
    ],
    entryComponents: []
})
export class GuestLayoutModule { }