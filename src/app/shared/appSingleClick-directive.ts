import {Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';

@Directive({
  selector: '[appSingleClick]'
})
export class SingleClickDirective implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input()
  throttleMillis = 1500;

  @Output()
  singleClick = new EventEmitter();

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.subscription = fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(throttleTime(this.throttleMillis))
      .subscribe((v) => {
        this.singleClick.emit(v);
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.singleClick.unsubscribe();
  }

}