import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { createTransport } from 'nodemailer';
import * as nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import { JwtService } from '@nestjs/jwt';

import { Usuario } from './entities/usuario.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateParametrosDto } from './dto/create-parameter.dto';
import { UpdateParametrosDto } from './dto/update-parameter.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Parametros } from './entities/parametros.entity';
import { jwtConstants } from './jwt.constants';
import { CreateHistoricoDto } from './dto/create-historico.dto';
import { UpdateHistoricoDto } from './dto/update-historico.dto';
import { Historico } from './entities/historico.entity';

@Injectable()
export class GeneralService {
  private transporter;
  constructor(
    private jwtService: JwtService,
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<Usuario>,
    @InjectModel(Parametros.name)
    private readonly parametroModel: Model<Parametros>,
    @InjectModel(Historico.name)
    private readonly historicoModel: Model<Historico>,
  ) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'noreply@clinicasanluis.com.co',
        pass: 'nkkgwebflxkzapur',
      },
    });

    this.transporter.use('compile', nodemailerExpressHandlebars({
      viewEngine: {
        extname: '.hbs',
        partialsDir: 'src/common/emails',
        layoutsDir: 'src/common/emails',
        defaultLayout: 'email',
      },
      viewPath: 'src/common/emails',
      extName: '.hbs',
    }));
  }

  async login(user: AuthCredentialsDto) {
    const { username, password } = user;
    const hoy = new Date();

    const findUser = await this.usuarioModel.findOne({ usuario: username });

    if (!findUser.estado) throw new HttpException('Usuario inactivo', 400);

    if (!findUser) throw new Error('El usuario no existe');
    let isPasswordValid: boolean;
    findUser.password === password
      ? (isPasswordValid = true)
      : (isPasswordValid = false);

    if (!isPasswordValid)
      throw new HttpException(
        'La contraseña no coincide',
        HttpStatus.FORBIDDEN,
      );
    
    if(findUser.actividad < hoy){
      throw new HttpException(
        'Oops! Actualmente no cuenta con acceso a la plataforma, ya que su vigencia expiro. Comuniquese con el administrador del sitio.',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = { id: findUser.id, usuario: findUser.usuario };

    const token = this.jwtService.sign(payload);

    return {
      usuario: findUser,
      token,
    };
  }

  async validate(tokenR: string) {
    const tokenValid = this.jwtService.verify(tokenR, {
      secret: jwtConstants.secret,
    });

    if (tokenValid) {
      const dataDecode = this.jwtService.decode(tokenR);
      const usuario = dataDecode['usuario'];
      const findUser = await this.usuarioModel.findOne({usuario:usuario});
      if (!findUser) throw new HttpException('El usuario no existe', 404);
      const data = {
        usuario: findUser,
        token: tokenR,
      };
      return data;
    } else {
      this.renew(tokenR);
    }
  }

  async renew(tokenR: string) {
    const tokenDecode = this.jwtService.decode(tokenR);

    const id = tokenDecode['id'];
    const findUser = await this.usuarioModel.findOne(id);
    if (!findUser) throw new HttpException('El usuario no existe', 404);
    const payload = { id: id, usuario: tokenDecode['usuario'] };

    const token = this.jwtService.sign(payload);
    const data = {
      user: findUser,
      token,
    };
    return data;
  }

  async listUsuario(id: string) {
    let usuario: Usuario;

    if (!usuario && isValidObjectId(id)) {
      usuario = await this.usuarioModel.findById(id);
    }

    if (!usuario)
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);

    return usuario;
  }

  async listUsuarios() {
    return await this.usuarioModel.find();
  }

  async createUsuario(create: CreateUserDto) {
    try {
      const usuario = await this.usuarioModel.create(create);
      const body = {
        email:usuario.usuario,
        subject:'Creación usuario',
        context:{
          link:process.env.link,
          name:usuario.nombre,
          password:usuario.password,
          fecha:usuario.actividad,
          email: usuario.usuario
        },
      }
      await this.sendEmail(body);
      return usuario;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateUsuario(id: string, update: UpdateUserDto) {
    const usuario = await this.listUsuario(id);

    try {
      await usuario.updateOne(update);
      return { ...usuario.toJSON(), ...update };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async listParametros() {
    return await this.parametroModel.find()
  }

  async listParametro(id: string) {
    let parametro: Parametros;

    if (!parametro && isValidObjectId(id)) {
      parametro = await this.parametroModel.findById(id);
    }

    if (!parametro)
      throw new NotFoundException(`Parametros con id "${id}" no encontrado`);

    return parametro;
  }

  async createParametro(create: CreateParametrosDto) {
    try {
      const parametro = await this.parametroModel.create(create);
      const body = {
        acta_nro:parametro.acta_nro - 1,
        ruta_acta:parametro.ruta_acta,
        fecha_financiera:parametro.fecha_estados,
        ruta_financiera:parametro.ruta_financiera
      }    
      this.createHistorico(body)
      return parametro;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateParametro(id: string, update: UpdateParametrosDto) {
    const parametro = await this.listParametro(id);

    try {
      await parametro.updateOne(update);
      const body = {
        acta_nro:parametro.acta_nro - 1,
        ruta_acta:parametro.ruta_acta,
        fecha_financiera:parametro.fecha_estados,
        ruta_financiera:parametro.ruta_financiera
      }  
      const historico:any = await this.historicoModel.find({acta_nro:parametro.acta_nro - 1});
      if(historico.length > 0){
        this.updateHistorico(body)
      }else{
        this.createHistorico(body)
      }
      return { ...parametro.toJSON(), ...update };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async sendEmail(body:any){
    try {
      const info = await this.transporter.sendMail({
        from: 'noreply@clinicasanluis.com.co',
        to:body.email,
        subject:body.subject,
        template:'./email',
        context:body.context,
        attachments: [{
            filename: 'logo.png',
            path: 'src/common/assets/img/logo.png',
            cid: 'logo'
        }]
      });
      return info;
    } catch (error) {
      throw error;
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Dato ya existe en base de datos ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `No podemos crear lo solicitado - Revisar Logs`,
    );
  }

  async createHistorico(create:CreateHistoricoDto){
    try {
      const historico = await this.historicoModel.create(create);
      return historico;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateHistorico(update:UpdateHistoricoDto){
    try {
      const historico = await this.historicoModel.findOneAndUpdate(
        {acta_nro:update.acta_nro},
        update,
        { new: true }
      );
      
      if (!historico) {
        throw new Error('El historico no fue encontrado');
      }
  
      return historico.toJSON();
    } catch (error) {
      this.handleExceptions(error);
    }
  }  
}
