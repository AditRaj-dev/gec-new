import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CopilotService } from './copilot.service';
import {
  CreateConversationDto,
  SendMessageDto,
  ConfirmActionDto,
} from './dto/copilot.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('CMS Gemini Copilot Orchestration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('v1/cms/copilot')
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Post('conversations')
  @RequirePermissions(Permission.COPILOT_USE)
  @ApiOperation({ summary: 'Create seven-day copilot conversation' })
  async createConversation(
    @Body() dto: CreateConversationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.copilotService.createConversation(dto.title, user.id);
  }

  @Get('conversations/:id')
  @RequirePermissions(Permission.COPILOT_USE)
  @ApiOperation({ summary: 'Read active conversation and proposals' })
  async getConversation(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.copilotService.getConversation(id, user.id);
  }

  @Delete('conversations/:id')
  @RequirePermissions(Permission.COPILOT_USE)
  @ApiOperation({ summary: 'Delete conversation and transient context early' })
  async deleteConversation(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.copilotService.deleteConversation(id, user.id);
  }

  @Post('conversations/:id/messages')
  @RequirePermissions(Permission.COPILOT_USE)
  @ApiOperation({ summary: 'Submit task turn and stream model events (SSE)' })
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    return this.copilotService.streamMessage(id, dto, user.id, res);
  }

  @Post('actions/:id/confirm')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.COPILOT_CONFIRM)
  @ApiOperation({ summary: 'Consume one-time confirmation token and execute mutating proposal' })
  async confirmAction(
    @Param('id') id: string,
    @Body() dto: ConfirmActionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.copilotService.confirmAction(id, dto, user.id);
  }
}
