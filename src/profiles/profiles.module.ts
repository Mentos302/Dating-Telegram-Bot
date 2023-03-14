import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesService } from './profiles.service';
import { ProfilesUpdate } from './profiles.update';
import { RegistrationScenes } from './scenes/registration';
import { Profile, ProfileSchema } from './schemas/profiles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  providers: [ProfilesUpdate, ProfilesService, ...RegistrationScenes],
  exports: [ProfilesService],
})
export class ProfilesModule {}
