'use client'

import React, { useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'

const DeskFolioMobile = dynamic(
  () => import('./DeskFolioMobile').then((m) => m.DeskFolioMobile),
  {
    ssr: false,
    loading: () => (
      <section className="deskfolio-live">
        <div className="demo-stage deskfolio-demo-stage" style={{ minHeight: '80vh' }} />
      </section>
    ),
  },
)

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

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia('(max-width: 760px)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getMobileSnapshot() {
  return window.matchMedia('(max-width: 760px)').matches
}

function getServerSnapshot() {
  return false
}

export function DeskFolioPage() {
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerSnapshot)

  return isMobile ? <DeskFolioMobile /> : <DeskFolioDesktop />
}
