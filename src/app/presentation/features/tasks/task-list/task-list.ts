import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
  IonIcon, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions,
  IonItemOption, IonBadge, IonButton, IonButtons, IonChip, IonSearchbar,
  IonSkeletonText, IonNote, IonText, AlertController, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create, checkmarkCircle, ellipseOutline, logOut, pricetag, filter } from 'ionicons/icons';
import { TaskService } from '../../../../core/services/task.service';
import { CategoryService } from '../../../../core/services/category.service';
import { FeatureFlagService } from '../../../../core/services/feature-flag.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Task } from '../../../../core/models/task.model';
import { FEATURE_FLAG_KEYS } from '../../../../core/models/feature-flag.model';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
    IonIcon, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions,
    IonItemOption, IonBadge, IonButton, IonButtons, IonChip,
    IonSkeletonText, IonNote, IonText
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);
  private featureFlagService = inject(FeatureFlagService);
  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  tasks = this.taskService.filteredTasks;
  categories = this.categoryService.categories;
  pendingCount = this.taskService.pendingCount;
  selectedCategoryId = this.taskService.selectedCategoryId;
  currentUser = this.authService.currentUser;
  categoryMap = this.categoryService.categoryMap;
  isLoading = signal(true);

  categoriesEnabled = computed(() =>
    this.featureFlagService.isEnabled(FEATURE_FLAG_KEYS.CATEGORY_FEATURE)
  );

  constructor() {
    addIcons({ add, trash, create, checkmarkCircle, ellipseOutline, logOut, pricetag, filter });
  }

  ngOnInit(): void {
    this.taskService.loadTasks();
    this.featureFlagService.loadFlags();
    if (this.featureFlagService.isEnabled(FEATURE_FLAG_KEYS.CATEGORY_FEATURE)) {
      this.categoryService.loadCategories();
    }
    setTimeout(() => this.isLoading.set(false), 600);
  }

  filterByCategory(id: string | null): void {
    this.taskService.filterByCategory(id);
  }

  onToggle(task: Task): void {
    this.taskService.toggleTaskCompletion(task).subscribe();
  }

  async onDelete(task: Task): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.taskService.deleteTask(task.id).subscribe(),
        },
      ],
    });
    await alert.present();
  }

  async openTaskModal(task?: Task): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskFormModalComponent,
      componentProps: { task, categories: this.categories() },
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data) return;

    if (data.task) {
      this.taskService.updateTask(data.task).subscribe();
    } else {
      this.taskService.addTask(data).subscribe();
    }
  }

  async logout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Logout', handler: () => this.router.navigate(['/login']) },
      ],
    });
    await alert.present();
  }

  navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }

  trackByTaskId(_: number, task: Task): string {
    return task.id;
  }
}
