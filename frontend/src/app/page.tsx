import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Layout, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Layers className="w-6 h-6 text-primary" />
            <span>TagNest</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center">
        <section className="py-24 lg:py-32 px-4 text-center space-y-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Collaborative Image Labeling <br className="hidden md:inline" /> Made Simple.
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              TagNest helps you organize, annotate, and manage your image datasets with ease. Crowdsource labels and build better AI models faster.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-lg gap-2">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com/shuvaaashish/TagNest" target="_blank">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                View on GitHub
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Layout className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">intuitive Dashboard</h3>
              <p className="text-muted-foreground">
                Track your contributions and manage your submissions in one central hub.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Organized Datasets</h3>
              <p className="text-muted-foreground">
                Work with structured datasets and predefined labels for consistency.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Quality Control</h3>
              <p className="text-muted-foreground">
                Ensure high-quality data for your machine learning models.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} TagNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
