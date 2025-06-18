import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async verifyPayment(paymentIntentId: string) {
    try {
      const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (!intent || intent.status !== 'succeeded') {
        throw new BadRequestException('Payment not successful.');
      }

      return {
        status: 'Paid',
        amount: (intent.amount_received / 100).toFixed(2),
        currency: intent.currency,
        raw: intent,
      };
    } catch (error) {
      throw new BadRequestException('Failed to verify Stripe payment.');
    }
  }
}
