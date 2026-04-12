import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {

    @IsString({ message: 'Title must be a string' })
    title!: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;


    @IsOptional()
    @IsBoolean({ message: 'Completed must be a boolean' })
    completed?: boolean;
}
