import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
  imports: [ 
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  exports: [LoginComponent],
})
export class AuthModule {}
