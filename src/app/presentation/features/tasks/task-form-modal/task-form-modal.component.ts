import { Component, Input, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonButtons,
  IonIcon, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { Task } from '../../../../core/models/task.model';
import { Category } from '../../../../core/models/category.model';

export interface TaskFormData {
  title: string;
  description: string;
  categoryId?: string;
  task?: Task;
}

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
    IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonButtons, IonIcon
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="close" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ task ? 'Edit Task' : 'New Task' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button [strong]="true" (click)="submit()" [disabled]="!title()">
            Save
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="form-content">
      <ion-item>
        <ion-label position="stacked">Title <span class="required">*</span></ion-label>
        <ion-input
          [ngModel]="title()"
          (ngModelChange)="title.set($event)"
          placeholder="What needs to be done?"
          maxlength="100"
          autocapitalize="sentences" />
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Description</ion-label>
        <ion-textarea
          [ngModel]="description()"
          (ngModelChange)="description.set($event)"
          placeholder="Add details (optional)"
          rows="3"
          autocapitalize="sentences" />
      </ion-item>

      @if (categories.length > 0) {
        <ion-item>
          <ion-label position="stacked">Category</ion-label>
          <ion-select
            [ngModel]="selectedCategoryId()"
            (ngModelChange)="selectedCategoryId.set($event)"
            placeholder="Select category"
            interface="action-sheet">
            <ion-select-option [value]="null">None</ion-select-option>
            @for (cat of categories; track cat.id) {
              <ion-select-option [value]="cat.id">{{ cat.name }}</ion-select-option>
            }
          </ion-select>
        </ion-item>
      }
    </ion-content>
  `,
  styles: [`
    .form-content ion-item {
      --padding-start: 20px;
      --inner-padding-end: 20px;
      margin-bottom: 4px;
    }
    .required { color: var(--ion-color-danger); }
  `],
})
export class TaskFormModalComponent implements OnInit {
  @Input() task?: Task;
  @Input() categories: Category[] = [];

  private modalCtrl = inject(ModalController);

  title = signal('');
  description = signal('');
  selectedCategoryId = signal<string | null | undefined>(null);

  constructor() {
    addIcons({ close });
  }

  ngOnInit(): void {
    if (this.task) {
      this.title.set(this.task.title);
      this.description.set(this.task.description);
      this.selectedCategoryId.set(this.task.categoryId ?? null);
    }
  }

  submit(): void {
    if (!this.title().trim()) return;
    const data: TaskFormData = {
      title: this.title().trim(),
      description: this.description().trim(),
      categoryId: this.selectedCategoryId() ?? undefined,
      task: this.task ? { ...this.task, title: this.title().trim(), description: this.description().trim(), categoryId: this.selectedCategoryId() ?? undefined } : undefined,
    };
    this.modalCtrl.dismiss(data);
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null);
  }
}
