
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle, User, MapPin, GraduationCap, Heart, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type Caregiver = Tables<'caregivers'>;

export default function CaregiverProfile() {
  const { user } = useAuth();
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaregiverData = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await supabase
          .from('caregivers')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (error) {
          console.error('Error fetching caregiver data:', error);
          toast.error('Erro ao carregar dados do perfil');
          return;
        }

        setCaregiver(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro inesperado ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      "cuidador": "Cuidador(a) de Idosos",
      "tecnico": "Técnico(a) de Enfermagem",
      "enfermeiro": "Enfermeiro(a)",
      "fisioterapeuta": "Fisioterapeuta",
      "terapeuta": "Terapeuta Ocupacional"
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getEducationLabel = (education: string) => {
    const educationLevels = {
      "fundamental": "Ensino Fundamental",
      "medio": "Ensino Médio",
      "tecnico": "Ensino Técnico",
      "superior": "Ensino Superior"
    };
    return educationLevels[education as keyof typeof educationLevels] || education;
  };

  const getAvailabilityLabel = (availability: string) => {
    const availabilities = {
      "diurno": "Diurno (6h às 18h)",
      "noturno": "Noturno (18h às 6h)",
      "integral": "24 horas",
      "comercial": "Comercial (8h às 17h)",
      "plantao": "Plantões"
    };
    return availabilities[availability as keyof typeof availabilities] || availability;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil não encontrado</h3>
              <p className="text-gray-600 mb-4">
                Não encontramos um perfil de cuidador associado ao seu email ({user?.email}).
              </p>
              <Button onClick={() => window.location.href = '/cadastrar-cuidador'}>
                Cadastrar como Cuidador
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600">Visualize e gerencie suas informações profissionais</p>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Status da Candidatura</h3>
              <p className="text-gray-600">Status atual da sua candidatura no sistema</p>
            </div>
            {getStatusBadge(caregiver.status || 'pending')}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome Completo</label>
              <p className="font-medium">{caregiver.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
              <p className="font-medium">
                {caregiver.birth_date ? new Date(caregiver.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{caregiver.email}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">WhatsApp</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{caregiver.whatsapp || 'Não informado'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Possui filhos</label>
              <p className="font-medium">{caregiver.has_children ? 'Sim' : 'Não'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Fumante</label>
              <p className="font-medium">{caregiver.smoker ? 'Sim' : 'Não'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">CEP</label>
              <p className="font-medium">{caregiver.cep || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Endereço</label>
              <p className="font-medium">{caregiver.address || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Cidade</label>
              <p className="font-medium">{caregiver.city || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <p className="font-medium">{caregiver.state || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Informações Profissionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Categoria Profissional</label>
              <p className="font-medium">{caregiver.care_category ? getCategoryLabel(caregiver.care_category) : 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Escolaridade</label>
              <p className="font-medium">{caregiver.education ? getEducationLabel(caregiver.education) : 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Disponibilidade</label>
              <p className="font-medium">{caregiver.availability ? getAvailabilityLabel(caregiver.availability) : 'Não informado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Dorme no local</label>
              <p className="font-medium">{caregiver.sleep_at_client ? 'Sim' : 'Não'}</p>
            </div>
            
            {caregiver.coren && (
              <div>
                <label className="text-sm font-medium text-gray-500">COREN</label>
                <p className="font-medium">{caregiver.coren}</p>
              </div>
            )}
            
            {caregiver.crefito && (
              <div>
                <label className="text-sm font-medium text-gray-500">CREFITO</label>
                <p className="font-medium">{caregiver.crefito}</p>
              </div>
            )}
            
            {caregiver.crm && (
              <div>
                <label className="text-sm font-medium text-gray-500">CRM</label>
                <p className="font-medium">{caregiver.crm}</p>
              </div>
            )}
          </div>
          
          {caregiver.courses && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Cursos e Certificações</label>
              <p className="font-medium">{caregiver.courses}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      {caregiver.experience && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Experiência Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{caregiver.experience}</p>
          </CardContent>
        </Card>
      )}

      {/* References */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Referências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {caregiver.reference1 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Referência 1</label>
                <p className="font-medium">{caregiver.reference1}</p>
              </div>
            )}
            {caregiver.reference2 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Referência 2</label>
                <p className="font-medium">{caregiver.reference2}</p>
              </div>
            )}
            {caregiver.reference3 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Referência 3</label>
                <p className="font-medium">{caregiver.reference3}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={() => window.location.href = '/cadastrar-cuidador'}>
          Editar Perfil
        </Button>
      </div>
    </div>
  );
}
