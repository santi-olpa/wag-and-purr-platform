import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X,
  Heart,
  Plus
} from "lucide-react";
import { mockPets, Pet } from "@/data/pets";
import { useToast } from "@/hooks/use-toast";

interface AdoptionRequest {
  id: string;
  petId: string;
  petName: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  status: "Pendiente" | "Aceptada" | "Rechazada";
  createdAt: Date;
}

// Eliminado UserProfile, usamos User del contexto

const Dashboard = () => {
  const { toast } = useToast();
  const { user, updateUser } = useUser();
  const [editData, setEditData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    phone: user?.phone || "",
    provincia: user?.provincia || "",
    localidad: user?.localidad || ""
  });

  // Mock data for user's pets
  const userPets = mockPets.slice(0, 2);
  
  // Mock adoption requests (received)
  const receivedRequests: AdoptionRequest[] = [
    {
      id: "1",
      petId: "1",
      petName: "Luna",
      requesterName: "María García",
      requesterEmail: "maria.garcia@email.com",
      message: "Hola, me interesa mucho adoptar a Luna. Tengo experiencia con perros y un jardín grande.",
      status: "Pendiente",
      createdAt: new Date("2024-02-25")
    },
    {
      id: "2", 
      petId: "2",
      petName: "Milo",
      requesterName: "Carlos López",
      requesterEmail: "carlos.lopez@email.com", 
      message: "Busco un gato tranquilo para mi apartamento. Milo parece perfecto.",
      status: "Aceptada",
      createdAt: new Date("2024-02-20")
    }
  ];

  // Mock adoption requests (sent)
  const sentRequests: AdoptionRequest[] = [
    {
      id: "3",
      petId: "3", 
      petName: "Rocco",
      requesterName: "Juan Pérez",
      requesterEmail: "juan.perez@email.com",
      message: "Me encantaría adoptar a Rocco. Tengo experiencia con cachorros.",
      status: "Pendiente", 
      createdAt: new Date("2024-02-23")
    }
  ];

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(editData);
    toast({
      title: "Perfil actualizado",
      description: "Tu información se ha guardado correctamente.",
    });
  };

  const handleRequestResponse = (requestId: string, status: "Aceptada" | "Rechazada") => {
    toast({
      title: status === "Aceptada" ? "Solicitud aceptada" : "Solicitud rechazada", 
      description: `Has ${status.toLowerCase()} la solicitud de adopción.`,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mi Panel</h1>
          <p className="text-muted-foreground">
            Gestiona tu perfil, publicaciones y solicitudes de adopción
          </p>
        </div>

        {/* Dashboard Tabs */}
  <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            <TabsTrigger value="posts">Mis Publicaciones</TabsTrigger>
            <TabsTrigger value="received">Solicitudes Recibidas</TabsTrigger>
            <TabsTrigger value="sent">Solicitudes Enviadas</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información de contacto y ubicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                          id="nombre"
                          className="pl-10"
                          value={editData.nombre}
                          onChange={(e) => setEditData(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input
                          id="apellido"
                          className="pl-10"
                          value={editData.apellido}
                          onChange={(e) => setEditData(prev => ({ ...prev, apellido: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={user.email}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          value={editData.phone}
                          onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provincia">Provincia</Label>
                        <Input
                          id="provincia"
                          className="pl-10"
                          value={editData.provincia}
                          onChange={(e) => setEditData(prev => ({ ...prev, provincia: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="localidad">Localidad</Label>
                        <Input
                          id="localidad"
                          className="pl-10"
                          value={editData.localidad}
                          onChange={(e) => setEditData(prev => ({ ...prev, localidad: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full md:w-auto">
                      Guardar Cambios
                    </Button>
                  </form>
                ) : (
                  <div className="text-center text-muted-foreground">No hay usuario logueado.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Mis Publicaciones</h3>
                  <p className="text-muted-foreground">
                    Mascotas que has publicado para adopción
                  </p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Publicación
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {userPets.map((pet) => (
                  <Card key={pet.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={pet.images[0]}
                          alt={pet.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold">{pet.name}</h4>
                            <Badge variant={pet.adoptionStatus === "Disponible" ? "default" : "secondary"}>
                              {pet.adoptionStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {pet.type} • {pet.age}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {pet.description}
                          </p>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Received Requests Tab */}
          <TabsContent value="received">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Solicitudes Recibidas</h3>
                <p className="text-muted-foreground">
                  Personas interesadas en adoptar tus mascotas
                </p>
              </div>

              <div className="space-y-4">
                {receivedRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{request.requesterName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Interesado en: {request.petName}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            request.status === "Aceptada" ? "default" : 
                            request.status === "Rechazada" ? "destructive" : "secondary"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        "{request.message}"
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {request.requesterEmail} • {request.createdAt.toLocaleDateString('es-ES')}
                        </div>
                        
                        {request.status === "Pendiente" && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRequestResponse(request.id, "Aceptada")}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Aceptar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRequestResponse(request.id, "Rechazada")}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Rechazar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Sent Requests Tab */}
          <TabsContent value="sent">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Solicitudes Enviadas</h3>
                <p className="text-muted-foreground">
                  Tus solicitudes de adopción a otras mascotas
                </p>
              </div>

              <div className="space-y-4">
                {sentRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">Solicitud para {request.petName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Enviada el {request.createdAt.toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            request.status === "Aceptada" ? "default" : 
                            request.status === "Rechazada" ? "destructive" : "secondary"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground">
                        "{request.message}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;