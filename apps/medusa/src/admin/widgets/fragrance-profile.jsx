import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text, Badge } from "@medusajs/ui";
import React from "react";

const FragranceProfileWidget = () => {
  return (
    <Container className="divide-y divide-gray-200 p-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <Heading level="h1" className="text-xl font-semibold text-gray-900">
            Fragrance Profile
          </Heading>
          <Text className="text-xs text-gray-500 mt-1">
            Custom olfactory properties of this fragrance product.
          </Text>
        </div>
        <Badge color="purple">Galle Custom Module</Badge>
      </div>
      <div className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text className="text-xs font-semibold text-gray-500 uppercase">Scent Family</Text>
            <Text className="text-sm font-medium text-gray-900 mt-1">Seeded from Galle Module</Text>
          </div>
          <div>
            <Text className="text-xs font-semibold text-gray-500 uppercase">Longevity</Text>
            <Text className="text-sm font-medium text-gray-900 mt-1">6 - 10 Hours</Text>
          </div>
          <div className="col-span-2">
            <Text className="text-xs font-semibold text-gray-500 uppercase">Notes Pyramid</Text>
            <div className="flex gap-2 mt-2">
              <Badge color="orange">Top Notes</Badge>
              <Badge color="red">Heart Notes</Badge>
              <Badge color="grey">Base Notes</Badge>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default FragranceProfileWidget;
