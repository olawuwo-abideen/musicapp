import {
    IsArray,
    IsDateString,
    IsMilitaryTime,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateSongDTO {
    @IsString()
    @IsNotEmpty()
    title : string;
  
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
     artists;
  
    @IsNotEmpty()
    @IsDateString()
     releasedDate: Date;
  
    @IsMilitaryTime()
    @IsNotEmpty()
     duration: Date;
  
    @IsString()
    @IsOptional()
    readonly lyrics: string;
  }
  
  export class UpdateSongDto {
    @IsString()
    @IsOptional()
    readonly title: string;
  
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    readonly artists;
  
    @IsDateString()
    @IsOptional()
    readonly releasedDate: Date;
  
    @IsMilitaryTime()
    @IsOptional()
    readonly duration: Date;
  
    @IsString()
    @IsOptional()
    readonly lyrics: string;
  }