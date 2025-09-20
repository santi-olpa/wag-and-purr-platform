import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import { Pet } from "@/data/pets";

interface PetCardProps {
  pet: Pet;
}

const PetCard = ({ pet }: PetCardProps) => {
  return (
    <Link to={`/post/${pet.id}`} className="block group">
      <Card className="card-pet group-hover:shadow-soft">
        {/* Pet Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={pet.images[0]}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant={pet.adoptionStatus === "Disponible" ? "default" : "secondary"}
              className="bg-card/90 backdrop-blur-sm"
            >
              {pet.adoptionStatus}
            </Badge>
          </div>

          {/* Favorite Button */}
          <button className="absolute top-3 left-3 p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-card transition-colors">
            <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>

        {/* Pet Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
              {pet.name}
            </h3>
            <Badge variant="outline" className="text-xs">
              {pet.type}
            </Badge>
          </div>

          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{pet.location}</span>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {pet.description}
          </p>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Badge variant="secondary" className="text-xs">
              {pet.age}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Por {pet.owner}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PetCard;