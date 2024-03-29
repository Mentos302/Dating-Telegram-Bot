import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from 'src/admin/admin.module';
import { RelationsModule } from 'src/relations/relations.module';
import { ProfilesService } from './profiles.service';
import { AccountScenes } from './scenes/account';
import { RegistrationScenes } from './scenes/registration';
import { Profile, ProfileSchema } from './schemas/profiles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    forwardRef(() => RelationsModule),
    AdminModule,
  ],
  providers: [ProfilesService, ...RegistrationScenes, ...AccountScenes],
  exports: [ProfilesService],
})
export class ProfilesModule {}
