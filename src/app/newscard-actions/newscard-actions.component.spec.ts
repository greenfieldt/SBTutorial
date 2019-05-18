import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewscardActionsComponent } from './newscard-actions.component';

describe('NewscardActionsComponent', () => {
  let component: NewscardActionsComponent;
  let fixture: ComponentFixture<NewscardActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewscardActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewscardActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
