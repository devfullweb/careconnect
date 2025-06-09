
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const editFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  cep: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  courses: z.string().optional(),
  availability: z.string().optional(),
  experience: z.string().optional(),
  reference1: z.string().optional(),
  reference2: z.string().optional(),
  reference3: z.string().optional(),
});

type EditFormData = z.infer<typeof editFormSchema>;

interface CaregiverData {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  birth_date?: string;
  has_children: boolean;
  smoker: boolean;
  cep?: string;
  address?: string;
  state?: string;
  city?: string;
  education?: string;
  courses?: string;
  availability?: string;
  sleep_at_client: boolean;
  care_category?: string;
  experience?: string;
  reference1?: string;
  reference2?: string;
  reference3?: string;
  coren?: string;
  crefito?: string;
  crm?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

interface EditCaregiverFormProps {
  caregiverData: CaregiverData;
  onUpdate: (updatedData: CaregiverData) => void;
  onCancel: () => void;
}

export default function EditCaregiverForm({ caregiverData, onUpdate, onCancel }: EditCaregiverFormProps) {
  const form = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: caregiverData.name,
      whatsapp: caregiverData.whatsapp || "",
      address: caregiverData.address || "",
      cep: caregiverData.cep || "",
      city: caregiverData.city || "",
      state: caregiverData.state || "",
      courses: caregiverData.courses || "",
      availability: caregiverData.availability || "",
      experience: caregiverData.experience || "",
      reference1: caregiverData.reference1 || "",
      reference2: caregiverData.reference2 || "",
      reference3: caregiverData.reference3 || "",
    },
  });

  const onSubmit = async (data: EditFormData) => {
    try {
      const { data: updatedData, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .update({
          nome: data.name,
          telefone: data.whatsapp,
          endereco: data.address,
          cep: data.cep,
          cidade: data.city,
          cursos: data.courses,
          disponibilidade_horarios: data.availability,
          descricao_experiencia: data.experience,
          referencias: data.reference1,
          ultima_atualizacao: new Date().toISOString()
        })
        .eq('id', parseInt(caregiverData.id))
        .select()
        .single();

      if (error) {
        console.error('Error updating caregiver:', error);
        toast.error('Erro ao atualizar dados');
        return;
      }

      // Map the updated data back to the expected format
      const mappedData: CaregiverData = {
        id: updatedData.id.toString(),
        name: updatedData.nome,
        email: updatedData.email,
        whatsapp: updatedData.telefone,
        birth_date: updatedData.data_nascimento,
        has_children: updatedData.possui_filhos,
        smoker: updatedData.fumante === 'Sim',
        sleep_at_client: updatedData.disponivel_dormir_local === 'Sim',
        cep: updatedData.cep,
        address: updatedData.endereco,
        state: 'SP',
        city: updatedData.cidade,
        education: updatedData.escolaridade,
        courses: updatedData.cursos,
        care_category: updatedData.perfil_profissional,
        experience: updatedData.descricao_experiencia || updatedData.experiencia,
        reference1: updatedData.referencias,
        reference2: undefined,
        reference3: undefined,
        coren: undefined,
        crefito: undefined,
        crm: undefined,
        status: updatedData.status_candidatura,
        availability: updatedData.disponibilidade_horarios,
        created_at: updatedData.data_cadastro || new Date().toISOString(),
        updated_at: updatedData.ultima_atualizacao
      };

      toast.success('Dados atualizados com sucesso!');
      onUpdate(mappedData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao atualizar dados');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Editar Dados</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, complemento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="courses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cursos realizados</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Liste os cursos relacionados à área da saúde ou cuidados com idosos"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disponibilidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="diurno">Período Diurno</SelectItem>
                    <SelectItem value="noturno">Período Noturno</SelectItem>
                    <SelectItem value="integral">Período Integral</SelectItem>
                    <SelectItem value="flexivel">Horário Flexível</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experiência Profissional</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva suas experiências"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="reference1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referência 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome, contato, período" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referência 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome, contato, período" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referência 3</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome, contato, período" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
