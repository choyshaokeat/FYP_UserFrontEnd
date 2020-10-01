import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appColor]'
})
export class ColorDirective {

  constructor(private el: ElementRef) { }

  @Input() defaultColor: string;
  @Input('appColor') appColor: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('black', 'white', 'bg-dark');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null, null, 'text-dark');
  }

  private highlight(backgroundColor: string, textColor: string, className: string) {
    // this.el.nativeElement.style.backgroundColor = backgroundColor;
    this.el.nativeElement.style.color = textColor;
    this.el.nativeElement.className = className;
  }

}
