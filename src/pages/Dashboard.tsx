import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X,
  Plus,
  Power,
  PowerOff
} from "lucide-react";
import { mockPets, Pet } from "@/data/pets";
import { useToast } from "@/hooks/use-toast";
import { PostFormDialog } from "@/components/dashboard/PostFormDialog";

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

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [userPets, setUserPets] = useState<Pet[]>(mockPets.filter(p => p.ownerId === user?.id));
  const [editData, setEditData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    phone: user?.phone || "",
    provincia: user?.provincia || "",
    localidad: user?.localidad || ""
  });
  
  // Dialog states
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [postDialogMode, setPostDialogMode] = useState<"create" | "edit">("create");
  const [editingPost, setEditingPost] = useState<Pet | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

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

  const handleCreatePost = () => {
    setPostDialogMode("create");
    setEditingPost(null);
    setPostDialogOpen(true);
  };

  const handleEditPost = (pet: Pet) => {
    setPostDialogMode("edit");
    setEditingPost(pet);
    setPostDialogOpen(true);
  };

  const handleToggleActive = (pet: Pet) => {
    const newActive = !pet.active;
    setUserPets(prev =>
      prev.map(p =>
        p.id === pet.id ? { ...p, active: newActive } : p
      )
    );
    toast({
      title: newActive ? "Publicación activada" : "Publicación desactivada",
      description: newActive 
        ? "Tu publicación está visible nuevamente." 
        : "Tu publicación ya no es visible en adopción.",
    });
  };

  const handleDeleteClick = (pet: Pet) => {
    if (pet.active) {
      toast({
        title: "No se puede eliminar",
        description: "Debes desactivar la publicación antes de eliminarla.",
        variant: "destructive",
      });
      return;
    }
    setPetToDelete(pet);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (petToDelete) {
      setUserPets(prev => prev.filter(p => p.id !== petToDelete.id));
      toast({
        title: "Publicación eliminada",
        description: "La publicación ha sido eliminada permanentemente.",
      });
      setPetToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handlePostSubmit = (data: Partial<Pet>) => {
    if (postDialogMode === "create") {
      const newPet: Pet = {
        id: String(Date.now()),
        name: data.name!,
        type: data.type!,
        age: data.age!,
        location: data.location!,
        description: data.description!,
        images: data.images!,
        owner: `${user?.nombre} ${user?.apellido}`,
        ownerId: user?.id!,
        ownerContact: user?.email!,
        adoptionStatus: "Disponible",
        active: true,
        createdAt: new Date(),
      };
      setUserPets(prev => [newPet, ...prev]);
      toast({
        title: "Publicación creada",
        description: "Tu mascota ya está disponible para adopción.",
      });
    } else {
      setUserPets(prev =>
        prev.map(p =>
          p.id === editingPost?.id
            ? {
                ...p,
                name: data.name!,
                type: data.type!,
                age: data.age!,
                location: data.location!,
                description: data.description!,
                images: data.images!,
              }
            : p
        )
      );
      toast({
        title: "Publicación actualizada",
        description: "Los cambios se han guardado correctamente.",
      });
    }
  };

  const handleViewPost = (petId: string) => {
    navigate(`/post/${petId}`);
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
                          value={editData.nombre}
                          onChange={(e) => setEditData(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input
                          id="apellido"
                          value={editData.apellido}
                          onChange={(e) => setEditData(prev => ({ ...prev, apellido: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provincia">Provincia</Label>
                        <Input
                          id="provincia"
                          value={editData.provincia}
                          onChange={(e) => setEditData(prev => ({ ...prev, provincia: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="localidad">Localidad</Label>
                        <Input
                          id="localidad"
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
                <Button onClick={handleCreatePost}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Publicación
                </Button>
              </div>

              {userPets.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      Aún no tienes publicaciones. ¡Crea tu primera publicación!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {userPets.map((pet) => (
                    <Card key={pet.id} className={!pet.active ? "opacity-60" : ""}>
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
                              <Badge variant={pet.active ? "default" : "secondary"}>
                                {pet.active ? "Disponible" : "Desactivada"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {pet.type} • {pet.age}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {pet.description}
                            </p>
                            <div className="flex gap-2 pt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewPost(pet.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditPost(pet)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Editar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleToggleActive(pet)}
                              >
                                {pet.active ? (
                                  <>
                                    <PowerOff className="w-4 h-4 mr-1" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <Power className="w-4 h-4 mr-1" />
                                    Activar
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteClick(pet)}
                              >
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
              )}
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

      {/* Post Form Dialog */}
      <PostFormDialog
        open={postDialogOpen}
        onOpenChange={setPostDialogOpen}
        onSubmit={handlePostSubmit}
        editingPost={editingPost}
        mode={postDialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La publicación de {petToDelete?.name} será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
