import {
  Controller,
  Post,
  Get,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { CounterService } from './counter.service';

@Controller('counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Post('increment')
  async increment(): Promise<{ count: number }> {
    const count = await this.counterService.increment();
    return { count };
  }

  @Post('decrement')
  async decrement(): Promise<{ count: number }> {
    const count = await this.counterService.decrement();
    return { count };
  }

  @Post()
  async setCounter(
    @Body() counter: { counter: number },
  ): Promise<{ count: number }> {
    if (!counter.counter) {
      throw new BadRequestException('Missing counter field');
    }
    if (isNaN(counter.counter)) {
      throw new BadRequestException('counter should be a number');
    }
    const count = await this.counterService.setCounter(counter.counter);
    return { count };
  }

  @Get()
  async getCounter(): Promise<{ count: number }> {
    const count = await this.counterService.getCounter();
    return { count };
  }
}
