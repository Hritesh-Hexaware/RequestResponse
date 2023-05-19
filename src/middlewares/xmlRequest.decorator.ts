import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as xmljs from 'xml-js';

@Injectable()
export class XmlRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    function nativeType(value) {
      var nValue = Number(value);
      if (!isNaN(nValue)) {
        return nValue;
      }
      var bValue = value.toLowerCase();
      if (bValue === 'true') {
        return true;
      } else if (bValue === 'false') {
        return false;
      }
      return value;
    }

    var removeJsonTextAttribute = function (value, parentElement) {
      try {
        var keyNo = Object.keys(parentElement._parent).length;
        var keyName = Object.keys(parentElement._parent)[keyNo - 1];
        parentElement._parent[keyName] = nativeType(value);
      } catch (e) { }
    }

    const request = context.switchToHttp().getRequest();

    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
      const xmlBody = request.body;
      try {
        const parsedBody = xmljs.xml2js(xmlBody, {
          compact: true,
          trim: true,
          ignoreDeclaration: true,
          ignoreInstruction: true,
          ignoreAttributes: true,
          ignoreComment: true,
          ignoreCdata: true,
          ignoreDoctype: true,
          textFn: removeJsonTextAttribute
        });
        request.body = parsedBody;
        request.body = request.body.root
        //request.body.username = request.body.username._text
        //request.body.password = request.body.password._text
      } catch (error) {
        throw new BadRequestException('Invalid XML request body');
      }
    }

    return next.handle();
  }

}
