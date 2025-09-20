import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Heart, 
  Share2, 
  Calendar,
  User,
  Mail
} from "lucide-react";
import { mockPets } from "@/data/pets";
import { useToast } from "@/hooks/use-toast";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const pet = mockPets.find(p => p.id === id);
  const isAuthenticated = false; // TODO: Connect to actual auth state

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mascota no encontrada</h1>
          <Link to="/adopta">
            <Button variant="outline">Ver otras mascotas</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === pet.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? pet.images.length - 1 : prev - 1
    );
  };

  const handleAdoptionRequest = () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión requerido",
        description: "Necesitas iniciar sesión para solicitar una adopción",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "¡Solicitud enviada!",
        description: `Tu solicitud para adoptar a ${pet.name} ha sido enviada.`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/adopta" 
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver a la búsqueda
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src={pet.images[currentImageIndex]}
                alt={`${pet.name} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {pet.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {pet.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                  {currentImageIndex + 1} / {pet.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {pet.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {pet.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? "border-primary" 
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${pet.name} - Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pet Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {pet.name}
                  </h1>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{pet.location}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Status and Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge 
                  variant={pet.adoptionStatus === "Disponible" ? "default" : "secondary"}
                  className="text-sm"
                >
                  {pet.adoptionStatus}
                </Badge>
                <Badge variant="outline">{pet.type}</Badge>
                <Badge variant="outline">{pet.age}</Badge>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Sobre {pet.name}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pet.description}
                </p>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Información del publicante</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span>{pet.owner}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{pet.ownerContact}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Publicado el {pet.createdAt.toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adoption Button */}
            {pet.adoptionStatus === "Disponible" && (
              <Card className="bg-gradient-primary border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    ¿Te interesa adoptar a {pet.name}?
                  </h3>
                  <p className="text-white/90 mb-4">
                    Envía tu solicitud y el publicante se pondrá en contacto contigo
                  </p>
                  {isAuthenticated ? (
                    <Button 
                      onClick={handleAdoptionRequest}
                      disabled={isLoading}
                      size="lg"
                      variant="secondary"
                      className="w-full"
                    >
                      {isLoading ? "Enviando solicitud..." : "Solicitar Adopción"}
                    </Button>
                  ) : (
                    <Link to="/auth">
                      <Button size="lg" variant="secondary" className="w-full">
                        Iniciar Sesión para Adoptar
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;