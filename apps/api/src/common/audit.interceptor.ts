import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

const MUTATING = ['POST', 'PUT', 'PATCH', 'DELETE'];

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogs: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    return next.handle().pipe(
      tap(async () => {
        if (!MUTATING.includes(method)) return;
        const user = req.user || null;
        const tenant = req.tenant || req.school || user?.school || null;
        const entity = this.entityFromPath(req.path);
        const entityId = req.params?.id || req.params?.slug || null;
        const action = `${method} ${req.path}`;
        const metadata = this.safeMetadata(req.body);
        try {
          await this.auditLogs.log(
            tenant?.id || user?.schoolId || null,
            user?.id || null,
            action,
            entity,
            entityId,
            metadata,
            req.ip || req.headers['x-forwarded-for']?.toString() || null,
            req.headers['user-agent']?.toString() || null,
          );
        } catch {}
      }),
    );
  }

  private entityFromPath(path: string): string {
    const parts = path.split('/').filter(Boolean);
    return parts[0] || 'unknown';
  }

  private safeMetadata(body: any): any {
    if (!body || typeof body !== 'object') return undefined;
    const clone = { ...body };
    delete clone.password;
    delete clone.passwordHash;
    delete clone.newPassword;
    delete clone.totpCode;
    delete clone.token;
    return clone;
  }
}
