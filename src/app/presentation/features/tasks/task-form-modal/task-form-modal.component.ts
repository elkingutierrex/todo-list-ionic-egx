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
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="close" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ task ? 'Edit Task' : 'New Task' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button [strong]="true" (click)="submit()" [disabled]="!title()">
            SAVE
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div style="padding-bottom: 20px;">
        <ion-item lines="full" style="--padding-start: 0;">
          <ion-label position="stacked" style="color: black !important; font-weight: 800 !important; font-size: 1.1rem !important;">
            Title *
          </ion-label>
          <ion-input
            [ngModel]="title()"
            (ngModelChange)="title.set($event)"
            placeholder="Name your task"
            style="color: black !important; font-size: 1.1rem !important; --padding-top: 15px;"
            required />
        </ion-item>

        <ion-item lines="full" style="--padding-start: 0; margin-top: 20px;">
          <ion-label position="stacked" style="color: black !important; font-weight: 800 !important; font-size: 1.1rem !important;">
            Description
          </ion-label>
          <ion-textarea
            [ngModel]="description()"
            (ngModelChange)="description.set($event)"
            placeholder="Add some details..."
            rows="6"
            style="color: black !important; font-size: 1rem !important; --padding-top: 15px;" />
        </ion-item>

        @if (categories.length > 0) {
          <ion-item lines="full" style="--padding-start: 0; margin-top: 20px;">
            <ion-label position="stacked" style="color: black !important; font-weight: 800 !important; font-size: 1.1rem !important;">
              Category
            </ion-label>
            <ion-select
              [ngModel]="selectedCategoryId()"
              (ngModelChange)="selectedCategoryId.set($event)"
              placeholder="Pick a category"
              interface="popover"
              style="color: black !important; font-weight: 600 !important; --padding-top: 15px;">
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
    ion-toolbar {
      --background: #000;
      --color: #fff;
    }
    ion-content {
      --background: #fff;
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
