import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { PresignUploadDto, CompleteUploadDto, BucketClass } from './dto/media.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/constants/roles.enum';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Media & Uploads')
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('v1/uploads/presign')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.MEDIA_UPLOAD)
  @ApiOperation({ summary: 'Generate short-lived presigned PUT URL for Cloudflare R2 direct upload' })
  async presign(
    @Body() dto: PresignUploadDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.mediaService.presignUpload(dto, user.id);
  }

  @Post('v1/uploads/complete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.MEDIA_UPLOAD)
  @ApiOperation({ summary: 'Verify R2 object and record asset metadata' })
  async complete(
    @Body() dto: CompleteUploadDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.mediaService.completeUpload(dto, user.id);
  }

  @Get('v1/uploads/download-url')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.MEDIA_MANAGE)
  @ApiOperation({ summary: 'Generate signed download URL for private submission item' })
  async getDownloadUrl(
    @Query('key') key: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.mediaService.getDownloadUrl(key, user.id);
  }

  @Get('v1/cms/media')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.MEDIA_MANAGE)
  @ApiOperation({ summary: 'List and filter media assets in library' })
  async listMedia(
    @Query('bucketClass') bucketClass?: BucketClass,
    @Query('purpose') purpose?: string,
  ) {
    return this.mediaService.listMedia(bucketClass, purpose);
  }
}
