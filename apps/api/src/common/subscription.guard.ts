import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return true;

    const school = user.school || req.school;
    if (!school) return true;

    if (user.role === 'SUPER_ADMIN') return true;

    const blocked = ['SUSPENDED', 'CANCELLED', 'EXPIRED'];
    if (blocked.includes(school.subscriptionStatus) && school.slug !== 'platform') {
      throw new ForbiddenException('School subscription is not active. Please contact support.');
    }

    return true;
  }
}
