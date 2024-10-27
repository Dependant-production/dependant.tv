/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import useContentful from '@/hooks/useContentful';
import { useLocale } from 'next-intl';
import React from 'react'
 

export default function Infos() {
    const locale = useLocale();
console.log('locale', locale)
    const contentful: { fields: string }[] = useContentful('infos');
    const data: any = contentful[0]?.fields || {}
    console.log('contentful', contentful)

    return (
    <>
    <p>{data.mail}</p>
    <p>{data.phoneNumbers}</p>
    </>
  )
}
