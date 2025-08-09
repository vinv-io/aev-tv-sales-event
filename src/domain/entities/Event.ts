import { EventType } from '../value-objects/EventType';
import { DateRange } from '../value-objects/DateRange';
import { LocalizedText } from '../value-objects/LocalizedText';

export class Event {
  constructor(
    public readonly id: string,
    public readonly name: LocalizedText,
    public readonly type: EventType,
    public readonly dateRange: DateRange,
    public readonly status: boolean,
    public readonly description?: LocalizedText,
    public readonly image?: string,
    public readonly aiHint?: string
  ) {}

  public isActive(): boolean {
    return this.status && this.dateRange.isCurrentlyActive();
  }

  public canAcceptOrders(): boolean {
    return this.isActive() && this.type !== EventType.EXPIRED;
  }

  public update(updates: Partial<{
    name: LocalizedText;
    type: EventType;
    dateRange: DateRange;
    status: boolean;
    description: LocalizedText;
    image: string;
    aiHint: string;
  }>): Event {
    return new Event(
      this.id,
      updates.name ?? this.name,
      updates.type ?? this.type,
      updates.dateRange ?? this.dateRange,
      updates.status ?? this.status,
      updates.description ?? this.description,
      updates.image ?? this.image,
      updates.aiHint ?? this.aiHint
    );
  }

  public toPlainObject() {
    return {
      id: this.id,
      name: this.name.toPlainObject(),
      type: this.type.value,
      startDate: this.dateRange.startDate,
      endDate: this.dateRange.endDate,
      status: this.status,
      description: this.description?.toPlainObject(),
      image: this.image,
      aiHint: this.aiHint
    };
  }
}
