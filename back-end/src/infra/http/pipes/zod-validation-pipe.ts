import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown): unknown {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          codigoErro: 'DADOS_DE_ENTRADA_INVALIDOS',
          mensagem: 'Os dados enviados são inválidos.',
          detalhes: error.issues.map((issue) => ({
            campo: issue.path.join('.'),
            mensagem: issue.message,
          })),
        });
      }

      throw new BadRequestException({
        codigoErro: 'DADOS_DE_ENTRADA_INVALIDOS',
        mensagem: 'Os dados enviados são inválidos.',
        detalhes: [],
      });
    }
  }
}
