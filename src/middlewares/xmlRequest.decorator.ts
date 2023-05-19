import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as xmljs from 'xml-js';

@Injectable()
export class XmlRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
      const xmlBody = `
      <root>
          <username>test</username>
          <password>xyz</password>
      </root>    
      `;
      try {
        const parsedBody = xmljs.xml2js(xmlBody, { compact: true });
        request.body = parsedBody;
        request.body = request.body.root;
      } catch (error) {
        throw new BadRequestException('Invalid XML request body');
      }
    }

    return next.handle();
  }

}
