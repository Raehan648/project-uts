import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [CommonModule, IonicModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}