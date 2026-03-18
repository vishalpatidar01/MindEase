import './globals.css'

export const metadata = {
  title: 'MindEase — AI Stress Detector',
  description: 'Tell me how you feel. I will measure your stress level and suggest relief tactics.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
