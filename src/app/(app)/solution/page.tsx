import { Suspense } from 'react'
import SolutionsListContent from './SolutionsListContent'

export default function SolutionsPage() {
  return (
    <Suspense fallback={null}>
      <SolutionsListContent />
    </Suspense>
  )
}