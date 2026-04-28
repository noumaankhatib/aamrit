"use server";

import { revalidatePath } from "next/cache";
import { fulfillOrder, cancelOrder } from "@/lib/shopify-admin";

export async function fulfillOrderAction(
  orderId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const trackingCompany = formData.get("trackingCompany") as string | null;
  const trackingNumber = formData.get("trackingNumber") as string | null;
  const trackingUrl = formData.get("trackingUrl") as string | null;

  try {
    const success = await fulfillOrder(
      orderId,
      trackingCompany || undefined,
      trackingNumber || undefined,
      trackingUrl || undefined
    );

    if (success) {
      revalidatePath("/admin/orders");
      return { success: true };
    }

    return { success: false, error: "Failed to fulfill order" };
  } catch (error) {
    console.error("Fulfill order error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function cancelOrderAction(
  orderId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await cancelOrder(orderId, reason);

    if (success) {
      revalidatePath("/admin/orders");
      return { success: true };
    }

    return { success: false, error: "Failed to cancel order" };
  } catch (error) {
    console.error("Cancel order error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
