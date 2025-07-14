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
import { StripeService } from '../../shared/modules/stripe/stripe.service';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly stripeService: StripeService
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

  async getCurrentSubscription(user: User | string): Promise<Subscription | null> {
  const userId = !isString(user) ? user.id : user;

  const subscription = await this.subscriptionRepository.findOne({
    where: { userId },
    relations: ['plan'],
  });

  return subscription;
}

 
async renewSubscription(data: RenewSubscriptionDto, user: User) {
  const plan = await this.planRepository.findOne({ where: { id: data.planId } });
  if (!plan) {
    throw new BadRequestException('Invalid subscription plan. Please contact support.');
  }

  // Require payment reference for non-free plans
  if (!plan.isFree && !data.reference) {
    throw new BadRequestException('Payment reference is required.');
  }

  // Prevent duplicate payment references
  if (data.reference) {
    const existingPayment = await this.paymentRepository.findOne({ where: { reference: data.reference } });
    if (existingPayment) {
      throw new BadRequestException('This payment reference has already been used.');
    }
  }

  // Disallow free plan renewal if user already has a subscription
  if (plan.isFree) {
    const previousSubs = await this.subscriptionRepository.count({ where: { userId: user.id } });
    if (previousSubs > 0) {
      throw new BadRequestException('You cannot renew a free plan.');
    }
  }

  // Verify payment if not free
  let paymentStatus = 'success';
  let amountPaid = plan.amount;

  if (!plan.isFree) {
    const verify = await this.stripeService.verifyPayment(data.reference);

    if (!verify || verify.status !== 'Paid') {
      throw new BadRequestException('Payment verification failed. Please contact support.');
    }

    if (parseFloat(verify.amount) !== parseFloat(amountPaid.toString())) {
      throw new BadRequestException('Amount paid does not match plan cost. Please contact support.');
    }
  }

  // Deactivate active subscriptions
  await this.subscriptionRepository.update(
    { userId: user.id, status: SubscriptionStatusEnum.ACTIVE },
    { status: SubscriptionStatusEnum.INACTIVE },
  );

  // Determine expiration date
  const expiresAt = plan.isFree
    ? new Date('2099-12-31')
    : new Date(new Date().setMonth(new Date().getMonth() + parseInt(plan.duration)));

  // Save payment
  const payment = await this.paymentRepository.save({
    description: `Payment for ${plan.name}`,
    userId: user.id,
    reference: data.reference || generateUniqueReference(),
    amount: amountPaid,
    paymentMethod: 'transfer',
    status: paymentStatus,
  });

  // Save subscription
  await this.subscriptionRepository.save({
    userId: user.id,
    planId: plan.id,
    paymentId: payment.id,
    expiresAt,
    status: SubscriptionStatusEnum.ACTIVE,
  });

  return { message: 'Subscription renewed successfully' };
}

  }