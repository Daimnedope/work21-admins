// Роли пользователей
export enum UserRole {
  STUDENT = "student",
  CUSTOMER = "customer",
  ADMIN = "admin",
}

// Статусы проекта
export enum ProjectStatus {
  DRAFT = "draft",
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Статусы заявки
export enum ApplicationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

// Статусы задачи
export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  COMPLETED = "completed",
}

// Статусы контракта
export enum ContractStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Интерфейсы
export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  bio?: string;
  skills?: string;
  avatar_url?: string;
  rating_score: number;
  completed_projects: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface IProject {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline?: string;
  tech_stack?: string;
  status: ProjectStatus;
  customer_id: number;
  customer?: IUser;
  assignee_id?: number;
  assignee?: IUser;
  generated_spec?: string;
  llm_estimation?: string;
  created_at: string;
  updated_at: string;
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  complexity: number;
  estimated_hours?: number;
  deadline?: string;
  status: TaskStatus;
  order: number;
  project_id: number;
  project?: IProject;
  assignee_id?: number;
  assignee?: IUser;
  created_at: string;
}

export interface IApplication {
  id: number;
  project_id: number;
  project?: IProject;
  student_id: number;
  student?: IUser;
  cover_letter?: string;
  proposed_rate?: number;
  status: ApplicationStatus;
  created_at: string;
}

export interface IRating {
  id: number;
  project_id: number;
  project?: IProject;
  reviewer_id: number;
  reviewer?: IUser;
  reviewee_id: number;
  reviewee?: IUser;
  score: number;
  comment?: string;
  created_at: string;
}

export interface IContract {
  id: number;
  project_id: number;
  project?: IProject;
  customer_id: number;
  customer?: IUser;
  student_id: number;
  student?: IUser;
  total_amount: number;
  status: ContractStatus;
  signed_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface IStats {
  total_users: number;
  total_students: number;
  total_customers: number;
  total_admins: number;
  total_projects: number;
  open_projects: number;
  in_progress_projects: number;
  completed_projects: number;
  total_applications: number;
  pending_applications: number;
  total_contracts: number;
  active_contracts: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ILoginResponse {
  access_token: string;
  token_type: string;
  user: IUser;
}

