import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, BarChart3, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Streamline Your Lab Management
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Powerful tools to manage, track, and analyze lab components with ease. Perfect for students and
            administrators who want to focus on what matters most.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/students">Student Portal</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/admin">Admin Portal</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Component Management</h3>
            <p className="text-gray-400">Manage lab components with detailed tracking and inventory control.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Student Tracking</h3>
            <p className="text-gray-400">Track and manage student borrowing with real-time updates.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-400">Visualize component usage with powerful analytics and insights.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-400">Stay updated with real-time component tracking and status.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

