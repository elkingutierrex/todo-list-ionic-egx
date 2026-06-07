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
          <ion-button [strong]="true" (click)="submit()" [disabled]="!title()" color="primary">
            Save
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="form-wrapper">
        <ion-item lines="none" class="input-item">
          <ion-label position="stacked">Title <span class="required">*</span></ion-label>
          <ion-input
            [ngModel]="title()"
            (ngModelChange)="title.set($event)"
            placeholder="What needs to be done?"
            maxlength="100"
            autocapitalize="sentences" />
        </ion-item>

        <ion-item lines="none" class="input-item">
          <ion-label position="stacked">Description</ion-label>
          <ion-textarea
            [ngModel]="description()"
            (ngModelChange)="description.set($event)"
            placeholder="Add details (optional)"
            rows="4"
            autocapitalize="sentences" />
        </ion-item>

        @if (categories.length > 0) {
          <ion-item lines="none" class="input-item">
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
      </div>
    </ion-content>
  `,
  styles: [`
    ion-header {
      --background: var(--ion-card-background);
      padding-top: 8px;
    }
    ion-toolbar {
      --background: var(--ion-card-background);
      --color: var(--ion-color-dark);
      ion-title {
        font-weight: 700;
        font-size: 1.2rem;
      }
    }
    ion-content {
      --background: var(--ion-card-background);
      --padding-top: 20px;
    }
    .form-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 24px;
    }
    .input-item {
      --background: var(--ion-background-color);
      --padding-start: 16px;
      --padding-end: 16px;
      --border-radius: 12px;
      margin-bottom: 8px;
      
      ion-label {
        font-weight: 600;
        color: var(--ion-color-medium);
        margin-bottom: 8px;
      }
      
      ion-input, ion-textarea, ion-select {
        --padding-top: 12px;
        --padding-bottom: 12px;
        font-size: 1rem;
      }
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
