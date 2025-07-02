import { createFileRoute } from '@tanstack/react-router'
import { Camera } from '../components/Camera'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Food Logger
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Take a picture of your food to get started.
        </p>
      </div>
      <Camera />
    </div>
  )
}
