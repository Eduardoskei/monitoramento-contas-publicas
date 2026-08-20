import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
import { envSchema } from './env/env';
import { HttpModule } from './http/http.module';
import { TraceIdMiddleware } from './http/middleware/trace-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (environment) => envSchema.parse(environment),
    }),
    EnvModule,
    ThrottlerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => [
        {
          ttl: env.get('THROTTLE_TTL_MS'),
          limit: env.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    HttpModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceIdMiddleware).forRoutes({
      path: '*splat',
      method: RequestMethod.ALL,
    });
  }
}
