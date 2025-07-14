import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../shared/entities/payment.entity';
import { Subscription } from '../../shared/entities/subscription.entity';
import { User } from '../../shared/entities/user.entity';
import { Plan } from '../../shared/entities/plan.entity';
import { StripeModule } from '../../shared/modules/stripe/stripe.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([Payment, Subscription, User, Plan]), 
      StripeModule
    ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
