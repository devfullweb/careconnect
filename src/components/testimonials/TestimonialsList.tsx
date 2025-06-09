
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  caregiver_name: string;
  caregiver_id: string;
}

interface TestimonialsListProps {
  testimonials: Testimonial[];
  loading: boolean;
}

export const TestimonialsList = ({ testimonials, loading }: TestimonialsListProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Você ainda não enviou nenhum depoimento.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Use o formulário ao lado para enviar seu primeiro depoimento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderStars(testimonial.rating)}
              <Badge variant="secondary" className="text-xs">
                {testimonial.rating}/5
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(testimonial.created_at)}
            </span>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            {testimonial.content}
          </p>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-medium text-muted-foreground">
              Cuidador: {testimonial.caregiver_name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
