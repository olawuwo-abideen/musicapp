import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/shared/entities/song.entity';
import { Repository } from 'typeorm';
import { FeedbackDto, ReportSongDto } from './dto/feedback.dto';
import { User } from 'src/shared/entities/user.entity';
import { SongReport } from 'src/shared/entities/report.entity';
import { Feedback } from 'src/shared/entities/feedback.entity';

export class FeedbackService {
  constructor(
    @InjectRepository(SongReport)
    private reportRepository: Repository<SongReport>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async reportSong( user: User, songId: string, data: ReportSongDto): Promise<{message: string; report:SongReport}> {
    const song = await this.songRepository.findOne({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    const report = this.reportRepository.create({
      song,
      reason: data.reason,
      reportedBy: user,
    });

    const savedReport = await this.reportRepository.save(report);

    return { message: 'Report created successfully', report: savedReport };;
  }

  async submitFeedback(user: User, data: FeedbackDto): Promise<{message: string; feedback:Feedback}> {

    const feedback = this.feedbackRepository.create({
      message: data.message,
      rating: data.rating,
      user,
    });

    const savedFeedback = await this.reportRepository.save(feedback);
    return { message: 'Report created successfully', feedback: savedFeedback };;
  }
}
