import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
  IonIcon, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions,
  IonItemOption, IonButton, IonButtons, IonSkeletonText, IonText,
  AlertController, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create, arrowBack } from 'ionicons/icons';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';
import { CategoryFormModalComponent } from '../category-form-modal/category-form-modal.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
    IonIcon, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions,
    IonItemOption, IonButton, IonButtons, IonSkeletonText, IonText
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  categories = this.categoryService.categories;
  isLoading = signal(true);

  constructor() {
    addIcons({ add, trash, create, arrowBack });
  }

  ngOnInit(): void {
    this.categoryService.loadCategories();
    setTimeout(() => this.isLoading.set(false), 500);
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  async onDelete(category: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete Category',
      message: `Delete "${category.name}"? Tasks in this category will keep their ID but lose the association.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.categoryService.deleteCategory(category.id).subscribe(),
        },
      ],
    });
    await alert.present();
  }

  async openCategoryModal(category?: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CategoryFormModalComponent,
      componentProps: { category },
      breakpoints: [0, 0.6],
      initialBreakpoint: 0.6,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data) return;

    if (category) {
      this.categoryService.updateCategory({ ...category, ...data }).subscribe();
    } else {
      this.categoryService.addCategory(data).subscribe();
    }
  }

  trackByCategoryId(_: number, cat: Category): string {
    return cat.id;
  }
}
