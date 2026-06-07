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
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()" color="medium">
            <ion-icon slot="icon-only" name="close" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ task ? 'Edit Task' : 'New Task' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button [strong]="true" (click)="submit()" [disabled]="!title()" color="primary" fill="clear">
            Save
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="form-wrapper">
        <div class="custom-field">
          <label class="field-label">What needs to be done? *</label>
          <ion-input
            [ngModel]="title()"
            (ngModelChange)="title.set($event)"
            placeholder="e.g. Buy groceries"
            class="premium-input"
            required />
        </div>

        <div class="custom-field">
          <label class="field-label">Description (Optional)</label>
          <ion-textarea
            [ngModel]="description()"
            (ngModelChange)="description.set($event)"
            placeholder="Add some details..."
            [rows]="5"
            class="premium-input" />
        </div>

        @if (categories.length > 0) {
          <div class="custom-field">
            <label class="field-label">Category (Optional)</label>
            <ion-select
              [ngModel]="selectedCategoryId()"
              (ngModelChange)="selectedCategoryId.set($event)"
              placeholder="Select a category"
              interface="popover"
              class="premium-select">
              <ion-select-option [value]="null">No Category</ion-select-option>
              @for (cat of categories; track cat.id) {
                <ion-select-option [value]="cat.id">{{ cat.name }}</ion-select-option>
              }
            </ion-select>
          </div>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    ion-toolbar {
      --background: var(--ion-card-background);
      --color: var(--ion-color-dark);
      padding: 8px 4px 0;
    }
    ion-title {
      font-weight: 700;
      font-size: 1.1rem;
    }
    .form-wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 12px 4px;
    }
    .custom-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .field-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--ion-color-medium);
      padding-left: 4px;
    }
    .premium-input, .premium-select {
      --background: var(--ion-color-light);
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 14px;
      --padding-bottom: 14px;
      border-radius: 14px;
      background: var(--ion-color-light);
      font-size: 1rem;
      color: var(--ion-color-dark);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
      border: 1px solid rgba(0,0,0,0.05);
      transition: all 0.2s;

      &:focus-within {
        border-color: var(--ion-color-primary);
        box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb), 0.1);
      }
    }
    ion-textarea {
      --padding-top: 14px;
      --padding-bottom: 14px;
    }
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
    
    // Explicitly handle empty categoryId to ensure it's optional
    const categoryId = this.selectedCategoryId() || undefined;
    
    const data: TaskFormData = {
      title: this.title().trim(),
      description: this.description().trim(),
      categoryId: categoryId,
      task: this.task ? { 
        ...this.task, 
        title: this.title().trim(), 
        description: this.description().trim(), 
        categoryId: categoryId 
      } : undefined,
    };
    this.modalCtrl.dismiss(data);
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null);
  }
}
