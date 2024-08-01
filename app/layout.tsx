import './globals.css'

export const metadata = {
  title: 'Fleet Planner',
  description: 'A fleet planner for green transition designed for Shell need and beyond',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
