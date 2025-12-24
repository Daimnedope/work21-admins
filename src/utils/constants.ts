import { UserRole, ProjectStatus, ApplicationStatus, TaskStatus, ContractStatus } from "../types";

// Метки ролей пользователей
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.STUDENT]: "🎓 Студент",
  [UserRole.CUSTOMER]: "💼 Заказчик",
  [UserRole.ADMIN]: "👑 Админ",
};

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.STUDENT]: "green",
  [UserRole.CUSTOMER]: "blue",
  [UserRole.ADMIN]: "red",
};

// Метки статусов проекта
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.DRAFT]: "📝 Черновик",
  [ProjectStatus.OPEN]: "🟢 Открыт",
  [ProjectStatus.IN_PROGRESS]: "🔄 В работе",
  [ProjectStatus.REVIEW]: "👀 На ревью",
  [ProjectStatus.COMPLETED]: "✅ Завершён",
  [ProjectStatus.CANCELLED]: "❌ Отменён",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.DRAFT]: "default",
  [ProjectStatus.OPEN]: "success",
  [ProjectStatus.IN_PROGRESS]: "processing",
  [ProjectStatus.REVIEW]: "warning",
  [ProjectStatus.COMPLETED]: "success",
  [ProjectStatus.CANCELLED]: "error",
};

// Метки статусов заявки
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "⏳ Ожидает",
  [ApplicationStatus.ACCEPTED]: "✅ Принята",
  [ApplicationStatus.REJECTED]: "❌ Отклонена",
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "warning",
  [ApplicationStatus.ACCEPTED]: "success",
  [ApplicationStatus.REJECTED]: "error",
};

// Метки статусов задачи
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "⏳ Ожидает",
  [TaskStatus.IN_PROGRESS]: "🔄 В работе",
  [TaskStatus.REVIEW]: "👀 На ревью",
  [TaskStatus.COMPLETED]: "✅ Завершена",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "default",
  [TaskStatus.IN_PROGRESS]: "processing",
  [TaskStatus.REVIEW]: "warning",
  [TaskStatus.COMPLETED]: "success",
};

// Метки статусов контракта
export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: "📝 Черновик",
  [ContractStatus.ACTIVE]: "🟢 Активен",
  [ContractStatus.COMPLETED]: "✅ Завершён",
  [ContractStatus.CANCELLED]: "❌ Отменён",
};

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: "default",
  [ContractStatus.ACTIVE]: "processing",
  [ContractStatus.COMPLETED]: "success",
  [ContractStatus.CANCELLED]: "error",
};

// Форматирование
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

