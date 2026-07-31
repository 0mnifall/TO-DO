import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pager',
  imports: [],
  templateUrl: './pager.html',
  styleUrl: './pager.css',
})
export class Pager {
  currentPage = input<number>(1);
  totalPages = input<number>(1);

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();

    const pages: (number | '...')[] = [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    pages.push(1);

    if (current > 4) {
      pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (current < total - 3) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  });

  pageChanged = output<number>();
}
