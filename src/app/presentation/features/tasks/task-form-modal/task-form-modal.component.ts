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
          <ion-button (click)="dismiss()" color="dark">
            <ion-icon slot="icon-only" name="close" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ task ? 'Edit Task' : 'New Task' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button [strong]="true" (click)="submit()" [disabled]="!title()" color="primary" fill="solid" mode="ios" class="save-btn">
            Save
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="form-content ion-padding">
      <div class="form-wrapper">
        <ion-item lines="none" class="input-item">
          <ion-label position="stacked" class="high-contrast-label">Title <span class="required">*</span></ion-label>
          <ion-input
            [ngModel]="title()"
            (ngModelChange)="title.set($event)"
            placeholder="What needs to be done?"
            maxlength="100"
            autocapitalize="sentences"
            class="main-input" />
        </ion-item>

        <ion-item lines="none" class="input-item">
          <ion-label position="stacked" class="high-contrast-label">Description</ion-label>
          <ion-textarea
            [ngModel]="description()"
            (ngModelChange)="description.set($event)"
            placeholder="Add some details..."
            rows="5"
            autocapitalize="sentences"
            class="main-input" />
        </ion-item>

        @if (categories.length > 0) {
          <ion-item lines="none" class="input-item">
            <ion-label position="stacked" class="high-contrast-label">Category</ion-label>
            <ion-select
              [ngModel]="selectedCategoryId()"
              (ngModelChange)="selectedCategoryId.set($event)"
              placeholder="Select category"
              interface="action-sheet"
              class="main-input">
              <ion-select-option [value]="null">No Category</ion-select-option>
              @for (cat of categories; track cat.id) {
                <ion-select-option [value]="cat.id">{{ cat.name }}</ion-select-option>
              }
            </ion-select>
          </ion-item>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    ion-header {
      --background: var(--ion-card-background);
      border-bottom: 1px solid var(--glass-border);
      padding: 12px 6px 0;
    }
    ion-toolbar {
      --background: var(--ion-card-background);
      --color: var(--ion-color-dark);
      ion-title {
        font-weight: 800;
        font-size: 1.3rem;
        letter-spacing: -0.5px;
      }
    }
    ion-content {
      --background: var(--ion-card-background);
    }
    .form-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 10px 0 40px;
    }
    .input-item {
      --background: var(--ion-background-color);
      --padding-start: 16px;
      --padding-end: 16px;
      --border-radius: 16px;
      margin-bottom: 4px;
      border: 1px solid transparent;
      transition: border-color 0.2s;
      
      &.item-has-focus {
        border-color: var(--ion-color-primary);
      }
    }
    .high-contrast-label {
      font-weight: 700 !important;
      color: var(--ion-color-dark) !important;
      font-size: 0.95rem !important;
      margin-bottom: 4px !important;
      opacity: 0.9;
    }
    .main-input {
      --padding-top: 14px;
      --padding-bottom: 14px;
      font-size: 1.05rem;
      color: var(--ion-color-dark);
    }
    .save-btn {
      --border-radius: 12px;
      --padding-start: 20px;
      --padding-end: 20px;
      font-weight: 700;
      height: 38px;
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
    const categoryId = this.selectedCategoryId() ?? undefined;
    const data: TaskFormData = {
      title: this.title().trim(),
      description: this.description().trim(),
      categoryId: categoryId as string | undefined,
      task: this.task ? { ...this.task, title: this.title().trim(), description: this.description().trim(), categoryId: categoryId as string | undefined } : undefined,
    };
    this.modalCtrl.dismiss(data);
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null);
  }
}
