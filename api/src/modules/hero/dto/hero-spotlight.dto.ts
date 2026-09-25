import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum HeroPriority {
  P0 = 'P0', // Critical / Institution-level announcement
  P1 = 'P1', // Flagship GEC initiative
  P2 = 'P2', // Major event / major application window
  P3 = 'P3', // Major achievement / milestone
  P4 = 'P4', // General announcement
  P5 = 'P5', // Regular content
}

export enum HeroLifecycleState {
  ANNOUNCEMENT = 'Announcement',
  APPLICATIONS_OPEN = 'Applications Open',
  URGENCY = 'Urgency',
  LIVE = 'Live',
  COMPLETED = 'Completed',
  STORIES = 'Stories',
}

export class HeroVisualAssetsDto {
  @ApiProperty({ example: 'https://media.gec.org/posters/campaign-16-9.mp4', required: false })
  @IsString()
  @IsOptional()
  videoDesktopUrl?: string;

  @ApiProperty({ example: 'https://media.gec.org/posters/campaign-9-16.mp4', required: false })
  @IsString()
  @IsOptional()
  videoMobileUrl?: string;

  @ApiProperty({ example: 'https://media.gec.org/posters/campaign-desktop.jpg' })
  @IsString()
  @IsNotEmpty()
  staticDesktopUrl: string;

  @ApiProperty({ example: 'https://media.gec.org/posters/campaign-mobile.jpg' })
  @IsString()
  @IsNotEmpty()
  staticMobileUrl: string;
}

export class CreateHeroSpotlightDto {
  @ApiProperty({ example: 'SDP 2026 Launch Campaign' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: HeroPriority, example: HeroPriority.P1 })
  @IsEnum(HeroPriority)
  priority: HeroPriority;

  @ApiProperty({ enum: HeroLifecycleState, example: HeroLifecycleState.APPLICATIONS_OPEN })
  @IsEnum(HeroLifecycleState)
  lifecycleState: HeroLifecycleState;

  @ApiProperty({ example: 'STARTUP DEVELOPMENT PROGRAM 2026' })
  @IsString()
  @IsNotEmpty()
  headline: string;

  @ApiProperty({ example: 'Have an idea? Let us see how far you can take it.' })
  @IsString()
  @IsNotEmpty()
  shortContext: string;

  @ApiProperty({ example: 'Applications close 28 September.', required: false })
  @IsString()
  @IsOptional()
  statusTag?: string;

  @ApiProperty({ type: HeroVisualAssetsDto })
  @IsObject()
  visualAssets: HeroVisualAssetsDto;

  @ApiProperty({ example: { label: 'Apply Now', url: '/initiatives/sdp-2026/apply' } })
  @IsObject()
  primaryCta: { label: string; url: string };

  @ApiProperty({ example: { label: 'Explore Program', url: '/initiatives/sdp-2026' }, required: false })
  @IsObject()
  @IsOptional()
  secondaryCta?: { label: string; url: string };

  @ApiProperty({ example: '2026-09-01T00:00:00Z', required: false })
  @IsString()
  @IsOptional()
  startsAt?: string;

  @ApiProperty({ example: '2026-09-28T23:59:59Z', required: false })
  @IsString()
  @IsOptional()
  expiresAt?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateHeroSpotlightDto extends CreateHeroSpotlightDto {}
