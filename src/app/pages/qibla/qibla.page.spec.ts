import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QiblaPage } from './qibla.page';

describe('QiblaPage', () => {
  let component: QiblaPage;
  let fixture: ComponentFixture<QiblaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QiblaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
