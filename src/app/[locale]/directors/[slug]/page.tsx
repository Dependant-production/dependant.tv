/* eslint-disable @typescript-eslint/no-explicit-any */
import DirectorDetails from '@/components/templates/directorDetails/DirectorDetails'
// import axiosInstance from '@/helpers/axiosInstance'

// export async function getServerSideProps(context: any) {
//   const { slug } = context.params
//   const locale = context.locale

//   console.log('slug', slug)
//   console.log('locale', locale)

//   try {
//     const response = await axiosInstance.get(`/api/directors?filters[slug][$eq]=${slug}&locale=${locale}&populate=videos`)
// console.log('response', response)
//     if (!response.data?.data) {
//       return {
//         notFound: true, // Si aucun réalisateur n'est trouvé, retourne 404
//       }
//     }

//     return {
//       props: {
//         directorData: response.data.data[0], // Passe les données du directeur à la page
//       },
//     }
//   } catch (error) {
//     console.error('Error fetching data from Strapi:', error)
//     return {
//       notFound: true, // Retourner une page 404 si une erreur survient
//     }
//   }
// }

export default function DirectorPage() {
    return <DirectorDetails />
}
