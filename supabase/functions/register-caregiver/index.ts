
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CaregiverData {
  name: string;
  email: string;
  whatsapp?: string;
  birthDate: string;
  hasChildren: boolean;
  smoker: boolean;
  cep?: string;
  address?: string;
  state?: string;
  city?: string;
  education?: string;
  courses?: string;
  availability?: string;
  sleepAtClient: boolean;
  careCategory?: string;
  experience?: string;
  reference1?: string;
  reference2?: string;
  reference3?: string;
  coren?: string;
  crefito?: string;
  crm?: string;
}

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const caregiverData: CaregiverData = await req.json();
    console.log("Received caregiver data:", caregiverData);
    
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    
    // Create user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: caregiverData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: caregiverData.name,
        role: 'caregiver'
      }
    });

    if (authError) {
      console.error("Error creating user:", authError);
      return new Response(
        JSON.stringify({ error: "Erro ao criar usuário" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("User created successfully:", authData.user.id);

    // Insert caregiver data into candidatos_cuidadores_rows table
    const { error: insertError } = await supabaseAdmin
      .from("candidatos_cuidadores_rows")
      .insert({
        nome: caregiverData.name,
        email: caregiverData.email,
        telefone: caregiverData.whatsapp,
        data_nascimento: caregiverData.birthDate,
        possui_filhos: caregiverData.hasChildren,
        fumante: caregiverData.smoker ? 'Sim' : 'Não',
        cep: caregiverData.cep,
        endereco: caregiverData.address,
        cidade: caregiverData.city,
        escolaridade: caregiverData.education,
        cursos: caregiverData.courses,
        disponibilidade_horarios: caregiverData.availability,
        disponivel_dormir_local: caregiverData.sleepAtClient ? 'Sim' : 'Não',
        perfil_profissional: caregiverData.careCategory,
        descricao_experiencia: caregiverData.experience,
        referencias: [caregiverData.reference1, caregiverData.reference2, caregiverData.reference3]
          .filter(Boolean)
          .join('; '),
        status_candidatura: 'Pendente',
        data_cadastro: new Date().toISOString(),
        ultima_atualizacao: new Date().toISOString(),
        ativo: 'Sim'
      });

    if (insertError) {
      console.error("Error inserting caregiver:", insertError);
      return new Response(
        JSON.stringify({ error: "Erro ao salvar dados do cuidador" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Caregiver data inserted successfully");

    // Try to send welcome email if Resend is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Cuidadores <onboarding@resend.dev>",
          to: [caregiverData.email],
          subject: "Bem-vindo! Seus dados de acesso à área do cuidador",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Bem-vindo à nossa plataforma!</h1>
              <p>Olá <strong>${caregiverData.name}</strong>,</p>
              <p>Seu cadastro foi realizado com sucesso! Abaixo estão seus dados de acesso à área exclusiva do cuidador:</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Dados de Acesso:</h3>
                <p><strong>Email:</strong> ${caregiverData.email}</p>
                <p><strong>Senha temporária:</strong> ${tempPassword}</p>
              </div>
              
              <p>Para acessar sua área exclusiva, acesse o site e faça login com suas credenciais.</p>
              
              <p><strong>Importante:</strong> Recomendamos que você altere sua senha após o primeiro acesso por questões de segurança.</p>
              
              <p>Em sua área você poderá:</p>
              <ul>
                <li>Visualizar e atualizar seus dados pessoais</li>
                <li>Acompanhar o status de sua candidatura</li>
                <li>Receber notificações importantes</li>
              </ul>
              
              <p>Se você tiver alguma dúvida, entre em contato conosco.</p>
              
              <p>Atenciosamente,<br>Equipe de Cuidadores</p>
            </div>
          `,
        });
        console.log("Welcome email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the registration if email fails
      }
    } else {
      console.log("RESEND_API_KEY not configured, skipping email");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Cadastro realizado com sucesso! Verifique seu email para dados de acesso." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in register-caregiver function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
