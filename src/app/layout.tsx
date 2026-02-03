import './globals.css';

export const metadata = {
  title: 'AllStar Billing Service - Credentialing',
  description: 'Provider credentialing management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
