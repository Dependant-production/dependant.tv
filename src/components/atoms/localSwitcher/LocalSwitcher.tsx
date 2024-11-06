'use client'
import { usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import React, { ChangeEvent, useTransition } from 'react'
import styles from './LocalSwitcher.module.scss'

export default function LocalSwitcher({
    enOption,
    frOption,
}: {
    enOption: string
    frOption: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const currentLocale = useLocale()
    const pathname = usePathname()

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
                className={styles.select}
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
