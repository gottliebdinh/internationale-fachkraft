import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }

  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { notificationId, markAllRead } = body;

  if (markAllRead) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
  } else if (notificationId) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id);
  }

  return NextResponse.json({ success: true });
}
