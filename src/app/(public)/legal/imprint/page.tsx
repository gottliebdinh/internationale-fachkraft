export default function ImprintPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Impressum
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <div className="rounded-xl bg-muted/30 p-6 text-sm ring-1 ring-foreground/10">
                <p className="font-semibold text-base mb-2">GeVin GmbH</p>
                <p className="text-muted-foreground">Musterstraße 123</p>
                <p className="text-muted-foreground">10115 Berlin</p>
                <p className="text-muted-foreground">Deutschland</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Vertreten durch</h2>
              <p className="text-muted-foreground">
                Geschäftsführer: Max Mustermann
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Kontakt</h2>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Telefon: +49 30 123 456 789</p>
                <p>Telefax: +49 30 123 456 790</p>
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:info@gevin.de"
                    className="text-accent hover:underline"
                  >
                    info@gevin.de
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Registereintrag</h2>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Eintragung im Handelsregister</p>
                <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
                <p>Registernummer: HRB 123456 B</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Umsatzsteuer-ID</h2>
              <p className="text-sm text-muted-foreground">
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a
                Umsatzsteuergesetz: DE 123 456 789
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Max Mustermann</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                Haftungsausschluss
              </h2>

              <h3 className="text-lg font-semibold mb-2">
                Haftung für Inhalte
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                Informationen nach den allgemeinen Gesetzen bleiben hiervon
                unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
                Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                möglich. Bei Bekanntwerden von entsprechenden
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>

              <h3 className="text-lg font-semibold mb-2">
                Haftung für Links
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Unser Angebot enthält Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                Verlinkung nicht erkennbar.
              </p>

              <h3 className="text-lg font-semibold mb-2">Urheberrecht</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
                der schriftlichen Zustimmung des jeweiligen Autors bzw.
                Erstellers. Downloads und Kopien dieser Seite sind nur für den
                privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                EU-Streitschlichtung
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
