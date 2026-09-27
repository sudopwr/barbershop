import { Validator, slugify } from './validation.js';

export interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInput {
  name: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type CategoryUpdate = Partial<CategoryInput>;

/** A group of services on the menu, e.g. "Haircuts" or "Beard & Shave". */
export class Category {
  private constructor(private props: CategoryProps) {}

  static create(input: CategoryInput, id: string, now: Date = new Date()): Category {
    const data = Category.validate(input);
    return new Category({ id, ...data, createdAt: now, updatedAt: now });
  }

  /** Rebuilds an entity from persisted data without re-running creation rules. */
  static restore(props: CategoryProps): Category {
    return new Category({ ...props });
  }

  update(changes: CategoryUpdate, now: Date = new Date()): void {
    const merged: CategoryInput = {
      name: changes.name ?? this.props.name,
      description: changes.description ?? this.props.description,
      icon: changes.icon ?? this.props.icon,
      sortOrder: changes.sortOrder ?? this.props.sortOrder,
      isActive: changes.isActive ?? this.props.isActive,
    };
    this.props = { ...this.props, ...Category.validate(merged), updatedAt: now };
  }

  private static validate(input: CategoryInput) {
    const v = new Validator();
    const name = v.requireText('name', input.name, { min: 2, max: 60 });
    const description = v.optionalText('description', input.description, { max: 300 });
    const icon = v.optionalText('icon', input.icon, { max: 80 });
    const sortOrder = v.integer('sortOrder', input.sortOrder ?? 0, { min: 0, max: 9999 });
    const isActive = v.boolean('isActive', input.isActive, true);
    v.assertValid('Invalid category');
    return { name, slug: slugify(name), description, icon, sortOrder, isActive };
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get slug() { return this.props.slug; }
  get isActive() { return this.props.isActive; }
  get sortOrder() { return this.props.sortOrder; }

  toJSON(): CategoryProps {
    return { ...this.props };
  }
}
