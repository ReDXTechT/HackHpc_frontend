import {Directive, ElementRef, HostListener, Input, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appChangeBg]'
})
export class ChangeBgDirective {

  @Input() isCorrect: boolean = false;
  @Input() selected: boolean = false;
  @Input() verified: boolean = false;
  @Input() selectedClass: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {

    if (!this.selected) {
      this.renderer.setStyle(this.el.nativeElement,'background','rgba(255,255,255,0.53)');
      this.renderer.setStyle(this.el.nativeElement,'color','#000');
      this.renderer.setStyle(this.el.nativeElement,'border','3px solid #ddd');
    }else {
      this.renderer.addClass(this.el.nativeElement, this.selectedClass);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && !changes.selected.firstChange) {
      if (this.selected && this.verified) {
        if (this.isCorrect) {
          this.renderer.setStyle(this.el.nativeElement, 'background', 'green');
          this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
        } else {
          this.renderer.setStyle(this.el.nativeElement, 'background', 'red');
          this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
        }
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'background', 'lightgray');
        this.renderer.setStyle(this.el.nativeElement, 'color', '');
        this.renderer.setStyle(this.el.nativeElement, 'border', '');
      }
      if(!this.selected){
        this.renderer.setStyle(this.el.nativeElement, 'background', 'rgba(255,255,255,0.53)');
        this.renderer.setStyle(this.el.nativeElement, 'color', '#000');
        this.renderer.setStyle(this.el.nativeElement, 'border', '');
      }

    }
  }
}
