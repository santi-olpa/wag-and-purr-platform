export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string; // hash
  phone: string;
  provincia: string;
  localidad: string;
  createdAt: Date;
  avatar?: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@email.com",
    password: "e10adc3949ba59abbe56e057f20f883e", // "123456" md5
    phone: "1123456789",
    provincia: "Buenos Aires",
    localidad: "La Plata",
    createdAt: new Date("2023-01-15"),
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "2",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos.rodriguez@email.com",
    password: "25f4b85f1e1b5c4e2e7c2b7b7a7b7b7b", // "abcdef" md5 (simulado)
    phone: "1198765432",
    provincia: "Córdoba",
    localidad: "Córdoba Capital",
    createdAt: new Date("2023-02-20"),
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "3",
    nombre: "Ana",
    apellido: "Martínez",
    email: "ana.martinez@email.com",
    password: "5f4dcc3b5aa765d61d8327deb882cf99", // "password" md5
    phone: "1187654321",
    provincia: "Santa Fe",
    localidad: "Rosario",
    createdAt: new Date("2023-03-10"),
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "4", 
    nombre: "Luis",
    apellido: "Fernández",
    email: "luis.fernandez@email.com",
    password: "098f6bcd4621d373cade4e832627b4f6", // "test" md5
    phone: "1156789123",
    provincia: "Mendoza",
    localidad: "Mendoza Capital",
    createdAt: new Date("2023-04-05"),
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "5",
    nombre: "Sofia",
    apellido: "López",
    email: "sofia.lopez@email.com", 
    password: "827ccb0eea8a706c4c34a16891f84e7b", // "12345" md5
    phone: "1145678912",
    provincia: "Tucumán",
    localidad: "San Miguel de Tucumán",
    createdAt: new Date("2023-05-12"),
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  }
];

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUserPosts = (userId: string) => {
  // This will be replaced with actual API call when backend is ready
  // For now, we'll import pets data to show user's posts
  return [];
};