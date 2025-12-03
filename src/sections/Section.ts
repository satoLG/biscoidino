// Section base class
export abstract class Section {
  protected element: HTMLElement | null = null;
  protected isActive = false;

  abstract render(): string;
  
  init(): void {
    // Override in subclasses if needed
  }
  
  activate(): void {
    this.isActive = true;
    this.element?.classList.add('active');
  }
  
  deactivate(): void {
    this.isActive = false;
    this.element?.classList.remove('active');
  }
  
  cleanup(): void {
    // Override in subclasses if needed
  }
}
