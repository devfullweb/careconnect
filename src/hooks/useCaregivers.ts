
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Caregiver = Tables<'caregivers'>;

export const useCaregivers = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('caregivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching caregivers:', error);
        toast.error('Erro ao carregar dados dos cuidadores');
        return;
      }

      setCaregivers(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const updateCaregiverStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('caregivers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating caregiver status:', error);
        toast.error('Erro ao atualizar status');
        return false;
      }

      // Update local state
      setCaregivers(prev => 
        prev.map(caregiver => 
          caregiver.id === id ? { ...caregiver, status } : caregiver
        )
      );

      toast.success(`Status atualizado para ${status === 'approved' ? 'aprovado' : 'rejeitado'}`);
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro inesperado ao atualizar status');
      return false;
    }
  };

  useEffect(() => {
    fetchCaregivers();
  }, []);

  return {
    caregivers,
    loading,
    fetchCaregivers,
    updateCaregiverStatus
  };
};
