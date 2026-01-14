import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Data Academy | AI-Powered Learning for Data Professionals',
    description: 'Master Data Analytics & Data Science with AI tutors. International standard curriculum. Interactive coding challenges with personalized feedback.',
    keywords: ['data analytics', 'data science', 'machine learning', 'AI learning', 'online course'],
    authors: [{ name: 'Data Academy' }],
    openGraph: {
        title: 'Data Academy | AI-Powered Learning',
        description: 'Master Data Analytics & Data Science with AI tutors',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gray-950">
                {children}
            </body>
        </html>
    )
}
