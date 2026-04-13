import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuranDetailPage } from './quran-detail.page';

describe('QuranDetailPage', () => {
  let component: QuranDetailPage;
  let fixture: ComponentFixture<QuranDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuranDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
