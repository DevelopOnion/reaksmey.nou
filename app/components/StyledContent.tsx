"use client"

import type { ReactNode } from "react"

export default function StyledContent({ children }: { children: ReactNode }) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap');
        
        .custom-title {
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }
      `}</style>
      {children}
    </>
  )
}

