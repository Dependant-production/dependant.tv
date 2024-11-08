import { Header } from '@/components/layouts/Header'
import Loader from '@/components/molecules/loader/Loader'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ReactNode, Suspense } from 'react'

type Props = {
    children: ReactNode
    locale: string
    className: string
}

export default async function BaseLayout({ children, locale }: Props) {
    const messages = await getMessages()

    return (
        <html lang={locale}>
            <body>
                <Suspense fallback={<Loader isLoading={true} />}>
                    <NextIntlClientProvider messages={messages}>
                        <Header />
                        {children}
                    </NextIntlClientProvider>
                </Suspense>
            </body>
        </html>
    )
}
