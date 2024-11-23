import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBannerComponent } from './admin-banner.component';

describe('AdminBannerComponent', () => {
  let component: AdminBannerComponent;
  let fixture: ComponentFixture<AdminBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBannerComponent]
    });
    fixture = TestBed.createComponent(AdminBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
