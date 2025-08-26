import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CounterService {
  private readonly COUNTER_KEY = 'counter';

  constructor(private readonly redisService: RedisService) {}

  async increment(): Promise<number> {
    const client = this.redisService.getClient();
    return await client.incr(this.COUNTER_KEY);
  }

  async decrement(): Promise<number> {
    const client = this.redisService.getClient();
    return await client.decr(this.COUNTER_KEY);
  }

  async getCounter(): Promise<number> {
    const client = this.redisService.getClient();
    const value = await client.get(this.COUNTER_KEY);
    return value ? parseInt(value, 10) : 0;
  }

  async setCounter(newCount: number): Promise<number> {
    const client = this.redisService.getClient();
    await client.set(this.COUNTER_KEY, newCount);
    const value = await client.get(this.COUNTER_KEY);
    return value ? parseInt(value, 10) : 0;
  }
}
