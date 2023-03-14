import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesService } from './profiles.service';
import { ProfilesUpdate } from './profiles.update';
import { Profile, ProfileSchema } from './schemas/profiles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  providers: [ProfilesUpdate, ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
