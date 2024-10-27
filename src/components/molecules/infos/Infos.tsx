"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import useContentful from '@/hooks/useContentful';
import React from 'react'
 

export default function Infos() {
    const contentful: { fields: any }[] = useContentful('infos');
    const data: any = contentful[0]?.fields || {}

    return (
    <>
    <p>{data?.mail}</p>
    <p>{data?.phoneNumbers}</p>
    </>
  )
}
