import "./globals.css";

export const metadata = {
  title: "Bootstrap — Liste prioritaire",
  description: "Inscrivez-vous pour commander Bootstrap en priorité dès sa sortie officielle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
