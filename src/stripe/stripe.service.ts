import { Injectable } from '@nestjs/common';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateStripeSubscriptionDto } from './dto/create-stripe-subscription.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { ListCustomersByEmailDto } from './dto/list-customers-by-email.dto';
import { ListSubscriptionsByCustomerDto } from './dto/list-subscriptions-by-customer.dto';
import { ListInvoicesBySubscriptionDto } from './dto/list-invoices-by-subscription.dto';
import { ListActiveEntitlementsByCustomerDto } from './dto/list-active-entitlements.dto';
import { ListPaymentMethodsByCustomerDto } from './dto/list-payment-methods-by-customer.dto';
import { CreateSetupIntentByCustomerDto } from './dto/create-setup-intent-by-customer.dto';
import { application } from '../log/logger';
import Stripe from 'stripe';
import configuration from 'src/config/configuration';

@Injectable()
export class StripeService {
  // Stripe オブジェクト
  private stripe: Stripe;
  private calculateTax = true;

  constructor() {
    this.stripe = new Stripe(configuration().stripe.secret_key);
  }

  // create(createStripeDto: CreateStripeDto) {
  //   return 'This action adds a new stripe';
  // }

  // findAll() {
  //   return `This action returns all stripe`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} stripe`;
  // }

  // update(id: number, updateStripeDto: UpdateStripeDto) {
  //   return `This action updates a #${id} stripe`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} stripe`;
  // }

  config() {
    return {
      publishableKey: configuration().stripe.publishable_key,
    };
  }

  async listPrices() {
    // Stripe API へアクセス、price(with product)データを取得
    const prices = await this.stripe.prices.list({
      lookup_keys: ['meeting'],
      expand: ['data.product'],
    });
    return { prices: prices.data };
  }

  // Product 一覧 取得
  async listProducts(listProductsDto: ListProductsDto) {
    const res = await this.stripe.products.list({
      ids: [listProductsDto.productId],
    });
    return { products: res.data };
  }

  // Customer 一覧 取得 (メールアドレスによる検索)
  async listCustomersByEmail(listCustomersByEmailDto: ListCustomersByEmailDto) {
    const customers = await this.stripe.customers.search({
      query: "email:'" + listCustomersByEmailDto.email + "'",
    });
    return { customers: customers.data };
  }

  // Customer 作成
  async createCustomer(createCustomerDto: CreateCustomerDto) {
    // Create a new customer object
    const customer = (await this.stripe.customers.create({
      name: createCustomerDto.name,
      email: createCustomerDto.email,
      address: {
        country: 'JP',
      },
      tax: {
        validate_location: 'immediately',
      },
    })) as Stripe.Response<Stripe.Customer>;

    return { customer: customer };
  }

  // Customer 更新
  async updateCustomer(customerId, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.stripe.customers.update(
      customerId,
      updateCustomerDto,
    );
    return customer;
  }

  // Customer 削除
  async deleteCustomer(customerId: string) {
    return await this.stripe.customers.del(customerId);
  }

  // Subscription 一覧 取得
  async listSubscriptionsByCustomer(
    listSubscriptionsByCustomerDto: ListSubscriptionsByCustomerDto,
  ) {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: listSubscriptionsByCustomerDto.customerId,
      expand: ['data.latest_invoice.payment_intent'],
    } as Stripe.SubscriptionListParams);

    return { subscriptions: subscriptions.data };
  }

  // Invoice 一覧 取得
  async listInvoicesBySubscription(
    listInvoicesBySubscriptionDto: ListInvoicesBySubscriptionDto,
  ) {
    const invoices = await this.stripe.invoices.list({
      subscription: listInvoicesBySubscriptionDto.subscriptionId,
    } as Stripe.InvoiceListParams);

    return { invoices: invoices.data };
  }

  // Active Entitlement 一覧 取得
  async listActiveEntitlements(
    listActiveEntitlementsByCustomerDto: ListActiveEntitlementsByCustomerDto,
  ) {
    const activeEntitlements =
      await this.stripe.entitlements.activeEntitlements.list({
        customer: listActiveEntitlementsByCustomerDto.customerId,
      });

    return { activeEntitlements: activeEntitlements.data };
  }

  // Subscription 作成
  async createSubscription(
    createStripeSubscriptionDto: CreateStripeSubscriptionDto,
  ) {
    // Simulate authenticated user. In practice this will be the
    // Stripe Customer ID related to the authenticated user.
    const customerId = createStripeSubscriptionDto.customerId;

    // Create the subscription
    const priceId = createStripeSubscriptionDto.priceId;

    try {
      const subscription = (await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        automatic_tax: {
          enabled: true,
        },
      })) as any;

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }

  // Subscription キャンセル処理
  async cancelSubscription(subscriptionId: string) {
    await this.stripe.subscriptions.cancel(subscriptionId);
    return {};
  }

  // PaymentMethod 一覧
  async listPaymentMethodsByCustomer(
    listPaymentMethodsByCustomerDto: ListPaymentMethodsByCustomerDto,
  ) {
    const paymentMethods = await this.stripe.customers.listPaymentMethods(
      listPaymentMethodsByCustomerDto.customerId,
    );

    return { paymentMethods: paymentMethods.data };
  }

  // SetupIntent 作成
  async createSetupIntentByCustomer(
    createSetupIntentByCustomerDto: CreateSetupIntentByCustomerDto,
  ) {
    //
    const setupIntent = await this.stripe.setupIntents.create({
      customer: createSetupIntentByCustomerDto.customerId,
      // automatic_payment_methods: {
      //   enabled: true,
      // },
      payment_method_types: ['card'],
    });
    return { setupIntent: setupIntent };
  }

  test001(request: any, createStripeDto: CreateStripeDto) {
    const sig = request.headers['stripe-signature'];
    application.debug('logs1', '---');
    application.debug('logs1', 'sig: ' + sig);

    // イベントの種類
    application.debug('logs1', 'request.body.type : ' + request.body.type);

    const obj = request.body.data.object;
    application.debug('logs1', 'obj:::');
    application.debug('logs1', obj);

    application.debug('logs1', 'stripe - test001() runs.', createStripeDto);
    return { status: 'success' };
  }
}
