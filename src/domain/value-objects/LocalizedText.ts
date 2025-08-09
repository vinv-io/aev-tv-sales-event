export class LocalizedText {
  constructor(
    public readonly en: string,
    public readonly vi: string
  ) {
    if (!en.trim() || !vi.trim()) {
      throw new Error('Both English and Vietnamese text must be provided and non-empty');
    }
  }

  public getText(locale: 'en' | 'vi'): string {
    return locale === 'vi' ? this.vi : this.en;
  }

  public toPlainObject(): { en: string; vi: string } {
    return {
      en: this.en,
      vi: this.vi
    };
  }

  public static fromPlainObject(obj: { en: string; vi: string } | string): LocalizedText {
    if (typeof obj === 'string') {
      // Fallback for legacy string-only fields
      return new LocalizedText(obj, obj);
    }
    return new LocalizedText(obj.en, obj.vi);
  }

  public equals(other: LocalizedText): boolean {
    return this.en === other.en && this.vi === other.vi;
  }
}
