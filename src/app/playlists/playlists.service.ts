import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Playlist } from '../../shared/entities/playlist.entity';
import { Song } from '../../shared/entities/song.entity';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import {  AddSongToPlayListDto, RemoveSongToPlayListDto, UpdatePlayListDto } from './dto/create-playlist.dto';

@Injectable()
export class PlayListsService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepository: Repository<Playlist>,
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async getPlaylistOrFail(options: FindOneOptions<Playlist>): Promise<Playlist> {
    const playList: Playlist | null = await this.playListRepository.findOne(options);
    if (!playList) {
      throw new NotFoundException('Playlist not found');
    }
    return playList;
  }


  public async createPlaylist(
    data: Partial<Playlist>,
    user: User
  ): Promise<{ message: string; playlist?: Playlist }> {
    const existingPlaylist = await this.playListRepository.findOne({
      where: { name: data.name, userId: user.id },
    });
  
    if (existingPlaylist) {
      return { message: 'Playlist name already exists' };
    }
  
    const newPlaylist = this.playListRepository.create({
      name: data.name,
      userId: user.id,
    });
  
    const savedPlaylist = await this.playListRepository.save(newPlaylist);
  
    return {
      message: 'Playlist created successfully',
      playlist: savedPlaylist,
    };
  }
  

  

  public async getPlaylists(user: User): Promise<{ message: string; playlists: Playlist[] }> {
    const playlists: Playlist[] = await this.playListRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.songs', 'songs')
      .where('playlist.userId = :userId', { userId: user.id })
      .select([
        'playlist.id',
        'playlist.name',
        'playlist.createdAt',
        'playlist.updatedAt',
        'songs.id',   
        'songs.title',  
        'songs.artists', 
        'songs.duration'
      ])
      .getMany();
  
    const message = playlists.length > 0 
      ? 'Playlists retrieved successfully' 
      : 'No playlists found';
  
    return { message, playlists };
  }
  

  public async deletePlaylist(id: string, user: User): Promise<{ message: string }> {
    const playlist: Playlist = await this.getPlaylistOrFail({
      where: {
        id,
        userId: user.id,
      },
    });
  
    await this.playListRepository.softDelete({ id });
  
    return { message: 'Playlist deleted successfully' };
  }
  

  public async getPlaylist(id: string, user: User): Promise<{ message: string; playlist: Partial<Playlist> }> {
    const playlist: Playlist = await this.playListRepository.findOne({
      where: { user: { id: user.id }, id },
      relations: ['user', 'songs'],
    });
  
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
  
    const { user: _, ...playlistWithoutUser } = playlist;
  
    return {
      message: 'Playlist retrieved successfully',
      playlist: playlistWithoutUser,
    };
  }
  
  public async updatePlaylist(
    id: string,
    payload: UpdatePlayListDto,
    user: User
  ): Promise<{ message: string; playlist: Playlist }> {
    const playlist = await this.playListRepository.findOne({
      where: { id },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (payload.name && payload.name !== playlist.name) {
      const existingPlaylist = await this.playListRepository.findOne({
        where: { name: payload.name },
      });

      if (existingPlaylist) {
        throw new ConflictException('Playlist name already exists');
      }
    }
    Object.assign(playlist, payload);
    const updatedPlaylist = await this.playListRepository.save(playlist);

    return {
      message: 'Playlist updated successfully',
      playlist: updatedPlaylist,
    };
  }
  
  public async getPlaylistSongs(
    playListId: string, 
    user: User
  ): Promise<{ message: string; songs?: Song[] }> {
    const playlist: Playlist = await this.getPlaylistOrFail({
      where: {
        id: playListId,
        userId: user.id,
      },
    });
  
    const songs: Song[] = await this.songsRepository
      .createQueryBuilder('song')
      .where({ playListId: playlist.id })
      .getMany();
  
    if (songs.length === 0) {
      return {
        message: 'No songs found in this playlist',
      };
    }
  
    return {
      message: 'Playlist song retrieved successfully',
      songs,
    };
  }
  
  public async AddSongToPlayList(
    payload: AddSongToPlayListDto,
    user: User,
    playlistId: string,
  ): Promise<{ message: string; playlist: Playlist }> {
    const playlist = await this.playListRepository.findOne({
      where: { id: playlistId, user: { id: user.id } },
      relations: ['songs'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    const song = await this.songsRepository.findOne({
      where: { id: payload.songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }
    const songExists = playlist.songs.some((existingSong) => existingSong.id === song.id);

    if (songExists) {
      throw new BadRequestException('Song already exists in the playlist');
    }
    playlist.songs.push(song);
    await this.playListRepository.save(playlist);

    return {
      message: 'Song added to playlist successfully',
      playlist,
    };
  }

  public async removeSongFromPlaylist(
    payload: RemoveSongToPlayListDto,
    playlistId: string,
    user: User,
  ): Promise<{ message: string; playlist: Playlist }> {
    const playlist = await this.playListRepository.findOne({
      where: { id: playlistId, user: { id: user.id } },
      relations: ['songs']
    });
  
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    const songIndex = playlist.songs.findIndex((song) => song.id === payload.songId);
  
    if (songIndex === -1) {
      throw new BadRequestException('Song not found in the playlist');
    }
    playlist.songs.splice(songIndex, 1);
    await this.playListRepository.save(playlist);
  
    return {
      message: 'Song removed from playlist successfully',
      playlist,
    };
  }
  


}