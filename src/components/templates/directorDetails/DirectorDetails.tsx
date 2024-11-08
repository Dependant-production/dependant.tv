// 'use client';
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useRouter } from 'next/router';
// import React, {  useEffect, useState } from 'react';
// import client from '@/utils/contentful';

// interface DirectorDetailsProps {
//     params: {
//         name: string;
//     };
// }

// interface ProjectsProps {
//     projectName: string | null;
//     mediaUrls: { url: string | undefined }[];
//   }

// export default function DirectorDetails({ params }: DirectorDetailsProps) {

//     const router = useRouter();
//     // const { name } = router.query;
//     console.log('router', router)
//     // console.log('name', name)
//   const [projects, setProjects] = useState<ProjectsProps[]>([]);
//   const [directorName, setDirectorName] = useState<string>('');

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await client.getEntries({
//           content_type: 'directorsProjects',
//           'fields.directorName.sys.contentType.sys.id': 'directors',
//           'fields.directorName.fields.name': params.name,
//         });

//         console.log('response', response)

//         if (response.items.length > 0) {
//             const directorName = (response.items[0]?.fields?.directorName as any)?.fields?.name as string;
//             setDirectorName(directorName);
//           setProjects(response.items.map((item) => {
//             const mediaUrls = Array.isArray(item.fields.mediaUrls) ?
//               item.fields.mediaUrls.map((mediaItem: any) => ({
//                 url: mediaItem.fields.file.url as string,
//               })) : [];

//             return {
//               projectName: item.fields.projectName as string,
//               mediaUrls,
//             };
//           }))
//       } }catch (error) {
//         console.error('Error fetching projects from Contentful:', error);
//       }
//     };

//     fetchProjects();
//   }, [params.name]);

//   console.log('directorName', directorName)
//   console.log('projects', projects)
//   return (
//     <main >
//       <h1>Projets de {directorName}</h1>
//       <section >
//         {/* {projects.map((project, index) => (
//           <div key={index} className={styles.projectItem}>
//             <h2>toto</h2>  // {project?.title}
//             <p>{project?.description}</p>
//             {project?.videoUrl ? (
//               <video
//                 className={styles.projectVideo}
//                 src={project.videoUrl}
//                 controls
//                 loop
//               />
//             ) : (
//               <img
//                 className={styles.projectImage}
//                 src={project.imageUrl}
//                 alt={project.title}
//               />
//             )}
//           </div>
//         ))} */}
//         <div>toto</div>
//       </section>
//     </main>
//   );
// }
