import { Injector,NgModule } from '@angular/core';
// import createCustomElement
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbSecurityModule } from '@nebular/security';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClientModule } from '@angular/common/http';
import { PortalModule } from "@angular/cdk/portal";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        PortalModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NbSecurityModule,
        NbThemeModule.forRoot({name: 'default'}),
        NbLayoutModule,
        NbEvaIconsModule,
        HttpClientModule
    ],
    providers: [],
    exports: [
    ],
    bootstrap: [AppComponent],
    entryComponents: [AppComponent]
})
export class AppModule {
    constructor(private injector: Injector){}

    ngDoBootstrap(){
        const element = createCustomElement(AppComponent, {injector: this.injector});
        // Here you define your new tag shiny-app-a
        customElements.define('app-micro-fe', element);
    }
}
