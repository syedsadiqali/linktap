import { ImageResponse } from 'next/og'
import { getUserDetails } from "./getData"
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'

let userCache = getUserDetails();
 
// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
	// Font
//   const interSemiBold = fetch(
//     new URL('./Inter-SemiBold.ttf', import.meta.url)
//   ).then((res) => res.arrayBuffer())
  
  const { userDetails } = await userCache(params.slug);

 
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {userDetails.full_name}
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    //   fonts: [
    //     {
    //       name: 'Inter',
    //       data: await interSemiBold,
    //       style: 'normal',
    //       weight: 400,
    //     },
    //   ],
    }
  )
}