// 'use client'

// import { usePathname } from '@/i18n/routing'
// import { useGSAP } from '@gsap/react'
// import { gsap } from 'gsap'
// import { ReactNode, useRef } from 'react'

// export default function PageTransitionWrapper({
//     children,
// }: {
//     children: ReactNode
// }) {
//     const pathname = usePathname()
//     const previousPath = useRef<string | null>(null)

//     useGSAP(() => {
//         if (previousPath.current !== null) {
//             // Animation de sortie
//             gsap.fromTo(
//                 '.page-transition',
//                 {
//                     opacity: 1,
//                 },
//                 {
//                     opacity: 0,
//                     duration: 0.5,
//                     ease: 'power2.out',
//                     onComplete: () => {
//                         // Animation d'entrée après la sortie
//                         gsap.fromTo(
//                             '.page-transition',
//                             { opacity: 0 },
//                             { opacity: 1, duration: 0.5, ease: 'power2.out' }
//                         )
//                     },
//                 }
//             )
//         }
//         previousPath.current = pathname // Mettre à jour le chemin précédent
//     }, [pathname])

//     return <div className="page-transition">{children}</div>
// }
