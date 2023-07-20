import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appDivfocusout]'
})
export class DivfocusoutDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click',['$event'])
  onClick(e){
    this.el.nativeElement.style.outline = 'none';
  }
}