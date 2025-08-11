import { LocalizedText } from '../value-objects/LocalizedText';

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: LocalizedText,
    public readonly description: LocalizedText,
    public readonly image: string
  ) {
    if (!id.trim()) {
      throw new Error('Product ID cannot be empty');
    }
    if (!image.trim()) {
      throw new Error('Product image URL cannot be empty');
    }
  }

  public update(updates: Partial<{
    name: LocalizedText;
    description: LocalizedText;
    image: string;
  }>): Product {
    return new Product(
      this.id,
      updates.name ?? this.name,
      updates.description ?? this.description,
      updates.image ?? this.image
    );
  }

  public getDisplayName(locale: 'en' | 'vi'): string {
    return this.name.getText(locale);
  }

  public getDisplayDescription(locale: 'en' | 'vi'): string {
    return this.description.getText(locale);
  }

  public hasValidImage(): boolean {
    try {
      new URL(this.image);
      return true;
    } catch {
      return false;
    }
  }

  public toPlainObject() {
    return {
      id: this.id,
      name: this.name.toPlainObject(),
      description: this.description.toPlainObject(),
      image: this.image
    };
  }

  public static fromPlainObject(obj: any): Product {
    return new Product(
      obj.id,
      LocalizedText.fromPlainObject(obj.name),
      LocalizedText.fromPlainObject(obj.description),
      obj.image || 'https://placehold.co/600x400.png'
    );
  }
}
