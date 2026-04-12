// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Torna o serviço disponível globalmente (opcional, mas recomendado)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}