
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Testimonial {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  caregiver_name: string;
  caregiver_id: string;
}

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

export const useTestimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          id,
          rating,
          content,
          created_at,
          caregiver_id,
          profiles!testimonials_caregiver_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        toast.error('Erro ao carregar depoimentos');
        return;
      }

      const mappedTestimonials = data?.map(item => ({
        id: item.id,
        rating: item.rating || 0,
        content: item.content,
        created_at: item.created_at,
        caregiver_name: item.profiles ? 
          `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() : 
          'Cuidador não encontrado',
        caregiver_id: item.caregiver_id || ''
      })) || [];

      setTestimonials(mappedTestimonials);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro inesperado ao carregar depoimentos');
    }
  };

  const fetchCaregivers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('type', 'caregiver')
        .order('first_name');

      if (error) {
        console.error('Error fetching caregivers:', error);
        toast.error('Erro ao carregar cuidadores');
        return;
      }

      setCaregivers(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro inesperado ao carregar cuidadores');
    }
  };

  const submitTestimonial = async (formData: TestimonialFormData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          customer_id: user.id,
          caregiver_id: formData.caregiver_id,
          rating: formData.rating,
          content: formData.content,
          published: true,
          name: 'Customer' // Default name, could be enhanced later
        });

      if (error) {
        console.error('Error submitting testimonial:', error);
        toast.error('Erro ao enviar depoimento');
        return false;
      }

      toast.success('Depoimento enviado com sucesso!');
      await fetchTestimonials(); // Recarregar a lista
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro inesperado ao enviar depoimento');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTestimonials(), fetchCaregivers()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    testimonials,
    caregivers,
    loading,
    submitting,
    submitTestimonial,
    refreshTestimonials: fetchTestimonials
  };
};
