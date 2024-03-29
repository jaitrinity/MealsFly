import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineMessageComponent } from './offline-message.component';

describe('OfflineMessageComponent', () => {
  let component: OfflineMessageComponent;
  let fixture: ComponentFixture<OfflineMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
