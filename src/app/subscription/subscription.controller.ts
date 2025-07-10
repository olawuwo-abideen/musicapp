import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Plan } from 'src/shared/entities/plan.entity';
import { User } from 'src/shared/entities/user.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { isProduction } from 'src/shared/utils/helpers.util';
import { RenewSubscriptionDto } from './dto/subscription.dto';
import { Subscription } from 'src/shared/entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('subscription')
@ApiTags('Subscription')
export class SubscriptionController {
constructor(private readonly subscriptionService: SubscriptionService) {}

@Get('plans')
@ApiOperation({ summary: 'Get all plans' })
async getPlans(@CurrentUser() user: User): Promise<Plan[]> {
return this.subscriptionService.getPlans(user);
}

@Post('plans')
@ApiOperation({ summary: 'Create a plan' })
async create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
if (isProduction()) {
throw new NotFoundException();
}
return this.subscriptionService.createPlan(createPlanDto);
}


@Get('plans/user')
@ApiOperation({ summary: 'Get current user plan' })
async getCurrentSubscription(@CurrentUser() user: User): Promise<Subscription | null> {
  return this.subscriptionService.getCurrentSubscription(user);
}


@Post('plans/renew')
@ApiOperation({ summary: 'Renew user plan' })
async renewSubscription(
@Body() payload: RenewSubscriptionDto,
@CurrentUser() user: User,
): Promise<{ message: string }> {
return this.subscriptionService.renewSubscription(payload, user);
}


}
