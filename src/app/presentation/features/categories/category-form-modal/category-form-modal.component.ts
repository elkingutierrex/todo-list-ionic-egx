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
  templateUrl: './category-form-modal.component.html',
  styleUrl: './category-form-modal.component.scss'
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
