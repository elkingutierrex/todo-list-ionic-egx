import { Component, Input, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonButtons,
  IonIcon, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, textOutline, documentTextOutline, pricetagOutline } from 'ionicons/icons';
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
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.scss'
})
export class TaskFormModalComponent implements OnInit {
  @Input() task?: Task;
  @Input() categories: Category[] = [];

  private modalCtrl = inject(ModalController);

  title = signal('');
  description = signal('');
  selectedCategoryId = signal<string | null | undefined>(null);

  constructor() {
    addIcons({ close, textOutline, documentTextOutline, pricetagOutline });
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
