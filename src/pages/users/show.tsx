import { useShow } from "@refinedev/core";
import { Show, TagField } from "@refinedev/antd";
import {
  Typography,
  Descriptions,
  Card,
  Row,
  Col,
  Avatar,
  Space,
  Divider,
  Tag,
  Statistic,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  StarOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { IUser, UserRole } from "../../types";
import {
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  formatDateTime,
} from "../../utils/constants";

const { Title, Text, Paragraph } = Typography;

export const UserShow: React.FC = () => {
  const { queryResult } = useShow<IUser>();
  const { data, isLoading } = queryResult;
  const user = data?.data;

  return (
    <Show isLoading={isLoading}>
      {user && (
        <>
          {/* Заголовок с аватаром */}
          <Card style={{ marginBottom: 24 }}>
            <Row gutter={24} align="middle">
              <Col>
                <Avatar
                  src={user.avatar_url}
                  icon={<UserOutlined />}
                  size={100}
                />
              </Col>
              <Col flex="auto">
                <Space direction="vertical" size={4}>
                  <Title level={3} style={{ margin: 0 }}>
                    {user.first_name} {user.last_name}
                  </Title>
                  <Space>
                    <MailOutlined />
                    <Text>{user.email}</Text>
                  </Space>
                  <Space>
                    <TagField
                      color={USER_ROLE_COLORS[user.role]}
                      value={USER_ROLE_LABELS[user.role]}
                    />
                    {user.is_active ? (
                      <Tag color="green">✅ Активен</Tag>
                    ) : (
                      <Tag color="red">❌ Заблокирован</Tag>
                    )}
                    {user.is_verified && <Tag color="blue">✓ Верифицирован</Tag>}
                  </Space>
                </Space>
              </Col>
              <Col>
                <Row gutter={32}>
                  <Col>
                    <Statistic
                      title="Рейтинг"
                      value={user.rating_score?.toFixed(1) || "0.0"}
                      prefix={<StarOutlined />}
                    />
                  </Col>
                  <Col>
                    <Statistic
                      title="Проектов"
                      value={user.completed_projects || 0}
                      prefix={<ProjectOutlined />}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          {/* Основная информация */}
          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <Card title="📋 Основная информация">
                <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                  <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                  <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                  <Descriptions.Item label="Имя">{user.first_name}</Descriptions.Item>
                  <Descriptions.Item label="Фамилия">{user.last_name}</Descriptions.Item>
                  <Descriptions.Item label="Роль">
                    <TagField
                      color={USER_ROLE_COLORS[user.role]}
                      value={USER_ROLE_LABELS[user.role]}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Статус">
                    {user.is_active ? (
                      <Tag color="green">Активен</Tag>
                    ) : (
                      <Tag color="red">Заблокирован</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Верификация">
                    {user.is_verified ? (
                      <Tag color="blue">Верифицирован</Tag>
                    ) : (
                      <Tag>Не верифицирован</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Рейтинг">
                    ⭐ {user.rating_score?.toFixed(2) || "0.00"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Био и навыки */}
              {(user.bio || user.skills) && (
                <Card title="📝 О пользователе" style={{ marginTop: 24 }}>
                  {user.bio && (
                    <>
                      <Title level={5}>Биография</Title>
                      <Paragraph>{user.bio}</Paragraph>
                    </>
                  )}
                  {user.skills && (
                    <>
                      <Divider />
                      <Title level={5}>Навыки</Title>
                      <Space wrap>
                        {user.skills.split(",").map((skill, index) => (
                          <Tag key={index} color="blue">
                            {skill.trim()}
                          </Tag>
                        ))}
                      </Space>
                    </>
                  )}
                </Card>
              )}
            </Col>

            <Col xs={24} lg={8}>
              {/* Даты */}
              <Card title="📅 Даты">
                <Descriptions column={1}>
                  <Descriptions.Item label="Регистрация">
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {formatDateTime(user.created_at)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Обновление">
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {formatDateTime(user.updated_at)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Статистика для студентов */}
              {user.role === UserRole.STUDENT && (
                <Card title="📊 Статистика" style={{ marginTop: 24 }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title="Завершено проектов"
                        value={user.completed_projects || 0}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Средний рейтинг"
                        value={user.rating_score?.toFixed(1) || "0.0"}
                        suffix="/ 5.0"
                      />
                    </Col>
                  </Row>
                </Card>
              )}
            </Col>
          </Row>
        </>
      )}
    </Show>
  );
};

