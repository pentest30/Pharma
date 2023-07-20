import { AfterContentInit, Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
@Directive({
    selector: '[appAutoFocus]'
  })
  export class AppAutofocusDirective implements AfterContentInit {
    private _autofocus;
    @Input() set appAutoFocus(condition: boolean)
    {
        this._autofocus = condition != false;
    }
    
    constructor(private host: ElementRef) {}
  
    public ngAfterContentInit() {
      setTimeout(()=>{
        if (this._autofocus || typeof this._autofocus === "undefined")
      this.host.nativeElement.focus();},500);
    }

  }