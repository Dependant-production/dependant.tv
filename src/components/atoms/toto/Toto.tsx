import React from 'react'

interface totoProps {
    a: number
    b: number
}

export default function Toto({ a, b }: totoProps) {
    const add = (a: number, b: number) => {
        return a + b
    }
    const result = add(a, b)
    return <div>{result}</div>
}
