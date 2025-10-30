import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, {
    // ✨ Seulement lettres, chiffres, espaces, tirets
    message:
      'Le tag ne peut contenir que des lettres, chiffres, espaces et tirets',
  })
  name: string;
}
