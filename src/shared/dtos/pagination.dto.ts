import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  page: number = 1; 

  @IsOptional()
  @IsNumberString()
  pageSize: number = 10; 
}
