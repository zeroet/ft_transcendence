import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: 'id',
  })
  id: number;

  @ApiProperty({
    required: true,
    example: 'cjung-mo',
    description: 'intra_id',
  })
  intra_id: string;

  @ApiProperty({
    required: true,
    example: 'cjung-mo@student.42.fr',
    description: 'email',
  })
  email: string;

  @ApiProperty({
    required: true,
    example:
      'https://cdn.intra.42.fr/users/a74759faaa286d38f1362d6638daf1c0/cjung-mo.jpg',
    description: 'image_url',
  })
  image_url: string;

  @ApiProperty({
    required: true,
    example: 'jungmoo cheon',
    description: 'username',
  })
  username: string;

  @ApiProperty({
    required: false,
    example: 'NUGQEHCBAAERQBQ6',
    description: 'two_factor_secret',
  })
  two_factor_secret: string;
}
