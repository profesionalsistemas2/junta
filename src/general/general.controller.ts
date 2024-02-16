import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ValidationPipe,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GeneralService } from './general.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateParametrosDto } from './dto/update-parameter.dto';
import { CreateParametrosDto } from './dto/create-parameter.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @Post('/login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.generalService.login(authCredentialsDto);
  }

  @Get('renew')
  renew(@Req() req: Request) {
    let token: string | string[] = req.headers.token;

    if (Array.isArray(token)) {
      token = token[0];
    }
    return this.generalService.validate(token);
  }

  @Post('usuario')
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.generalService.createUsuario(createUserDto);
  }

  @Get('usuario')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.generalService.listUsuarios();
  }

  @Get('usuario/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.generalService.listUsuario(id);
  }

  @Patch('usuario/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.generalService.updateUsuario(id, updateUserDto);
  }

  @Get('parametro')
  @UseGuards(JwtAuthGuard)
  findAllP() {
    return this.generalService.listParametros();
  }

  @Post('parametro')
  @UseGuards(JwtAuthGuard)
  createParametro(@Body() createParametrosDto: CreateParametrosDto) {
    return this.generalService.createParametro(createParametrosDto);
  }

  @Get('parametro/:id')
  @UseGuards(JwtAuthGuard)
  findAllParametro(@Param('id') id: string) {
    return this.generalService.listParametro(id);
  }

  @Patch('parametro/:id')
  @UseGuards(JwtAuthGuard)
  updateParametro(
    @Param('id') id: string,
    @Body() updateParametrosDto: UpdateParametrosDto,
  ) {
    return this.generalService.updateParametro(id, updateParametrosDto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return { filePath: file.filename };
  }
}
