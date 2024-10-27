"use client"
import client from '@/utils/contentful'
import { useEffect, useState } from 'react';


export default function useContentful(entry: string) {
const [ data, setData] = useState([]);
console.log('data', data)
console.log('Fetching data for content type:', entry);
useEffect(() => {
    const fetchData = async () => {
        try {
            const response = client.getEntries({
                content_type: entry
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setData((await response).items as any)
            console.log('response', response)
        } catch (error) {
            console.error('Erreur lors de la récupération des données Contentful :', error);
        }
    }
    fetchData()
}, [entry])

return data 
}