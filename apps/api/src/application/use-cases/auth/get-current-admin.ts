import { UnauthorizedError } from '../../../domain/errors/index.js';
import type { AdminRepository } from '../../../domain/repositories/index.js';

export class GetCurrentAdmin {
  constructor(private readonly admins: AdminRepository) {}

  async execute(adminId: string) {
    const admin = await this.admins.findById(adminId);
    if (!admin) throw new UnauthorizedError('Session is no longer valid');
    return admin.toPublic();
  }
}
