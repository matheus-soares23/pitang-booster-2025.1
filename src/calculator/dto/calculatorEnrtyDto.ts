import { IsNotEmpty, IsString } from 'class-validator';

export class calculatorEntryDto {
    @IsNotEmpty({ message: 'A expressão não pode estar vazia' })
    @IsString({ message: 'A expressão deve ser uma string' })
    expression: string;
}