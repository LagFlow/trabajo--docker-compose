import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ConfigModule.forRoot(), RedisModule],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}
