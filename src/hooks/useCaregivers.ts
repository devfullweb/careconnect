
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// Type for the candidatos_cuidadores_rows table
type CandidatoCuidador = Tables<'candidatos_cuidadores_rows'>;

// Mapped type to match the expected Caregiver interface used in AdminDashboard
interface Caregiver {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  whatsapp?: string;
  birth_date?: string;
  has_children: boolean;
  smoker: boolean;
  sleep_at_client: boolean;
  cep?: string;
  address?: string;
  state?: string;
  city?: string;
  education?: string;
  courses?: string;
  care_category?: string;
  experience?: string;
  reference1?: string;
  reference2?: string;
  reference3?: string;
  coren?: string;
  crefito?: string;
  crm?: string;
  status: string;
  availability?: string;
  created_at: string;
  updated_at?: string;
}

export const useCaregivers = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to map candidatos_cuidadores_rows data to Caregiver interface
  const mapCandidatoToCaregiver = (candidato: CandidatoCuidador): Caregiver => {
    return {
      id: candidato.id.toString(),
      user_id: null, // This table doesn't have user_id, so we set it to null
      name: candidato.nome,
      email: candidato.email,
      whatsapp: candidato.telefone,
      birth_date: candidato.data_nascimento,
      has_children: candidato.possui_filhos,
      smoker: candidato.fumante === 'Sim',
      sleep_at_client: candidato.disponivel_dormir_local === 'Sim',
      cep: candidato.cep,
      address: candidato.endereco,
      state: 'SP', // Default since not available in original table
      city: candidato.cidade,
      education: candidato.escolaridade,
      courses: candidato.cursos,
      care_category: candidato.perfil_profissional,
      experience: candidato.descricao_experiencia || candidato.experiencia,
      reference1: candidato.referencias,
      reference2: undefined,
      reference3: undefined,
      coren: undefined,
      crefito: undefined,
      crm: undefined,
      status: candidato.status_candidatura,
      availability: candidato.disponibilidade_horarios,
      created_at: candidato.data_cadastro || new Date().toISOString(),
      updated_at: candidato.ultima_atualizacao
    };
  };

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      console.log('Fetching caregivers from candidatos_cuidadores_rows...');
      
      const { data, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching caregivers:', error);
        toast.error('Erro ao carregar dados dos cuidadores');
        return;
      }

      console.log('Raw data from candidatos_cuidadores_rows:', data);
      
      // Map the data to the expected Caregiver interface
      const mappedCaregivers = data?.map(mapCandidatoToCaregiver) || [];
      console.log('Mapped caregivers:', mappedCaregivers);
      
      setCaregivers(mappedCaregivers);
      toast.success(`${mappedCaregivers.length} cuidadores carregados com sucesso`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const updateCaregiverStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      console.log('Updating caregiver status:', id, status);
      
      // Map the status to the format used in candidatos_cuidadores_rows
      const mappedStatus = status === 'approved' ? 'Aprovado' : 'Rejeitado';
      
      const { error } = await supabase
        .from('candidatos_cuidadores_rows')
        .update({ 
          status_candidatura: mappedStatus, 
          ultima_atualizacao: new Date().toISOString() 
        })
        .eq('id', parseInt(id));

      if (error) {
        console.error('Error updating caregiver status:', error);
        toast.error('Erro ao atualizar status');
        return false;
      }

      // Update local state
      setCaregivers(prev => 
        prev.map(caregiver => 
          caregiver.id === id ? { ...caregiver, status: mappedStatus } : caregiver
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
