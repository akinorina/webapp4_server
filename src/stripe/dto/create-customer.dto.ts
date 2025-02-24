export class CreateCustomerDto {
  id: number;

  name: string;

  email: string;

  invoice_settings: {
    custom_fields: null;
    default_payment_method: null;
    footer: null;
    rendering_options: null;
  };
}
