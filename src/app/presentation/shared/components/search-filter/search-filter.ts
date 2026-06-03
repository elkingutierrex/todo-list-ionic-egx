import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

export type SortOption = 'date-desc' | 'date-asc' | 'alphabetical' | 'status';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './search-filter.html',
  styleUrl: './search-filter.scss'
})
export class SearchFilterComponent {
  @Output() search = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<SortOption>();

  searchTerm = '';
  currentSort: SortOption = 'date-desc';

  onSearchChange(value: string) {
    this.search.emit(value);
  }

  setSort(option: SortOption) {
    this.currentSort = option;
    this.sortChange.emit(option);
  }

  getSortLabel(): string {
    switch (this.currentSort) {
      case 'date-desc': return 'Newest First';
      case 'date-asc': return 'Oldest First';
      case 'alphabetical': return 'A-Z';
      case 'status': return 'Status';
      default: return 'Sort';
    }
  }
}
