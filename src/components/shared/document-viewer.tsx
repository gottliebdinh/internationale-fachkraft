"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  FileText,
  CheckCircle,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { logAuditEvent } from "@/lib/supabase/actions";
import type { DocumentType } from "@/types/database";

interface DocumentViewerProps {
  fileUrl: string;
  fileName: string;
  documentType: DocumentType;
  uploadedAt: string;
  verified: boolean;
  entityId: string;
  trigger?: React.ReactNode;
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: "Reisepass",
  b1_certificate: "B1-Zertifikat",
  cv: "Lebenslauf",
  diploma: "Abschlusszeugnis",
  health_certificate: "Gesundheitszeugnis",
  video: "Video-Vorstellung",
  cover_letter: "Anschreiben",
  school_records: "Schulzeugnis",
  photo: "Foto",
  application_bundle: "Bewerbungsunterlagen",
  other: "Sonstiges",
};

function isPdf(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf") || url.includes("pdf");
}

function isImage(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(url);
}

export function DocumentViewer({
  fileUrl,
  fileName,
  documentType,
  uploadedAt,
  verified,
  entityId,
  trigger,
}: DocumentViewerProps) {
  const [open, setOpen] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (open && !logged) {
      logAuditEvent("document_viewed", "document", entityId, {
        fileName,
        documentType,
      });
      setLogged(true);
    }
  }, [open, logged, entityId, fileName, documentType]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setLogged(false);
  }

  const formattedDate = new Date(uploadedAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Eye data-icon="inline-start" />
            Anzeigen
          </Button>
        }
      />
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            {fileName}
          </DialogTitle>
          <DialogDescription>
            Dokumentvorschau und Details
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="secondary">
            {DOCUMENT_TYPE_LABELS[documentType] ?? documentType}
          </Badge>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3.5" />
            {formattedDate}
          </span>
          {verified ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              <CheckCircle className="size-3.5 mr-1" />
              Verifiziert
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Nicht verifiziert
            </Badge>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border bg-muted/30">
          {isPdf(fileUrl) ? (
            <iframe
              src={fileUrl}
              title={fileName}
              className="h-[60vh] w-full"
            />
          ) : isImage(fileUrl) ? (
            <div className="flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileUrl}
                alt={fileName}
                className="max-h-[60vh] rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-12 text-muted-foreground">
              <ImageIcon className="size-12" />
              <p className="text-sm">
                Vorschau für diesen Dateityp nicht verfügbar.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button asChild variant="outline">
            <a href={fileUrl} download={fileName} target="_blank" rel="noopener noreferrer">
              <Download data-icon="inline-start" />
              Herunterladen
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
