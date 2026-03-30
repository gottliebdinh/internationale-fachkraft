export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Datenschutzerklärung
            </h1>
            <p className="mt-4 text-muted-foreground">
              Stand: März 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                1. Verantwortlicher
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung
                (DSGVO) und anderer nationaler Datenschutzgesetze sowie
                sonstiger datenschutzrechtlicher Bestimmungen ist:
              </p>
              <div className="mt-4 rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground ring-1 ring-foreground/10">
                <p>Lotus&Eagle GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
                <p className="mt-2">E-Mail: datenschutz@lotus-eagle.de</p>
                <p>Telefon: +49 30 123 456 789</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                2. Erhobene Daten
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Wir erheben und verarbeiten folgende personenbezogene Daten:
              </p>
              <h3 className="text-lg font-semibold mb-2">
                2.1 Automatisch erhobene Daten
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer-URL (die zuvor besuchte Seite)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-2">
                2.2 Bei Registrierung erhobene Daten
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Name, Vorname</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer</li>
                <li>Firmenname und Firmendaten (bei Arbeitgebern)</li>
                <li>Schulbezeichnung und Schulinformationen (bei Partnerschulen)</li>
                <li>Berufliche Qualifikationen und Sprachzertifikate (bei Kandidaten)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-2">
                2.3 Im Vermittlungsprozess erhobene Daten
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Lebensläufe und Bewerbungsunterlagen</li>
                <li>Ausbildungs- und Berufsabschlüsse</li>
                <li>Sprachzertifikate und Prüfungsergebnisse</li>
                <li>Reisepassdaten (für Visumsbeantragung)</li>
                <li>Gesundheitszeugnisse</li>
                <li>IHK-Dokumente und Vertragsunterlagen</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                3. Zweck der Datenverarbeitung
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Die Verarbeitung personenbezogener Daten erfolgt zu folgenden
                Zwecken:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Bereitstellung und Betrieb der Plattform</li>
                <li>Durchführung des Registrierungsprozesses</li>
                <li>Matching von Kandidaten und Arbeitgebern</li>
                <li>Erstellung IHK-konformer Dokumente</li>
                <li>Unterstützung bei der Visumsbeantragung</li>
                <li>Kommunikation mit Nutzern</li>
                <li>Verbesserung unserer Dienstleistungen</li>
                <li>Erfüllung rechtlicher Verpflichtungen</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                4. Rechtsgrundlage
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage
                folgender Rechtsgrundlagen:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung:
                  Soweit wir Ihre Einwilligung zur Verarbeitung eingeholt haben.
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> –
                  Vertragserfüllung: Soweit die Verarbeitung zur Erfüllung
                  eines Vertrages erforderlich ist.
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. c DSGVO</strong> – Rechtliche
                  Verpflichtung: Soweit die Verarbeitung zur Erfüllung einer
                  rechtlichen Verpflichtung erforderlich ist.
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigtes
                  Interesse: Soweit die Verarbeitung zur Wahrung unserer
                  berechtigten Interessen erforderlich ist.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                5. Datenweitergabe
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt
                nur in folgenden Fällen:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>
                  Im Rahmen des Vermittlungsprozesses an den jeweiligen
                  Arbeitgeber bzw. die jeweilige Partnerschule (nur mit Ihrer
                  ausdrücklichen Zustimmung)
                </li>
                <li>
                  An Behörden und Institutionen (z. B. IHK, Ausländerbehörde)
                  im Rahmen der gesetzlich vorgeschriebenen
                  Dokumentenpflichten
                </li>
                <li>
                  An IT-Dienstleister, die im Auftrag von Lotus&Eagle Daten
                  verarbeiten (Auftragsverarbeiter gemäß Art. 28 DSGVO)
                </li>
                <li>
                  Soweit wir gesetzlich dazu verpflichtet sind
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Eine Übermittlung personenbezogener Daten in Drittstaaten
                (außerhalb der EU/des EWR) findet nur statt, wenn dies zur
                Durchführung des Vermittlungsprozesses erforderlich ist und
                geeignete Garantien gemäß Art. 46 DSGVO vorliegen.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                6. Speicherdauer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Personenbezogene Daten werden nur so lange gespeichert, wie es
                für die Erfüllung des jeweiligen Verarbeitungszwecks
                erforderlich ist oder gesetzliche Aufbewahrungsfristen dies
                vorsehen. Nach Beendigung des Vertragsverhältnisses werden Ihre
                Daten gelöscht, sofern keine gesetzlichen
                Aufbewahrungspflichten bestehen. Handels- und
                steuerrechtliche Aufbewahrungsfristen betragen in der Regel 6
                bis 10 Jahre.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                7. Betroffenenrechte
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sie haben folgende Rechte hinsichtlich Ihrer personenbezogenen
                Daten:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben
                  das Recht, Auskunft über Ihre bei uns gespeicherten
                  personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  <strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie
                  haben das Recht auf Berichtigung unrichtiger Daten.
                </li>
                <li>
                  <strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie haben
                  das Recht auf Löschung Ihrer Daten, sofern keine
                  gesetzlichen Aufbewahrungspflichten entgegenstehen.
                </li>
                <li>
                  <strong>
                    Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):
                  </strong>{" "}
                  Sie können die Einschränkung der Verarbeitung Ihrer Daten
                  verlangen.
                </li>
                <li>
                  <strong>
                    Recht auf Datenübertragbarkeit (Art. 20 DSGVO):
                  </strong>{" "}
                  Sie haben das Recht, Ihre Daten in einem gängigen Format zu
                  erhalten.
                </li>
                <li>
                  <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie
                  können der Verarbeitung Ihrer Daten jederzeit widersprechen.
                </li>
                <li>
                  <strong>
                    Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3
                    DSGVO):
                  </strong>{" "}
                  Sie können eine erteilte Einwilligung jederzeit widerrufen.
                </li>
                <li>
                  <strong>Beschwerderecht (Art. 77 DSGVO):</strong> Sie haben
                  das Recht, sich bei einer Aufsichtsbehörde zu beschweren.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:
                datenschutz@lotus-eagle.de
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                8. Cookies und Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Unsere Website verwendet technisch notwendige Cookies, die für
                den Betrieb der Plattform erforderlich sind. Diese Cookies
                werden automatisch gelöscht, wenn Sie Ihren Browser schließen.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Analyse-Cookies und Tracking-Tools werden nur mit Ihrer
                ausdrücklichen Einwilligung eingesetzt. Sie können Ihre
                Cookie-Einstellungen jederzeit über den Cookie-Banner ändern.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                9. Datensicherheit
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Wir treffen angemessene technische und organisatorische
                Maßnahmen zum Schutz Ihrer personenbezogenen Daten gegen
                unbefugten Zugriff, Verlust oder Zerstörung. Dazu gehören
                unter anderem: Verschlüsselung der Datenübertragung (TLS/SSL),
                verschlüsselte Dokumentenspeicherung, regelmäßige
                Sicherheitsaudits, strenge Zugriffskontrollen und
                Audit-Logging.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                10. Änderungen dieser Datenschutzerklärung
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen,
                um sie an geänderte Rechtslagen oder Änderungen unserer
                Dienstleistungen anzupassen. Die aktuelle Version ist stets
                auf unserer Website abrufbar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
