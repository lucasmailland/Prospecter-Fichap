import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiResponse({ status: 200, description: 'Tareas obtenidas exitosamente' })
  async findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  async create(@Body() taskData: any) {
    return this.tasksService.create(taskData);
  }
} 