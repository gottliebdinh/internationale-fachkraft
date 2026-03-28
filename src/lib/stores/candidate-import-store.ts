import { create } from "zustand";

type FileStatus = "pending" | "analyzing" | "analyzed" | "uploading" | "uploaded" | "error";

export interface TrackedFile {
  name: string;
  status: FileStatus;
  docClass: string | null;
  hasFace: boolean;
  error: string | null;
}

export type ImportPhase =
  | "idle"
  | "running"
  | "merging"
  | "uploading"
  | "done"
  | "error";

export interface ImportState {
  phase: ImportPhase;
  files: TrackedFile[];
  folderName: string | null;
  mergedName: string | null;
  mergedLevel: string | null;
  mergedPosition: string | null;
  candidateId: string | null;
  errorMsg: string | null;
  currentFile: string | null;
}

interface ImportActions {
  startImport: (fileList: File[], folderName: string) => void;
  reset: () => void;
}

const INITIAL: ImportState = {
  phase: "idle",
  files: [],
  folderName: null,
  mergedName: null,
  mergedLevel: null,
  mergedPosition: null,
  candidateId: null,
  errorMsg: null,
  currentFile: null,
};

const SUPPORTED = new Set([".pdf", ".jpg", ".jpeg", ".png", ".webp"]);
function isSupported(name: string) {
  const i = name.lastIndexOf(".");
  return SUPPORTED.has(i >= 0 ? name.slice(i).toLowerCase() : "");
}

export const useCandidateImportStore = create<ImportState & ImportActions>(
  (set, get) => ({
    ...INITIAL,

    reset() {
      set(INITIAL);
    },

    startImport(fileList, folderName) {
      const supported = fileList.filter((f) => isSupported(f.name));
      if (supported.length === 0) {
        set({
          ...INITIAL,
          phase: "error",
          errorMsg: "Keine unterstützten Dateien (.pdf, .jpg, .png, .webp).",
        });
        return;
      }

      set({
        phase: "running",
        folderName,
        files: supported.map((f) => ({
          name: f.name,
          status: "pending",
          docClass: null,
          hasFace: false,
          error: null,
        })),
        mergedName: null,
        mergedLevel: null,
        mergedPosition: null,
        candidateId: null,
        errorMsg: null,
        currentFile: null,
      });

      const fd = new FormData();
      fd.append("folder_name", folderName);
      for (const f of supported) fd.append("files", f);

      (async () => {
        try {
          const res = await fetch("/api/admin/candidates/import", {
            method: "POST",
            body: fd,
          });
          if (!res.ok || !res.body) {
            set({ phase: "error", errorMsg: await res.text() });
            return;
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const data = line.replace(/^data: /, "").trim();
              if (data) {
                try {
                  processEvent(JSON.parse(data), set, get);
                } catch { /* skip malformed */ }
              }
            }
          }
          if (buffer.trim()) {
            const data = buffer.replace(/^data: /, "").trim();
            if (data) {
              try { processEvent(JSON.parse(data), set, get); } catch { /* */ }
            }
          }
        } catch (err) {
          set({
            phase: "error",
            errorMsg: err instanceof Error ? err.message : "Verbindungsfehler",
          });
        }
      })();
    },
  })
);

type SetFn = (partial: Partial<ImportState>) => void;
type GetFn = () => ImportState;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processEvent(event: any, set: SetFn, get: GetFn) {
  const { files } = get();

  switch (event.type) {
    case "analyzing":
      set({
        currentFile: event.file,
        files: files.map((f, i) =>
          i === event.index ? { ...f, status: "analyzing" } : f
        ),
      });
      break;

    case "analyzed":
      set({
        files: files.map((f, i) =>
          i === event.index
            ? {
                ...f,
                status: event.error ? "error" : "analyzed",
                docClass: event.docClass,
                hasFace: event.hasFace,
                error: event.error,
              }
            : f
        ),
      });
      break;

    case "merging":
      set({ phase: "merging", currentFile: null });
      break;

    case "merged":
      set({
        phase: "uploading",
        mergedName: event.name,
        mergedLevel: event.germanLevel,
        mergedPosition: event.position,
      });
      break;

    case "uploading":
      set({
        currentFile: event.file,
        files: files.map((f, i) =>
          i === event.index ? { ...f, status: "uploading" } : f
        ),
      });
      break;

    case "uploaded":
      set({
        files: files.map((f, i) =>
          i === event.index ? { ...f, status: "uploaded" } : f
        ),
      });
      break;

    case "done":
      set({ phase: "done", candidateId: event.candidateId, currentFile: null });
      break;

    case "error":
      set({ phase: "error", errorMsg: event.message, currentFile: null });
      break;
  }
}
