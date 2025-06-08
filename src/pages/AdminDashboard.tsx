
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Edit, CheckCircle, Clock, FileText } from "lucide-react";
import { useCaregivers } from "@/hooks/useCaregivers";
import { Tables } from "@/integrations/supabase/types";

type Caregiver = Tables<'caregivers'>;

export default function AdminDashboard() {
  const { caregivers, loading, updateCaregiverStatus } = useCaregivers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filtrar cuidadores baseado na busca e status
  const filteredCaregivers = caregivers.filter(caregiver => {
    const matchesSearch = caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caregiver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (caregiver.care_category?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === "all" || caregiver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estatísticas do dashboard
  const stats = {
    total: caregivers.length,
    pending: caregivers.filter(c => c.status === "pending").length,
    approved: caregivers.filter(c => c.status === "approved").length,
    rejected: caregivers.filter(c => c.status === "rejected").length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getCategoryLabel = (category: string | null) => {
    if (!category) return 'Não informado';
    const categories = {
      "cuidador": "Cuidador(a) de Idosos",
      "tecnico": "Técnico(a) de Enfermagem",
      "enfermeiro": "Enfermeiro(a)",
      "fisioterapeuta": "Fisioterapeuta",
      "terapeuta": "Terapeuta Ocupacional"
    };
    return categories[category as keyof typeof categories] || category;
  };

  const handleStatusUpdate = async (id: string, newStatus: "approved" | "rejected") => {
    await updateCaregiverStatus(id, newStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600">Gerencie os cuidadores cadastrados</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cuidador
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cuidadores</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
              <div className="h-4 w-4 bg-red-600 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pendentes
                </Button>
                <Button
                  variant={statusFilter === "approved" ? "default" : "outline"}
                  onClick={() => setStatusFilter("approved")}
                >
                  Aprovados
                </Button>
                <Button
                  variant={statusFilter === "rejected" ? "default" : "outline"}
                  onClick={() => setStatusFilter("rejected")}
                >
                  Rejeitados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Cuidadores */}
        <Card>
          <CardHeader>
            <CardTitle>Cuidadores Cadastrados ({filteredCaregivers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCaregivers.map((caregiver) => (
                    <TableRow key={caregiver.id}>
                      <TableCell className="font-medium">{caregiver.name}</TableCell>
                      <TableCell>{caregiver.email}</TableCell>
                      <TableCell>{getCategoryLabel(caregiver.care_category)}</TableCell>
                      <TableCell>{caregiver.city}, {caregiver.state}</TableCell>
                      <TableCell>{getStatusBadge(caregiver.status || 'pending')}</TableCell>
                      <TableCell>
                        {new Date(caregiver.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCaregiver(caregiver)}
                              >
                                <Edit className="h-3 w-3" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Cuidador</DialogTitle>
                              </DialogHeader>
                              {selectedCaregiver && (
                                <CaregiverDetails 
                                  caregiver={selectedCaregiver} 
                                  onStatusUpdate={handleStatusUpdate}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {caregiver.status === "pending" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Ações
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(caregiver.id, "approved")}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="w-3 h-3 mr-2" />
                                  Aprovar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(caregiver.id, "rejected")}
                                  className="text-red-600"
                                >
                                  Rejeitar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente para exibir detalhes do cuidador
interface CaregiverDetailsProps {
  caregiver: Caregiver;
  onStatusUpdate: (id: string, status: "approved" | "rejected") => void;
}

function CaregiverDetails({ caregiver, onStatusUpdate }: CaregiverDetailsProps) {
  const getCategoryLabel = (category: string | null) => {
    if (!category) return 'Não informado';
    const categories = {
      "cuidador": "Cuidador(a) de Idosos",
      "tecnico": "Técnico(a) de Enfermagem",
      "enfermeiro": "Enfermeiro(a)",
      "fisioterapeuta": "Fisioterapeuta",
      "terapeuta": "Terapeuta Ocupacional"
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getEducationLabel = (education: string | null) => {
    if (!education) return 'Não informado';
    const educationLevels = {
      "fundamental": "Ensino Fundamental",
      "medio": "Ensino Médio",
      "tecnico": "Ensino Técnico",
      "superior": "Ensino Superior"
    };
    return educationLevels[education as keyof typeof educationLevels] || education;
  };

  const getAvailabilityLabel = (availability: string | null) => {
    if (!availability) return 'Não informado';
    const availabilities = {
      "diurno": "Diurno (6h às 18h)",
      "noturno": "Noturno (18h às 6h)", 
      "integral": "24 horas",
      "comercial": "Comercial (8h às 17h)",
      "plantao": "Plantões"
    };
    return availabilities[availability as keyof typeof availabilities] || availability;
  };

  return (
    <div className="space-y-6">
      {/* Status e Ações */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status atual:</span>
          {caregiver.status === "pending" && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Clock className="w-3 h-3 mr-1" />Pendente
            </Badge>
          )}
          {caregiver.status === "approved" && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />Aprovado
            </Badge>
          )}
          {caregiver.status === "rejected" && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Rejeitado
            </Badge>
          )}
        </div>
        
        {caregiver.status === "pending" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onStatusUpdate(caregiver.id, "approved")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onStatusUpdate(caregiver.id, "rejected")}
            >
              Rejeitar
            </Button>
          </div>
        )}
      </div>

      {/* Dados Pessoais */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Dados Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nome</label>
            <p className="font-medium">{caregiver.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="font-medium">{caregiver.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">WhatsApp</label>
            <p className="font-medium">{caregiver.whatsapp || 'Não informado'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
            <p className="font-medium">
              {caregiver.birth_date ? new Date(caregiver.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Possui filhos</label>
            <p className="font-medium">{caregiver.has_children ? "Sim" : "Não"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fumante</label>
            <p className="font-medium">{caregiver.smoker ? "Sim" : "Não"}</p>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">CEP</label>
            <p className="font-medium">{caregiver.cep || 'Não informado'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Endereço</label>
            <p className="font-medium">{caregiver.address || 'Não informado'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <p className="font-medium">{caregiver.state || 'Não informado'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Cidade</label>
            <p className="font-medium">{caregiver.city || 'Não informado'}</p>
          </div>
        </div>
      </div>

      {/* Formação e Categoria */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Formação e Categoria Profissional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Escolaridade</label>
            <p className="font-medium">{getEducationLabel(caregiver.education)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Categoria</label>
            <p className="font-medium">{getCategoryLabel(caregiver.care_category)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Disponibilidade</label>
            <p className="font-medium">{getAvailabilityLabel(caregiver.availability)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Dorme no local</label>
            <p className="font-medium">{caregiver.sleep_at_client ? "Sim" : "Não"}</p>
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
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-500">Cursos</label>
            <p className="font-medium">{caregiver.courses}</p>
          </div>
        )}
      </div>

      {/* Experiência */}
      {caregiver.experience && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Experiência Profissional</h3>
          <div>
            <label className="text-sm font-medium text-gray-500">Experiências</label>
            <p className="font-medium whitespace-pre-wrap">{caregiver.experience}</p>
          </div>
        </div>
      )}

      {/* Referências */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Referências</h3>
        <div className="space-y-3">
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
      </div>
    </div>
  );
}
