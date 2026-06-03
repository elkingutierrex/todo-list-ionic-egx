import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isLoading = signal(false);

    constructor(private spinner: NgxSpinnerService) { }

    show() {
        this.isLoading.set(true);
        this.spinner.show();
    }

    hide() {
        this.isLoading.set(false);
        this.spinner.hide();
    }
}
