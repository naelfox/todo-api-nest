import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

const createDeferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
};

describe('TasksService', () => {
  let service: TasksService;
  const prismaMock = {
    task: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('waits for Prisma to persist the update before returning success', async () => {
    const deferred = createDeferred<{ id: string; completed: boolean }>();
    prismaMock.task.update.mockReturnValueOnce(deferred.promise);

    let resolvedValue: string | undefined;
    const updatePromise = service
      .update('task-1', { completed: true })
      .then((value) => {
        resolvedValue = value;
      });

    await Promise.resolve();

    expect(resolvedValue).toBeUndefined();
    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { completed: true },
    });

    deferred.resolve({ id: 'task-1', completed: true });

    await updatePromise;

    expect(resolvedValue).toBe('Registro atualizado com sucesso');
  });
});
