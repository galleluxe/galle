import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

type SampleDispatchInput = {
  customer_id: string;
  product_handle: string;
  sample_sku?: string;
};

/**
 * Discovery sample dispatch workflow — queues a sample shipment request.
 */
export const sampleDispatchWorkflow = createWorkflow(
  "sample-dispatch",
  (input: SampleDispatchInput) => {
    return new WorkflowResponse({
      customer_id: input.customer_id,
      product_handle: input.product_handle,
      sample_sku: input.sample_sku ?? "SAMPLE-5ML",
      status: "queued",
      queued_at: new Date().toISOString(),
    });
  }
);

export default sampleDispatchWorkflow;
