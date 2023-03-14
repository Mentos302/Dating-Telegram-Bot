import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { RelationsModule } from 'src/relations/relations.module';
import { User, UserSchema } from './schemas/users.schema';
import { UsersService } from './users.service';
import { UsersUpdate } from './users.update';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProfilesModule,
    RelationsModule,
  ],
  providers: [UsersUpdate, UsersService],
})
export class UsersModule {}
