'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const DeskFolioDesktop = dynamic(
  () => import('./DeskFolioDesktop').then((m) => m.DeskFolioDesktop),
  {
    ssr: false,
    loading: () => (
      <section className="deskfolio-live">
        <div className="demo-stage deskfolio-demo-stage" style={{ minHeight: '80vh' }} />
      </section>
    ),
  },
)

export function DeskFolioPage() {
  return <DeskFolioDesktop />
}
