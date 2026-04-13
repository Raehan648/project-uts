import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DzikirPage } from './dzikir.page';

describe('DzikirPage', () => {
  let component: DzikirPage;
  let fixture: ComponentFixture<DzikirPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DzikirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
