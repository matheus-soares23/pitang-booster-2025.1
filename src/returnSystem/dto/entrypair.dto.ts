import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class entryPairDto {
    @IsNumber()
    @Min(0, { message: 'O valor inicial deve ser maior ou igual a 0' })
    start: number;

    @IsNumber()
    @Min(0, { message: 'O valor final deve ser maior ou igual a 0' })
    end: number;

    @IsString()
    operation: string;

    @IsOptional()
    @IsNumber()
    @Min(1000, { message: 'Tamanho do chunk deve ser pelo menos 1000' })
    @Max(1000000, { message: 'Tamanho do chunk não pode exceder 1.000.000' })
    chunkSize?: number;
}