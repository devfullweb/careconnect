
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">CuidaVida</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/cadastrar-cuidador">
                <Button variant="outline">Cadastrar-se como Cuidador</Button>
              </Link>
              <Link to="/admin">
                <Button>Área Administrativa</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Plataforma de Cuidadores
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Conectando Cuidadores e Famílias
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Uma plataforma dedicada a conectar cuidadores qualificados com famílias que precisam de cuidados especializados para idosos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastrar-cuidador">
                <Button size="lg" className="w-full sm:w-auto">
                  <Users className="w-5 h-5 mr-2" />
                  Quero ser Cuidador
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Shield className="w-5 h-5 mr-2" />
                  Área Administrativa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma solução completa para conectar cuidadores qualificados com famílias que precisam de cuidados especializados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Cadastro Simplificado</CardTitle>
                <CardDescription>
                  Processo de cadastro fácil e intuitivo para cuidadores, com formulário dividido em etapas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Verificação Rigorosa</CardTitle>
                <CardDescription>
                  Sistema de aprovação com verificação de referências e documentos profissionais.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Gestão Completa</CardTitle>
                <CardDescription>
                  Dashboard administrativo completo para gerenciar todos os cuidadores cadastrados.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Cadastre-se agora como cuidador ou acesse a área administrativa para gerenciar os cadastros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastrar-cuidador">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Cadastrar como Cuidador
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
                  Área Administrativa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">CuidaVida</span>
          </div>
          <p className="text-gray-400">
            Conectando cuidadores e famílias com segurança e confiança.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
