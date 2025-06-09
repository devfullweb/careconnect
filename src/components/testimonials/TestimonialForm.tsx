
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface Caregiver {
  id: string;
  first_name: string;
  last_name: string;
}

interface TestimonialFormData {
  caregiver_id: string;
  rating: number;
  content: string;
}

interface TestimonialFormProps {
  caregivers: Caregiver[];
  loading: boolean;
  submitting: boolean;
  onSubmit: (data: TestimonialFormData) => Promise<boolean>;
}

export const TestimonialForm = ({ caregivers, loading, submitting, onSubmit }: TestimonialFormProps) => {
  const [formData, setFormData] = useState<TestimonialFormData>({
    caregiver_id: '',
    rating: 5,
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.caregiver_id || !formData.content.trim()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        caregiver_id: '',
        rating: 5,
        content: ''
      });
    }
  };

  const renderStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setFormData({ ...formData, rating: index + 1 })}
        className="transition-colors hover:scale-110"
      >
        <Star
          className={`h-6 w-6 ${
            index < currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-muted animate-pulse rounded"></div>
        <div className="h-10 bg-muted animate-pulse rounded"></div>
        <div className="h-32 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="caregiver">Selecione o Cuidador</Label>
        <Select
          value={formData.caregiver_id}
          onValueChange={(value) => setFormData({ ...formData, caregiver_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Escolha um cuidador..." />
          </SelectTrigger>
          <SelectContent>
            {caregivers.map((caregiver) => (
              <SelectItem key={caregiver.id} value={caregiver.id}>
                {`${caregiver.first_name || ''} ${caregiver.last_name || ''}`.trim() || 'Nome não disponível'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Avaliação</Label>
        <div className="flex items-center gap-1">
          {renderStars(formData.rating)}
          <span className="ml-2 text-sm text-muted-foreground">
            {formData.rating}/5
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Seu Depoimento</Label>
        <Textarea
          id="content"
          placeholder="Compartilhe sua experiência com este cuidador..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={submitting || !formData.caregiver_id || !formData.content.trim()}
        className="w-full"
      >
        {submitting ? 'Enviando...' : 'Enviar Depoimento'}
      </Button>
    </form>
  );
};
