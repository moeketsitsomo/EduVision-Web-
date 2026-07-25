import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchoolsModule } from './schools/schools.module';
import { UsersModule } from './users/users.module';
import { PagesModule } from './pages/pages.module';
import { PostsModule } from './posts/posts.module';
import { StaffModule } from './staff/staff.module';
import { EventsModule } from './events/events.module';
import { GalleriesModule } from './galleries/galleries.module';
import { MediaModule } from './media/media.module';
import { DownloadsModule } from './downloads/downloads.module';
import { ContactsModule } from './contacts/contacts.module';
import { SocialsModule } from './socials/socials.module';
import { FeesModule } from './fees/fees.module';
import { NavigationModule } from './navigation/navigation.module';
import { StudentsModule } from './students/students.module';
import { NoticesModule } from './notices/notices.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { ResultsModule } from './results/results.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { InvoicesModule } from './invoices/invoices.module';
import { LicensesModule } from './licenses/licenses.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { StorageModule } from './storage/storage.module';
import { TenantModule } from './tenant/tenant.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { AuditInterceptor } from './common/audit.interceptor';
import { SubscriptionGuard } from './common/subscription.guard';
import { PublicModule } from './public/public.module';
import { PortalModule } from './portal/portal.module';
import { EmailModule } from './email/email.module';
import { LoggerModule } from './logger/logger.module';
import { AllExceptionsFilter } from './logger/all-exceptions.filter';
import { CacheModule } from './cache/cache.module';
import { SetupModule } from './setup/setup.module';

const auditProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: AuditInterceptor,
};

const exceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: AllExceptionsFilter,
};

const subscriptionGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: SubscriptionGuard,
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    CacheModule,
    LoggerModule,
    PrismaModule,
    StorageModule,
    TenantModule,
    EmailModule,
    AuthModule,
    UsersModule,
    SchoolsModule,
    PagesModule,
    PostsModule,
    StaffModule,
    EventsModule,
    GalleriesModule,
    MediaModule,
    DownloadsModule,
    ContactsModule,
    SocialsModule,
    FeesModule,
    NavigationModule,
    StudentsModule,
    NoticesModule,
    AdmissionsModule,
    ResultsModule,
    AttendanceModule,
    SubscriptionsModule,
    InvoicesModule,
    LicensesModule,
    AuditLogsModule,
    SuperAdminModule,
    PublicModule,
    PortalModule,
    SetupModule,
  ],
  controllers: [HealthController],
  providers: [auditProvider, exceptionFilterProvider, subscriptionGuardProvider, HealthService],
})
export class AppModule {}
