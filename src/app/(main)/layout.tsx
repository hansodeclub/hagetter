import Header from './Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <title>Hagetter</title>
      <body>
        <Header />
        <h1>Hagetter</h1>
        {children}
      </body>
    </html>
  )
}
