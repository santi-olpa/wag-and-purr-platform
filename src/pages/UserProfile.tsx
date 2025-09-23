import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getUserById } from "@/data/users";
import { mockPets } from "@/data/pets";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Usuario no encontrado</p>
      </div>
    );
  }

  const user = getUserById(id);
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Usuario no encontrado</p>
      </div>
    );
  }

  // Filter pets by owner (for demo, we'll match by owner name)
  const userPosts = mockPets.filter(pet => 
    pet.owner.toLowerCase().includes(user.nombre.toLowerCase()) || 
    pet.owner.toLowerCase().includes(user.apellido.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/adopta" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a la lista
            </Link>
          </Button>
        </div>

        {/* User Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={`${user.nombre} ${user.apellido}`} />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {user.nombre} {user.apellido}
                </CardTitle>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{user.localidad}, {user.provincia}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{user.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Miembro desde {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* User Posts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Publicaciones de {user.nombre}
              <Badge variant="secondary" className="ml-2">
                {userPosts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPosts.map((pet) => (
                  <Card key={pet.id} className="card-pet">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={pet.images[0]}
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{pet.name}</h3>
                        <Badge 
                          variant={pet.adoptionStatus === "Disponible" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {pet.adoptionStatus}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {pet.type} • {pet.age}
                      </p>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {pet.description}
                      </p>
                      
                      <Button asChild className="w-full" size="sm">
                        <Link to={`/post/${pet.id}`}>
                          Ver detalle
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Este usuario no tiene publicaciones disponibles
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Cuando {user.nombre} publique mascotas para adopción, aparecerán aquí.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;