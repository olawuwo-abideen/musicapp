import {
Injectable,
NotFoundException,
ConflictException,
BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follower } from '../../shared/entities/follower.entity';
import { Artist } from '../../shared/entities/artist.entity';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class FollowerService {
constructor(
@InjectRepository(Follower)
private followerRepository: Repository<Follower>,

@InjectRepository(Artist)
private artistRepository: Repository<Artist>,
) {}

async followArtist(artistId: string, user: User) {
const artist = await this.artistRepository.findOne({ where: { id: artistId } });
if (!artist) throw new NotFoundException('Artist not found');

const exists = await this.followerRepository.findOne({
where: {
user: { id: user.id },
artist: { id: artistId },
},
});

if (exists) throw new ConflictException('Already following this artist');

const follow = this.followerRepository.create({ user, artist });
await this.followerRepository.save(follow);
artist.followerCount += 1;
await this.artistRepository.save(artist);

return { message: 'Artist followed' };
}

async unfollowArtist(artistId: string, user: User) {
const follow = await this.followerRepository.findOne({
where: {
user: { id: user.id },
artist: { id: artistId },
},
});
if (!follow) throw new BadRequestException('Artist already unfollow');
await this.followerRepository.remove(follow);
const artist = await this.artistRepository.findOne({ where: { id: artistId } });
if (artist && artist.followerCount > 0) {
artist.followerCount -= 1;
await this.artistRepository.save(artist);
}
return { message: 'Artist unfollowed' };
}

async countFollowers(artistId: string) {
const artist = await this.artistRepository.findOne({ where: { id: artistId } });
if (!artist) throw new NotFoundException('Artist not found');
return { artistId, followerCount: artist.followerCount };
}


}
