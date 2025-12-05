'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Image as ImageIcon, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Submission {
  id: number;
  dataset: number; // ID
  label: number; // ID
  image: string; // URL
  created_at: string;
}

// We need to fetch dataset/label names or we can just show IDs for MVP
// Better: Fetch Label name or store it flattened if possible.
// For now, let's just display ID or try to fetch extra info.
// Given the complexity, let's just display the image and ID/Date first.

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/');
      setSubmissions(response.data.submissions);
      setTotalCount(response.data.total_submissions);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <main className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.username}. Here is an overview of your contributions.
            </p>
          </div>
          <Link href="/submit">
            <Button className="w-full md:w-auto gap-2">
              <PlusCircle className="w-4 h-4" />
              Submit New Image
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">Images labeled and submitted</p>
            </CardContent>
          </Card>
          {/* Placeholder for future stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Score</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Recent Submissions</h2>
            {submissions.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border-dashed">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-semibold">No submissions yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Start contributing by submitting your first labeled image.
                    </p>
                    <Link href="/submit">
                        <Button variant="outline">Submit Image</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {submissions.map((sub) => (
                        <Card key={sub.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                            <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                                {/* Next.js Image component needs configured domains, so using standard img for external/localhost URLs for now */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={sub.image} 
                                    alt={`Submission ${sub.id}`}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium truncate" title={`Dataset ${sub.dataset}`}>Dataset #{sub.dataset}</span>
                                    <span className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    Label #{sub.label}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
