import { Validator } from './validation.js';

export interface ServiceProps {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceInput {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export type ServiceUpdate = Partial<ServiceInput>;

/** One bookable item on the price list, e.g. "Skin Fade — ₹450 — 45 min". */
export class Service {
  static readonly MAX_DURATION_MINUTES = 480;

  private constructor(private props: ServiceProps) {}

  static create(input: ServiceInput, id: string, now: Date = new Date()): Service {
    return new Service({ id, ...Service.validate(input), createdAt: now, updatedAt: now });
  }

  static restore(props: ServiceProps): Service {
    return new Service({ ...props });
  }

  update(changes: ServiceUpdate, now: Date = new Date()): void {
    const current = this.props;
    const merged: ServiceInput = {
      categoryId: changes.categoryId ?? current.categoryId,
      name: changes.name ?? current.name,
      description: changes.description ?? current.description,
      price: changes.price ?? current.price,
      durationMinutes: changes.durationMinutes ?? current.durationMinutes,
      imageUrl: changes.imageUrl ?? current.imageUrl,
      isFeatured: changes.isFeatured ?? current.isFeatured,
      isActive: changes.isActive ?? current.isActive,
      sortOrder: changes.sortOrder ?? current.sortOrder,
    };
    this.props = { ...current, ...Service.validate(merged), updatedAt: now };
  }

  private static validate(input: ServiceInput) {
    const v = new Validator();
    const categoryId = v.requireText('categoryId', input.categoryId, { max: 64 });
    const name = v.requireText('name', input.name, { min: 2, max: 80 });
    const description = v.optionalText('description', input.description, { max: 500 });
    const price = v.money('price', input.price);
    const durationMinutes = v.integer('durationMinutes', input.durationMinutes, {
      min: 5,
      max: Service.MAX_DURATION_MINUTES,
    });
    const imageUrl = v.optionalUrl('imageUrl', input.imageUrl);
    const isFeatured = v.boolean('isFeatured', input.isFeatured, false);
    const isActive = v.boolean('isActive', input.isActive, true);
    const sortOrder = v.integer('sortOrder', input.sortOrder ?? 0, { min: 0, max: 9999 });
    v.assertValid('Invalid service');
    return { categoryId, name, description, price, durationMinutes, imageUrl, isFeatured, isActive, sortOrder };
  }

  get id() { return this.props.id; }
  get categoryId() { return this.props.categoryId; }
  get name() { return this.props.name; }
  get price() { return this.props.price; }
  get isActive() { return this.props.isActive; }
  get isFeatured() { return this.props.isFeatured; }
  get sortOrder() { return this.props.sortOrder; }

  toJSON(): ServiceProps {
    return { ...this.props };
  }
}
