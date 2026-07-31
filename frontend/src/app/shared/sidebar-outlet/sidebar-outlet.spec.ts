import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarOutlet } from './sidebar-outlet';

describe('TaskFilters', () => {
  let component: SidebarOutlet;
  let fixture: ComponentFixture<SidebarOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarOutlet],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarOutlet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
