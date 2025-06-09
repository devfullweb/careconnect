
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TestimonialsList } from '@/components/testimonials/TestimonialsList';
import { TestimonialForm } from '@/components/testimonials/TestimonialForm';

export default function PainelTestemunhos() {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { testimonials, caregivers, loading, submitting, submitTestimonial } = useTestimonials();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        setUserProfile(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    } else if (!authLoading) {
      setProfileLoading(false);
    }
  }, [user, authLoading]);

  // Mostrar loading enquanto verifica autenticação
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // Redirecionar se não autenticado ou não for customer
  if (!user || !userProfile || userProfile.type !== 'customer') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Meus Depoimentos
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie seus depoimentos sobre os cuidadores
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Formulário para novo depoimento */}
          <Card>
            <CardHeader>
              <CardTitle>Novo Depoimento</CardTitle>
              <CardDescription>
                Compartilhe sua experiência com um cuidador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TestimonialForm
                caregivers={caregivers}
                loading={loading}
                submitting={submitting}
                onSubmit={submitTestimonial}
              />
            </CardContent>
          </Card>

          {/* Lista de depoimentos existentes */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Depoimentos</CardTitle>
              <CardDescription>
                Depoimentos que você já enviou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TestimonialsList
                testimonials={testimonials}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
