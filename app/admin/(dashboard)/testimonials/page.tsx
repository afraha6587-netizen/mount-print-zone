import { db } from '@/lib/db';
import { TestimonialManagerView } from '@/components/admin/testimonial-manager-view';

export const revalidate = 0;

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <TestimonialManagerView initialTestimonials={JSON.parse(JSON.stringify(testimonials))} />;
}
