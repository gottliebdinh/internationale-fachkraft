/**
 * Server Actions, die `redirect()` aufrufen, werfen einen speziellen Fehler.
 * In Client-`try/catch` um Server Actions muss dieser weitergeworfen werden,
 * sonst erscheint fälschlich eine generische Fehlermeldung.
 */
export { isRedirectError } from "next/dist/client/components/redirect-error";
