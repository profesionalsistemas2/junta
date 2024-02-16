import { Module } from '@nestjs/common';
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';
import { Parametros, ParametrosSchema } from './entities/parametros.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Historico, HistoricoSchema } from './entities/historico.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Parametros.name, schema: ParametrosSchema },
      { name: Historico.name, schema: HistoricoSchema },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './public', // Directorio donde se guardarán los archivos
        filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 100, // 100 MB
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6h' },
    }),
  ],
  controllers: [GeneralController],
  providers: [GeneralService, JwtStrategy],
})
export class GeneralModule {}
