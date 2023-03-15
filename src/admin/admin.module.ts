import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { AdminService } from './admin.service';
import { AdminMailingScene } from './scenes/mailing.scene';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AdminService, AdminMailingScene],
  exports: [AdminService],
})
export class AdminModule {}
