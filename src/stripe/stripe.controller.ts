import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateStripeSubscriptionDto } from './dto/create-stripe-subscription.dto';
import { ListCustomersByEmailDto } from './dto/list-customers-by-email.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { Public } from 'src/decorators/public.decorator';
import { ListInvoicesBySubscriptionDto } from './dto/list-invoices-by-subscription.dto';
import { ListActiveEntitlementsByCustomerDto } from './dto/list-active-entitlements.dto';
import { ListSubscriptionsByCustomerDto } from './dto/list-subscriptions-by-customer.dto';
import { ListPaymentMethodsByCustomerDto } from './dto/list-payment-methods-by-customer.dto';
import { CreateSetupIntentByCustomerDto } from './dto/create-setup-intent-by-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // @Post()
  // create(@Body() createStripeDto: CreateStripeDto) {
  //   return this.stripeService.create(createStripeDto);
  // }

  // @Get()
  // findAll() {
  //   return this.stripeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.stripeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStripeDto: UpdateStripeDto) {
  //   return this.stripeService.update(+id, updateStripeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.stripeService.remove(+id);
  // }

  @Public()
  @Get('config')
  config() {
    return this.stripeService.config();
  }

  @Public()
  @Post('list-prices')
  async listPrices() {
    return await this.stripeService.listPrices();
  }

  @Public()
  @Post('list-products')
  async listProducts(@Body() listProductsDto: ListProductsDto) {
    return await this.stripeService.listProducts(listProductsDto);
  }

  @Public()
  @Post('list-customers-by-email')
  async listCustomersByEmail(
    @Body() listCustomersByEmailDto: ListCustomersByEmailDto,
  ) {
    return await this.stripeService.listCustomersByEmail(
      listCustomersByEmailDto,
    );
  }

  @Public()
  @Post('create-customer')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.stripeService.createCustomer(createCustomerDto);
  }

  @Public()
  @Post('update-customer/:id')
  async updateCustomer(
    @Param('id') customerId: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return await this.stripeService.updateCustomer(
      customerId,
      updateCustomerDto,
    );
  }

  @Public()
  @Post('delete-customer/:id')
  async deleteCustomer(@Param('id') customerId: string) {
    return await this.stripeService.deleteCustomer(customerId);
  }

  @Public()
  @Post('list-subscriptions-by-customer')
  async listSubscriptionsByCustomer(
    @Body() listSubscriptionsByCustomerDto: ListSubscriptionsByCustomerDto,
  ) {
    return await this.stripeService.listSubscriptionsByCustomer(
      listSubscriptionsByCustomerDto,
    );
  }

  @Public()
  @Post('create-subscription')
  async createSubscription(
    @Body() createStripeSubscriptionDto: CreateStripeSubscriptionDto,
  ) {
    return await this.stripeService.createSubscription(
      createStripeSubscriptionDto,
    );
  }

  @Public()
  @Post('cancel-subscription/:subscription')
  async cancelSubscription(@Param('subscription') subscriptionId: string) {
    return await this.stripeService.cancelSubscription(subscriptionId);
  }

  @Public()
  @Post('list-invoices-by-subscription')
  async listInvoicesBySubscription(
    @Body() listInvoicesDto: ListInvoicesBySubscriptionDto,
  ) {
    return await this.stripeService.listInvoicesBySubscription(listInvoicesDto);
  }

  @Public()
  @Post('list-active-entitlements-by-customer')
  async listActiveEntitlementsByCustomer(
    @Body()
    listActiveEntitlementsByCustomerDto: ListActiveEntitlementsByCustomerDto,
  ) {
    return await this.stripeService.listActiveEntitlements(
      listActiveEntitlementsByCustomerDto,
    );
  }

  @Public()
  @Post('list-payment-method-by-customer')
  async listPaymentMethodsByCustomer(
    @Body() listPaymentMethodsByCustomerDto: ListPaymentMethodsByCustomerDto,
  ) {
    return await this.stripeService.listPaymentMethodsByCustomer(
      listPaymentMethodsByCustomerDto,
    );
  }

  @Public()
  @Post('create-setup-intent-by-customer')
  async createSetupIntentByCustomer(
    @Body() createSetupIntentByCustomerDto: CreateSetupIntentByCustomerDto,
  ) {
    return await this.stripeService.createSetupIntentByCustomer(
      createSetupIntentByCustomerDto,
    );
  }

  @Public()
  @Post('test001')
  test001(@Request() req: any, @Body() createStripeDto: CreateStripeDto) {
    return this.stripeService.test001(req, createStripeDto);
  }
}
