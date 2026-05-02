"use server";

import { revalidatePath } from "next/cache";
import { fulfillOrder, cancelOrder, updateFulfillmentTracking, addOrderNote } from "@/lib/shopify-admin";

export async function fulfillOrderAction(
  orderId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const trackingCompany = formData.get("trackingCompany") as string | null;
  const trackingNumber = formData.get("trackingNumber") as string | null;
  const trackingUrl = formData.get("trackingUrl") as string | null;

  try {
    const result = await fulfillOrder(
      orderId,
      trackingCompany || undefined,
      trackingNumber || undefined,
      trackingUrl || undefined
    );

    if (result.success) {
      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId.split("/").pop()}`);
      return { success: true };
    }

    return { success: false, error: result.error || "Failed to fulfill order" };
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

export async function updateTrackingAction(
  fulfillmentId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const trackingCompany = formData.get("trackingCompany") as string | null;
  const trackingNumber = formData.get("trackingNumber") as string | null;
  const trackingUrl = formData.get("trackingUrl") as string | null;
  const notifyCustomer = formData.get("notifyCustomer") === "on";

  try {
    const result = await updateFulfillmentTracking(
      fulfillmentId,
      trackingCompany || undefined,
      trackingNumber || undefined,
      trackingUrl || undefined,
      notifyCustomer
    );

    if (result.success) {
      revalidatePath("/admin/orders");
      return { success: true };
    }

    return { success: false, error: result.error || "Failed to update tracking" };
  } catch (error) {
    console.error("Update tracking error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function addOrderNoteAction(
  orderId: string,
  note: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await addOrderNote(orderId, note);

    if (result.success) {
      revalidatePath("/admin/orders");
      return { success: true };
    }

    return { success: false, error: result.error || "Failed to add note" };
  } catch (error) {
    console.error("Add note error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
