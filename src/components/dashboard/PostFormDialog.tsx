import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pet } from "@/data/pets";
import { Upload, X } from "lucide-react";

// Provincias de Argentina
const PROVINCIAS_ARGENTINA = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Ciudad Autónoma de Buenos Aires",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán"
];

const postSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "Máximo 50 caracteres"),
  type: z.enum(["Perro", "Gato", "Ave", "Conejo", "Otro"]),
  age: z.enum(["Cachorro", "Joven", "Adulto", "Senior"]),
  provincia: z.string().min(1, "Seleccione una provincia"),
  localidad: z.string().min(2, "Ingrese una localidad válida"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres").max(500, "Máximo 500 caracteres"),
  images: z.array(z.string()).min(1, "Debe agregar al menos una imagen").max(5, "Máximo 5 imágenes"),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Pet>) => void;
  editingPost?: Pet | null;
  mode: "create" | "edit";
}

export const PostFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  editingPost,
  mode,
}: PostFormDialogProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: "",
      type: "Perro",
      age: "Joven",
      provincia: "",
      localidad: "",
      description: "",
      images: [],
    },
  });

  useEffect(() => {
    if (editingPost && mode === "edit") {
      // Parse location into localidad and provincia
      const locationParts = editingPost.location.split(", ");
      const localidad = locationParts[0] || "";
      const provincia = locationParts[1] || "";

      form.reset({
        name: editingPost.name,
        type: editingPost.type,
        age: editingPost.age,
        provincia: provincia,
        localidad: localidad,
        description: editingPost.description,
        images: editingPost.images,
      });
      setImageUrls(editingPost.images);
    } else {
      form.reset({
        name: "",
        type: "Perro",
        age: "Joven",
        provincia: "",
        localidad: "",
        description: "",
        images: [],
      });
      setImageUrls([]);
    }
  }, [editingPost, mode, form, open]);

  const handleImageUrlAdd = () => {
    const url = prompt("Ingrese la URL de la imagen:");
    if (url && imageUrls.length < 5) {
      const newImages = [...imageUrls, url];
      setImageUrls(newImages);
      form.setValue("images", newImages);
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    form.setValue("images", newImages);
  };

  const handleSubmit = (data: PostFormData) => {
    // Combine localidad and provincia into location
    onSubmit({
      ...data,
      location: `${data.localidad}, ${data.provincia}`,
      images: imageUrls,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nueva Publicación" : "Editar Publicación"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa la información de la mascota que deseas publicar"
              : "Actualiza la información de tu publicación"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la mascota</FormLabel>
                  <FormControl>
                    <Input placeholder="Luna" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Perro">Perro</SelectItem>
                        <SelectItem value="Gato">Gato</SelectItem>
                        <SelectItem value="Ave">Ave</SelectItem>
                        <SelectItem value="Conejo">Conejo</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar edad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cachorro">Cachorro</SelectItem>
                        <SelectItem value="Joven">Joven</SelectItem>
                        <SelectItem value="Adulto">Adulto</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar provincia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROVINCIAS_ARGENTINA.map((provincia) => (
                          <SelectItem key={provincia} value={provincia}>
                            {provincia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="localidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu localidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntanos sobre la personalidad, cuidados especiales, y por qué sería una gran mascota..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Imágenes (máximo 5)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imageUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleImageRemove(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {imageUrls.length < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handleImageUrlAdd}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Agregar imagen (URL)
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {mode === "create" ? "Crear Publicación" : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};