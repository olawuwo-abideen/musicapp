import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/shared/entities/payment.entity';
import { Subscription } from 'src/shared/entities/subscription.entity';
import { User } from 'src/shared/entities/user.entity';
import { Plan } from 'src/shared/entities/plan.entity';
import { StripeModule } from 'src/shared/modules/stripe/stripe.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([Payment, Subscription, User, Plan]), 
      StripeModule
    ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
