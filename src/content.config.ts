import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      category: z.string().optional(),
      // Video integration
      youtubeId: z.string().optional(),       // YouTube video ID if filmed
      tiktokUrl: z.string().optional(),        // TikTok URL if posted
      // Content pipeline status
      status: z.enum(['published', 'video-ready', 'needs-video', 'research']).default('published'),
      // Tags for filtering
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { blog };
