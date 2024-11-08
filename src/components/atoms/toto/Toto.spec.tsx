import { render, screen } from '@testing-library/react'
import Toto from './toto'
import '@testing-library/jest-dom'

describe('Toto', () => {
    it('should render the result of the addition', () => {
        render(<Toto a={3} b={5} />)
        expect(screen.getByText('8')).toBeInTheDocument()
    })

    it('should render the result of the addition for a = 10 and b = 15', () => {
        render(<Toto a={10} b={15} />)
        expect(screen.getByText('25')).toBeInTheDocument()
    })
})
