'use client'
import React, { ChangeEvent, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import styles from './LocalSwitcher.module.scss'
import useMobile from '@/hooks/useMobile'

export default function LocalSwitcher({
    enOption,
    frOption,
}: {
    enOption: string
    frOption: string
}) {
    const router = useRouter()
    const isMobile = useMobile()
    const [isPending, startTransition] = useTransition()
    const currentLocale = useLocale()
    const pathname = usePathname()

    const blackRoutes = ['/photographers', '/contact']
    const isPhotographers = pathname.startsWith('/photographers')
    const isBlack = blackRoutes.some((route) => pathname.startsWith(route))
    const color =
        isBlack && isMobile && isPhotographers
            ? styles.white
            : isBlack
            ? styles.black
            : styles.white

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value as Locale
        startTransition(() => {
            router.replace({ pathname }, { locale: nextLocale })
        })
    }
    return (
        <label className={styles.localeButton}>
            <select
                defaultValue={currentLocale}
                onChange={onSelectChange}
                disabled={isPending}
                className={`${styles.select} ${color}`}
            >
                <option value="en" className={styles.option}>
                    {enOption}
                </option>
                <option value="fr" className={styles.option}>
                    {frOption}
                </option>
            </select>
        </label>
    )
}
