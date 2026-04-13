import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class TasksService {

  constructor(private readonly prisma: PrismaService) {}


  async create(createTaskDto: CreateTaskDto) {
    if (!createTaskDto?.title) {
      throw new BadRequestException('Request body must include title');
    }

    return this.prisma.task.create({ data: createTaskDto });
  }

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: string) {
   const task = await this.prisma.task.findUnique({ where: { id } });
   if (!task) {
     throw new NotFoundException(`Task with ID ${id} not found`);
   }
   return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    if (!updateTaskDto || Object.keys(updateTaskDto).length === 0) {
      throw new BadRequestException(
        'Request body must include at least one field to update',
      );
    }

    this.prisma.task.update({ where: { id }, data: updateTaskDto });

    return 'Registro atualizado com sucesso';
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
