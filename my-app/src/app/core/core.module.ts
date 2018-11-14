import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreRoutingModule } from './core-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';

@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule
    ],
    declarations: [NotAuthorizedComponent, PageNotFoundComponent],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard,
        AuthService
    ]
})
export class CoreModule { }