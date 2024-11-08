// Loader.spec.tsx
import { render, screen, waitFor } from '@testing-library/react'
import Loader from '@/components/molecules/loader/Loader'
import React, { Suspense } from 'react'
import '@testing-library/jest-dom'

const TestComponent = () => {
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 3000) // Simule un délai de 3 secondes pour les données
    }, [])

    return (
        <Suspense fallback={<Loader isLoading={true} />}>
            {!loading ? <div>Données chargées</div> : null}
        </Suspense>
    )
}

describe('Loader Component', () => {
    it('devrait afficher le loader pendant le chargement des données', async () => {
        render(<TestComponent />)

        // Vérifie si le loader est affiché initialement
        expect(screen.getByAltText('loader')).toBeInTheDocument()

        // Attends que les données soient chargées
        await waitFor(() => {
            expect(screen.getByText('Données chargées')).toBeInTheDocument()
        })

        // Vérifie que le loader disparaît une fois les données chargées
        expect(screen.queryByAltText('loader')).not.toBeInTheDocument()
    })
})
