import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 'Update SDP 2026 application form', required: false })
  @IsString()
  @IsOptional()
  title?: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'Help me draft an announcement for the Ideathon 2026 initiative' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'initiatives', required: false })
  @IsString()
  @IsOptional()
  currentScreen?: string;

  @ApiProperty({ example: 'gemini-2.0-flash', required: false })
  @IsString()
  @IsOptional()
  model?: string;
}

export class ConfirmActionDto {
  @ApiProperty({ description: 'One-time confirmation token issued in proposal event' })
  @IsString()
  @IsNotEmpty()
  confirmationToken: string;

  @ApiProperty({ example: 'idemp_key_12345678', description: 'Idempotency key to avoid re-execution' })
  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;
}
