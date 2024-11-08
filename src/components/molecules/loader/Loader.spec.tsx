import { render, screen, waitFor } from '@testing-library/react'
import Loader from '@/components/molecules/loader/Loader'
import React, { Suspense, lazy } from 'react'
import '@testing-library/jest-dom'

// Typage explicite du module importé
const LazyLoadedComponent = lazy(
    () =>
        new Promise<{ default: React.ComponentType }>((resolve) => {
            setTimeout(
                () => resolve({ default: () => <div>data loaded</div> }),
                500
            ) // Délai de 500 ms
        })
)

describe('Loader Component with Suspense', () => {
    it('should display the loader during data loading', async () => {
        render(
            <Suspense fallback={<Loader isLoading={true} />}>
                <LazyLoadedComponent />
            </Suspense>
        )

        // Vérifie que le loader est affiché initialement
        expect(screen.getByAltText('loader')).toBeInTheDocument()

        // Attends que le composant chargé s'affiche
        await waitFor(
            () => {
                expect(screen.getByText('data loaded')).toBeInTheDocument()
            },
            { timeout: 1000 }
        )

        // Vérifie que le loader disparaît une fois les données chargées
        expect(screen.queryByAltText('loader')).not.toBeInTheDocument()
    })
})
