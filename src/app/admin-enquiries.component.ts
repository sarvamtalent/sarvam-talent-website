import { DatePipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, switchMap, timeout } from 'rxjs/operators';
import { AdminService, Enquiry } from './admin.service';

@Component({
  selector: 'app-admin-enquiries',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './admin-enquiries.component.html',
  styleUrl: './admin.component.css'
})
export class AdminEnquiriesComponent implements OnInit, OnDestroy {
  enquiries: Enquiry[] = [];
  search = '';
  sort: 'asc' | 'desc' = 'desc';
  loading = false;
  deletingId: number | null = null;
  errorMessage = '';

  private readonly searchChanges = new Subject<void>();
  private searchSubscription?: Subscription;

  constructor(
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(() => false),
      switchMap(() => {
        this.loading = true;
        this.errorMessage = '';

        return this.adminService.getEnquiries(this.search, this.sort).pipe(
          timeout(8000),
          catchError((error: unknown) => {
            this.handleAdminError(error, 'Unable to load enquiries. Please check backend and try again.');
            return EMPTY;
          }),
          finalize(() => {
            this.loading = false;
          })
        );
      })
    ).subscribe((enquiries) => {
      this.enquiries = enquiries;
    });

    this.loadEnquiries();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  loadEnquiries(): void {
    this.searchChanges.next();
  }

  onSearchChange(): void {
    this.loadEnquiries();
  }

  deleteEnquiry(enquiry: Enquiry): void {
    const confirmed = window.confirm(`Delete enquiry from ${enquiry.name}?`);
    if (!confirmed) {
      return;
    }

    this.deletingId = enquiry.id;
    this.errorMessage = '';

    this.adminService.deleteEnquiry(enquiry.id).pipe(
      timeout(8000),
      finalize(() => {
        this.deletingId = null;
      })
    ).subscribe({
      next: () => {
        this.enquiries = this.enquiries.filter((item) => item.id !== enquiry.id);
      },
      error: (error: unknown) => {
        this.handleAdminError(error, 'Unable to delete this enquiry. Please try again.');
      }
    });
  }

  exportToExcel(): void {
    const rows = [
      ['Name', 'Email', 'Phone', 'Message', 'Date'],
      ...this.enquiries.map((enquiry) => [
        enquiry.name,
        enquiry.email,
        enquiry.phone ?? '',
        enquiry.message,
        this.formatDate(enquiry.createdAt)
      ])
    ];

    const csv = rows.map((row) => row.map((cell) => this.escapeCsv(cell)).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sarvam-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }

  trackById(_: number, enquiry: Enquiry): number {
    return enquiry.id;
  }

  private handleAdminError(error: unknown, fallbackMessage: string): void {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      this.adminService.logout();
      this.router.navigate(['/admin/login']);
      return;
    }

    this.errorMessage = fallbackMessage;
  }

  private formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }

  private escapeCsv(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
  }
}
