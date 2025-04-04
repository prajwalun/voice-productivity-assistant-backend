import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { FirebaseService } from '../firebase/firebase.service';
  
  @Injectable()
  export class FirebaseAuthGuard implements CanActivate {
    constructor(private readonly firebaseService: FirebaseService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
  
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing token');
      }
  
      const idToken = authHeader.split('Bearer ')[1];
  
      try {
        const decoded = await this.firebaseService.verifyToken(idToken);
        request.user = decoded; // attach to request
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
  