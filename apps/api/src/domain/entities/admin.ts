export interface AdminProps {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

/** The single shop owner who manages the catalog. */
export class Admin {
  private constructor(private props: AdminProps) {}

  static restore(props: AdminProps): Admin {
    return new Admin({ ...props });
  }

  static normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }

  recordLogin(now: Date = new Date()): void {
    this.props = { ...this.props, lastLoginAt: now };
  }

  get id() { return this.props.id; }
  get username() { return this.props.username; }
  get passwordHash() { return this.props.passwordHash; }
  get lastLoginAt() { return this.props.lastLoginAt; }

  /** Public view — never exposes the password hash. */
  toPublic(): { id: string; username: string; lastLoginAt: string | null } {
    return {
      id: this.props.id,
      username: this.props.username,
      lastLoginAt: this.props.lastLoginAt ? this.props.lastLoginAt.toISOString() : null,
    };
  }

  toJSON(): AdminProps {
    return { ...this.props };
  }
}
