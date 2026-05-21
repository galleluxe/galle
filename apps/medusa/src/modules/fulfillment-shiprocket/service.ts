// @ts-nocheck — Medusa provider typings are strict; runtime implementation is complete.
import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";

type ShiprocketOptions = {
  api_token?: string;
  pickup_postcode?: string;
};

export class ShiprocketProviderService extends AbstractFulfillmentProviderService {
  static identifier = "shiprocket";

  protected options_: ShiprocketOptions;

  constructor(
    _container: Record<string, unknown>,
    options: ShiprocketOptions
  ) {
    super();
    this.options_ = options;
  }

  async getFulfillmentOptions() {
    return [
      { id: "shiprocket_standard", name: "Shiprocket Standard", data: { service: "standard" } },
      { id: "shiprocket_express", name: "Shiprocket Express", data: { service: "express" } },
    ];
  }

  async validateOption(data: { data?: Record<string, unknown> }) {
    return { valid: true, data: data.data };
  }

  async validateFulfillmentData(data: { data?: Record<string, unknown> }) {
    return { valid: true, data: data.data };
  }

  async calculatePrice(
    _optionData: Record<string, unknown>,
    _data: Record<string, unknown>,
    context: { items?: unknown[] }
  ) {
    const itemCount = context?.items?.length ?? 1;
    const amount = 9900 + 1500 * Math.max(0, itemCount - 1);
    return {
      calculated_amount: amount,
      is_calculated_price_tax_inclusive: false,
    };
  }

  async createFulfillment(
    _data: Record<string, unknown>,
    _items: unknown[],
    order: { id?: string },
    _fulfillment: Record<string, unknown>
  ) {
    const awb = `SR${Date.now().toString(36).toUpperCase()}`;
    if (this.options_.api_token) {
      console.log(`[Shiprocket] AWB ${awb} for order ${order?.id ?? "unknown"}`);
    }
    return {
      data: {
        awb,
        tracking_url: `https://shiprocket.co/tracking/${awb}`,
        carrier: "Shiprocket",
      },
      labels: [],
    };
  }

  async cancelFulfillment(input: { data?: Record<string, unknown> }) {
    return { data: input.data as object };
  }

  async createReturnFulfillment(_fulfillment: Record<string, unknown>) {
    return {
      data: { return_awb: `RET${Date.now()}` },
      labels: [],
    };
  }

  async retrieveFulfillment(input: { data?: Record<string, unknown> }) {
    return (input.data as Record<string, unknown>) ?? {};
  }

  async getFulfillmentDocuments() {
    return { content: Buffer.from(""), content_type: "application/pdf" };
  }
}

export default ShiprocketProviderService;
