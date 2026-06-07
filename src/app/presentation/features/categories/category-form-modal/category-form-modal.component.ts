import { Component, Input, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonButtons, IonIcon, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { Category } from '../../../../core/models/category.model';

const PRESET_COLORS = [
  '#5C6BC0', '#42A5F5', '#66BB6A', '#FFA726',
  '#EF5350', '#AB47BC', '#26C6DA', '#FF7043',
];

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
    IonInput, IonButton, IonButtons, IonIcon
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="close" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ category ? 'Edit Category' : 'New Category' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button [strong]="true" (click)="submit()" [disabled]="!name()">
            Save
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="form-content">
      <ion-item>
        <ion-label position="stacked">Name <span class="required">*</span></ion-label>
        <ion-input
          [ngModel]="name()"
          (ngModelChange)="name.set($event)"
          placeholder="Category name"
          maxlength="50"
          autocapitalize="sentences" />
      </ion-item>

      <div class="color-picker">
        <p class="color-label">Color</p>
        <div class="swatches">
          @for (color of presetColors; track color) {
            <button
              class="swatch"
              [style.background]="color"
              [class.selected]="selectedColor() === color"
              (click)="selectedColor.set(color)"
              type="button">
            </button>
          }
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .form-content ion-item { --padding-start: 20px; --inner-padding-end: 20px; }
    .required { color: var(--ion-color-danger); }
    .color-picker { padding: 16px 20px; }
    .color-label { font-size: 0.85rem; color: var(--ion-color-medium); margin: 0 0 10px; }
    .swatches { display: flex; flex-wrap: wrap; gap: 10px; }
    .swatch {
      width: 36px; height: 36px; border-radius: 50%; border: 3px solid transparent;
      cursor: pointer; transition: transform 0.15s, border-color 0.15s;
      &.selected { border-color: white; outline: 3px solid var(--ion-color-primary); transform: scale(1.15); }
      &:hover { transform: scale(1.1); }
    }
  `],
})
export class CategoryFormModalComponent implements OnInit {
  @Input() category?: Category;

  private modalCtrl = inject(ModalController);

  name = signal('');
  selectedColor = signal(PRESET_COLORS[0]);
  presetColors = PRESET_COLORS;

  constructor() {
    addIcons({ close });
  }

  ngOnInit(): void {
    if (this.category) {
      this.name.set(this.category.name);
      this.selectedColor.set(this.category.color);
    }
  }

  submit(): void {
    if (!this.name().trim()) return;
    this.modalCtrl.dismiss({ name: this.name().trim(), color: this.selectedColor() });
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null);
  }
}
