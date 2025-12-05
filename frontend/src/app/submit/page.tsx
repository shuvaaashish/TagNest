'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  dataset: z.string().min(1, 'Please select a dataset'),
  label: z.string().min(1, 'Please select a label'),
  image: z.any() 
    // Validation for file existence
    .refine((files) => files?.length === 1, "Image is required.")
    // Validation for file size (e.g. 5MB)
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    // Validation for file type
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      "Only .jpg, .png, and .webp formats are supported."
    ),
});

interface Label {
  id: number;
  name: string;
}

interface Dataset {
  id: number;
  name: string;
  labels: Label[];
}

export default function SubmitPage() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataset: '',
      label: '',
    },
  });

  const selectedDatasetId = form.watch('dataset');
  
  // Derived state to get labels for selected dataset
  const availableLabels = datasets.find(d => d.id.toString() === selectedDatasetId)?.labels || [];

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await api.get('/datasets/');
      setDatasets(response.data);
    } catch (error) {
      toast.error('Failed to load datasets');
    } finally {
      setLoadingDatasets(false);
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    const formData = new FormData();
    formData.append('dataset', values.dataset);
    formData.append('label', values.label);
    formData.append('image', values.image[0]);

    try {
      await api.post('/submissions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Image submitted successfully!');
      router.push('/dashboard');
    } catch (error) {
        console.error(error);
      toast.error('Failed to submit image.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Submit New Image</CardTitle>
            <CardDescription>
              Upload an image and assign it a label from a dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDatasets ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 overflow-hidden relative"
                            >
                              {preview ? (
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="absolute inset-0 w-full h-full object-contain p-2"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WEBP (MAX. 5MB)</p>
                                </div>
                              )}
                              <input 
                                {...fieldProps}
                                id="dropzone-file" 
                                type="file" 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/webp"
                                onChange={(event) => {
                                  onChange(event.target.files);
                                  onImageChange(event);
                                }}
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dataset Selection */}
                    <FormField
                      control={form.control}
                      name="dataset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dataset</FormLabel>
                          <Select 
                            onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue('label', ''); // Reset label when dataset changes
                            }} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a dataset" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {datasets.map((dataset) => (
                                    <SelectItem key={dataset.id} value={dataset.id.toString()}>
                                        {dataset.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                              The collection this image belongs to.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Label Selection */}
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                                disabled={!selectedDatasetId}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a label" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {availableLabels.map((label) => (
                                        <SelectItem key={label.id} value={label.id.toString()}>
                                            {label.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Classify the image.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                          Cancel
                      </Button>
                      <Button type="submit" className="w-full" disabled={uploading}>
                          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {uploading ? 'Submitting...' : 'Submit Image'}
                      </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
