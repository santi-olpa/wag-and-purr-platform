import { useState } from "react";
import PetFilters from "@/components/pets/PetFilters";
import PetCard from "@/components/pets/PetCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { mockPets } from "@/data/pets";

interface FilterState {
  types: string[];
  ages: string[];
  location: string;
}

const Adopta = () => {
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    ages: [],
    location: ""
  });

  const filteredPets = mockPets.filter(pet => {
    if (filters.types.length > 0 && !filters.types.includes(pet.type)) return false;
    if (filters.ages.length > 0 && !filters.ages.includes(pet.age)) return false;
    if (filters.location && !pet.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Mascotas en Adopción
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre a tu nuevo compañero entre cientos de mascotas que esperan un hogar lleno de amor
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PetFilters onFiltersChange={setFilters} />
          </div>

          {/* Pets Grid */}
          <div className="lg:col-span-3">
            {filteredPets.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {filteredPets.length} mascota{filteredPets.length !== 1 ? 's' : ''} disponible{filteredPets.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No se encontraron mascotas</h3>
                <p className="text-muted-foreground mb-6">
                  Intenta ajustar tus filtros para ver más resultados
                </p>
                <Button
                  onClick={() => setFilters({ types: [], ages: [], location: "" })}
                  variant="outline"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adopta;