import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health & Diagnostics')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @ApiOperation({ summary: 'Process liveness check' })
  @ApiResponse({ status: 200, description: 'Service process is alive' })
  getLive() {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check for database and core dependencies' })
  @ApiResponse({ status: 200, description: 'Dependencies are ready' })
  @ApiResponse({ status: 503, description: 'One or more dependencies are down' })
  async getReady(@Res({ passthrough: true }) res: Response) {
    const ready = await this.healthService.getReadiness();
    if (ready.status !== 'ok') {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
    return ready;
  }
}
