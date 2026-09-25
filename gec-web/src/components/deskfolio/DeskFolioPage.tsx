'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import './deskfolio-page.css'

const DeskFolioDesktop = dynamic(
  () => import('./DeskFolioDesktop').then((m) => m.DeskFolioDesktop),
  {
    ssr: false,
    loading: () => <div className="deskfolio-loading" aria-hidden="true" />,
  },
)

export function DeskFolioPage({ fillViewport = false }: { fillViewport?: boolean }) {
  return <DeskFolioDesktop fillViewport={fillViewport} />
}
