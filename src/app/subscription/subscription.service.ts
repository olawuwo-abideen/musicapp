import {
  BadRequestException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { Plan } from '../../shared/entities/plan.entity';
import {Subscription,SubscriptionStatusEnum} from '../../shared/entities/subscription.entity';
import { User } from '../../shared/entities/user.entity';
import { Payment } from '../../shared/entities/payment.entity';
import { RenewSubscriptionDto } from './dto/subscription.dto';
import { generateUniqueReference } from '../../shared/utils/helpers.util';
import { isString } from 'class-validator';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async onModuleInit() {
    const plans: Partial<Plan>[] = [
      {
        name: 'Free plan (Ad-Supported)',
        description: 'Ideal for casual listeners who don`t mind ads',
        features: [
          'Ads play between songs',
          'Limited skips per hour',
          'No offline downloads—streaming only',
          'Lower audio quality (e.g., 128 kbps)'
        ],
        amount: 0,
        duration: 'unlimited',
      },
      {
        name: 'Individual Premium Plan',
        description: 'Best for frequent users who want an uninterrupted experience.',
        features: [
          'Ad-free listening',
          'Unlimited skips',
          'Offline playback with song downloads',
          'High-quality audio (up to 320 kbps or AAC equivalent)'
        ],
        amount: 9.90,
        duration: '1',
      },
      {
        name: 'Family Plan',
        description: 'Designed for households or groups',
        features: [
      'Up to 6 separate accounts under one subscription',
       'Parental controls available',
       'Shared billing, but individual recommendations and playlists'
        ],
        amount: 15.98,
        duration: '1',
      },
    ];

    for (let i = 0; i <= plans.length - 1; i++) {
      const getPlan = await this.planRepository.findOne({
        where: { name: plans[i].name },
      });

      if (!getPlan) {
        await this.planRepository.save(plans[i]);
      }
    }
  }

  async createPlan(createPlanDto: any): Promise<Plan> {
    return await this.planRepository.save(createPlanDto);
  }

  async getPlans(user: User): Promise<Plan[]> {
    const where: FindOptionsWhere<Plan> = {};

    const validateFreeplan = await this.subscriptionRepository.count({
      where: { userId: user.id },
    });
    if (validateFreeplan) {
      where.amount = MoreThan(0);
    }
    return await this.planRepository.find({ where });
  }

  
  async getCurrentSubscription(
    user: User | string,
  ): Promise<Subscription | null> {
    const userId = !isString(user) ? user.id : user;

    return await this.subscriptionRepository.findOne({
      where: { userId },
      relations: ['plan'],
    });
  }

 

  }