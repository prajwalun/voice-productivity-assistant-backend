import { IsBoolean } from 'class-validator';

export class UpdateUserPreferenceDto {
  @IsBoolean()
  showTips: boolean;
}
