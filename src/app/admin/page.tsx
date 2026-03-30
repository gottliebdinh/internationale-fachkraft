import { redirect } from "next/navigation";

/** Einstieg Admin: vorübergehend nur Leads sichtbar; Kandidaten unter `/admin/candidates`. */
export default function AdminIndexPage() {
  redirect("/admin/leads");
}
