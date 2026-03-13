"use server";

import { createClient } from "@/lib/supabase/server";
import type { NotificationType } from "@/types/database";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}

export async function createNotification({
  userId,
  type,
  title,
  body,
  link,
}: CreateNotificationParams) {
  const supabase = await createClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body,
    link,
  });

  if (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function getUnreadNotifications(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("read", false)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }

  return data || [];
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = await createClient();

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
}

export async function notifyMatchProposed(
  schoolUserId: string,
  candidateName: string,
  employerName: string,
  matchId: string
) {
  await createNotification({
    userId: schoolUserId,
    type: "match_proposed",
    title: "Neue Match-Anfrage",
    body: `${employerName} möchte ${candidateName} für eine Stelle vorschlagen.`,
    link: `/dashboard/school/matches/${matchId}`,
  });
}

export async function notifyMatchStatusChanged(
  userId: string,
  candidateName: string,
  newStatus: string,
  matchId: string
) {
  await createNotification({
    userId,
    type: "status_changed",
    title: "Match-Status geändert",
    body: `Der Match für ${candidateName} wurde auf "${newStatus}" aktualisiert.`,
    link: `/dashboard/employer/matches/${matchId}`,
  });
}

export async function notifyDocumentRequired(
  userId: string,
  documentType: string,
  matchId: string
) {
  await createNotification({
    userId,
    type: "document_required",
    title: "Dokument erforderlich",
    body: `Bitte laden Sie das Dokument "${documentType}" hoch.`,
    link: `/dashboard/employer/matches/${matchId}`,
  });
}
