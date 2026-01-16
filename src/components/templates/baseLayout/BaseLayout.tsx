import { Header } from '@/components/layouts/Header'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ReactNode } from 'react'

type Props = {
    children: ReactNode
    className: string
}

export default async function BaseLayout({ children, className }: Props) {
    const messages = await getMessages()

    return (
     <div className={className}>
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    {children}
                </NextIntlClientProvider>
     </div>
    
    )
}
