import { useCustom } from "@refinedev/core";
import { Row, Col, Card, Statistic, Typography, Spin, Table, Tag } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { IStats, IProject, IUser, ProjectStatus, UserRole } from "../../types";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  USER_ROLE_LABELS,
  formatCurrency,
} from "../../utils/constants";

const { Title, Text } = Typography;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2"];

export const Dashboard: React.FC = () => {
  // Получаем статистику
  const { data: statsData, isLoading: statsLoading } = useCustom<IStats>({
    url: `${API_URL}/admin/stats`,
    method: "get",
  });

  // Получаем последние проекты
  const { data: projectsData, isLoading: projectsLoading } = useCustom<{
    items: IProject[];
  }>({
    url: `${API_URL}/admin/projects`,
    method: "get",
    config: {
      query: {
        per_page: "5",
        sort_by: "created_at",
        sort_order: "desc",
      },
    },
  });

  // Получаем последних пользователей
  const { data: usersData, isLoading: usersLoading } = useCustom<{
    items: IUser[];
  }>({
    url: `${API_URL}/admin/users`,
    method: "get",
    config: {
      query: {
        per_page: "5",
        sort_by: "created_at",
        sort_order: "desc",
      },
    },
  });

  const stats = statsData?.data;
  const recentProjects = projectsData?.data?.items || [];
  const recentUsers = usersData?.data?.items || [];

  // Данные для графиков
  const usersPieData = [
    { name: "Студенты", value: stats?.total_students || 0 },
    { name: "Заказчики", value: stats?.total_customers || 0 },
    { name: "Админы", value: stats?.total_admins || 0 },
  ];

  const projectsBarData = [
    { name: "Открытые", value: stats?.open_projects || 0, color: "#52c41a" },
    { name: "В работе", value: stats?.in_progress_projects || 0, color: "#1890ff" },
    { name: "Завершённые", value: stats?.completed_projects || 0, color: "#722ed1" },
  ];

  if (statsLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Загрузка статистики..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 24px 0" }}>
      <Title level={2}>📊 Дашборд</Title>
      <Text type="secondary">Обзор платформы WORK21</Text>

      {/* Статистика */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card" hoverable>
            <Statistic
              title="Всего пользователей"
              value={stats?.total_users || 0}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card" hoverable>
            <Statistic
              title="Всего проектов"
              value={stats?.total_projects || 0}
              prefix={<ProjectOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card" hoverable>
            <Statistic
              title="Заявок"
              value={stats?.total_applications || 0}
              prefix={<FileTextOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card" hoverable>
            <Statistic
              title="Завершено проектов"
              value={stats?.completed_projects || 0}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Дополнительная статистика */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Студентов"
              value={stats?.total_students || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Заказчиков"
              value={stats?.total_customers || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Ожидающих заявок"
              value={stats?.pending_applications || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 20, color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Активных контрактов"
              value={stats?.active_contracts || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ fontSize: 20, color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Графики */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="👥 Пользователи по ролям">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usersPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {usersPieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="📁 Статусы проектов">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectsBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1890ff">
                  {projectsBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Таблицы с последними данными */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="🆕 Последние проекты"
            extra={<a href="/projects">Все проекты →</a>}
          >
            <Table
              dataSource={recentProjects}
              loading={projectsLoading}
              rowKey="id"
              size="small"
              pagination={false}
            >
              <Table.Column dataIndex="title" title="Название" ellipsis />
              <Table.Column
                dataIndex="budget"
                title="Бюджет"
                render={(value) => formatCurrency(value)}
              />
              <Table.Column
                dataIndex="status"
                title="Статус"
                render={(value: ProjectStatus) => (
                  <Tag color={PROJECT_STATUS_COLORS[value]}>
                    {PROJECT_STATUS_LABELS[value]}
                  </Tag>
                )}
              />
            </Table>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="🆕 Новые пользователи"
            extra={<a href="/users">Все пользователи →</a>}
          >
            <Table
              dataSource={recentUsers}
              loading={usersLoading}
              rowKey="id"
              size="small"
              pagination={false}
            >
              <Table.Column dataIndex="email" title="Email" ellipsis />
              <Table.Column
                title="Имя"
                render={(_, record: IUser) =>
                  `${record.first_name} ${record.last_name}`
                }
              />
              <Table.Column
                dataIndex="role"
                title="Роль"
                render={(value: UserRole) => (
                  <Tag>{USER_ROLE_LABELS[value]}</Tag>
                )}
              />
            </Table>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

