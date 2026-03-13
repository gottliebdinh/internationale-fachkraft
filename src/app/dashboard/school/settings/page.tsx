"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SchoolSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Submit to Supabase
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Schuleinstellungen</h2>
        <p className="text-muted-foreground">
          Verwalten Sie Ihr Schulprofil und Ihre Kontaktdaten
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Schulprofil</CardTitle>
            <CardDescription>Öffentliche Informationen Ihrer Schule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Schulname *</Label>
                <Input
                  id="name"
                  defaultValue="Deutsches Sprachzentrum Ho Chi Minh City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_number">Lizenznummer *</Label>
                <Input id="license_number" defaultValue="VN-DE-2024-0042" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" defaultValue="Ho Chi Minh City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="government_affiliation">Behördenzugehörigkeit</Label>
                <Input
                  id="government_affiliation"
                  defaultValue="Sở Lao động – TBXH"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Webseite</Label>
              <Input
                id="website"
                type="url"
                defaultValue="https://www.deutsches-sprachzentrum.vn"
                placeholder="https://"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontaktinformationen</CardTitle>
            <CardDescription>Ansprechpartner und Erreichbarkeit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_person">Ansprechpartner *</Label>
                <Input id="contact_person" defaultValue="Dr. Tran Minh" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input id="phone" type="tel" defaultValue="+84 28 1234 5678" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                defaultValue="info@deutsches-sprachzentrum.vn"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Die E-Mail-Adresse kann nur über die Kontoverwaltung geändert werden
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beschreibung</CardTitle>
            <CardDescription>Zusätzliche Informationen zu Ihrer Schule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Schulbeschreibung</Label>
              <Textarea
                id="description"
                defaultValue="Wir sind ein lizenziertes Sprachzentrum in Ho Chi Minh City mit Fokus auf B1/B2 Deutschkurse für die Fachkräfteausbildung im Gastgewerbe und Pflegebereich."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dokumente</CardTitle>
            <CardDescription>Verifizierungsdokumente Ihrer Schule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Lizenzurkunde</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div className="space-y-2">
                <Label>Akkreditierungsnachweis</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Wird gespeichert..." : "Einstellungen speichern"}
          </Button>
          <Button type="reset" variant="outline">
            Zurücksetzen
          </Button>
        </div>
      </form>
    </div>
  );
}
