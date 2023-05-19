import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as xmljs from 'xml-js';

@Injectable()
export class XmlResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        const xml = xmljs.js2xml(data, { compact: true, spaces: 4 });
        const response = context.switchToHttp().getResponse();
        response.header('Content-Type', 'application/xml');
        response.send(xml);
        return;
      }),
    );
  }
}