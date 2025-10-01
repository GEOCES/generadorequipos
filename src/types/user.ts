export interface UserSkills {
  velocidad: number; // 1-10
  disparo: number; // 1-10
  calidad: number; // 1-10
  resistencia: number; // 1-10
}

export interface User {
  id: string;
  email: string;
  nick: string;
  password: string;
  skills: UserSkills;
  createdAt: string;
}

export interface RegisterData {
  email: string;
  nick: string;
  password: string;
  skills: UserSkills;
}

export interface LoginData {
  email: string;
  password: string;
}

