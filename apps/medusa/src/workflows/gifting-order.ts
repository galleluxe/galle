import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

type GiftingOrderInput = {
  order_id: string;
  gift_message?: string;
  gift_wrap?: string;
};

/**
 * Post-order gifting workflow — tags order metadata for warehouse packing.
 */
export const giftingOrderWorkflow = createWorkflow(
  "gifting-order",
  (input: GiftingOrderInput) => {
    return new WorkflowResponse({
      order_id: input.order_id,
      gifting: {
        message: input.gift_message,
        wrap: input.gift_wrap,
        processed_at: new Date().toISOString(),
      },
    });
  }
);

export default giftingOrderWorkflow;
