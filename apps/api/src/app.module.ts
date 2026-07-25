import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { StorageModule } from './storage/storage.module';
import { TenantModule } from './tenant/tenant.module';
import { HealthController } from './health/health.controller';
import { AuditInterceptor } from './common/audit.interceptor';
import { PublicModule } from './public/public.module';

const auditProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: AuditInterceptor,
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    PrismaModule,
    StorageModule,
    TenantModule,
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
    AuditLogsModule,
    SuperAdminModule,
    PublicModule,
  ],
  controllers: [HealthController],
  providers: [auditProvider],
})
export class AppModule {}
