import { useShow } from "@refinedev/core";
import { Show, TagField } from "@refinedev/antd";
import {
  Typography,
  Descriptions,
  Card,
  Row,
  Col,
  Space,
  Tag,
  Statistic,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { IProject } from "../../types";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  formatCurrency,
  formatDateTime,
  formatDate,
} from "../../utils/constants";

const { Title, Text, Paragraph } = Typography;

export const ProjectShow: React.FC = () => {
  const { queryResult } = useShow<IProject>();
  const { data, isLoading } = queryResult;
  const project = data?.data;

  return (
    <Show isLoading={isLoading}>
      {project && (
        <>
          {/* Заголовок */}
          <Card style={{ marginBottom: 24 }}>
            <Row gutter={24} align="middle">
              <Col flex="auto">
                <Space direction="vertical" size={4}>
                  <Title level={3} style={{ margin: 0 }}>
                    {project.title}
                  </Title>
                  <Space>
                    <TagField
                      color={PROJECT_STATUS_COLORS[project.status]}
                      value={PROJECT_STATUS_LABELS[project.status]}
                    />
                  </Space>
                </Space>
              </Col>
              <Col>
                <Row gutter={32}>
                  <Col>
                    <Statistic
                      title="Бюджет"
                      value={project.budget}
                      prefix={<DollarOutlined />}
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          <Row gutter={24}>
            <Col xs={24} lg={16}>
              {/* Описание */}
              <Card title="📝 Описание">
                <Paragraph>{project.description}</Paragraph>
              </Card>

              {/* Требования */}
              {project.requirements && (
                <Card title="📋 Требования" style={{ marginTop: 24 }}>
                  <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                    {project.requirements}
                  </Paragraph>
                </Card>
              )}

              {/* Сгенерированное ТЗ */}
              {project.generated_spec && (
                <Card title="🤖 Сгенерированное ТЗ (AI)" style={{ marginTop: 24 }}>
                  <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                    {project.generated_spec}
                  </Paragraph>
                </Card>
              )}

              {/* Оценка LLM */}
              {project.llm_estimation && (
                <Card title="⏱️ AI Оценка времени" style={{ marginTop: 24 }}>
                  <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                    {project.llm_estimation}
                  </Paragraph>
                </Card>
              )}
            </Col>

            <Col xs={24} lg={8}>
              {/* Основная информация */}
              <Card title="📊 Информация">
                <Descriptions column={1}>
                  <Descriptions.Item label="ID">{project.id}</Descriptions.Item>
                  <Descriptions.Item label="Статус">
                    <TagField
                      color={PROJECT_STATUS_COLORS[project.status]}
                      value={PROJECT_STATUS_LABELS[project.status]}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Бюджет">
                    <Text type="success" strong>
                      {formatCurrency(project.budget)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Заказчик ID">
                    <UserOutlined style={{ marginRight: 8 }} />
                    {project.customer_id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Исполнитель ID">
                    <UserOutlined style={{ marginRight: 8 }} />
                    {project.assignee_id || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Даты */}
              <Card title="📅 Даты" style={{ marginTop: 24 }}>
                <Descriptions column={1}>
                  {project.deadline && (
                    <Descriptions.Item label="Дедлайн">
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      <Text type={new Date(project.deadline) < new Date() ? "danger" : undefined}>
                        {formatDate(project.deadline)}
                      </Text>
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Создан">
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {formatDateTime(project.created_at)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Обновлён">
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {formatDateTime(project.updated_at)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Технический стек */}
              {project.tech_stack && (
                <Card title="🛠️ Технологии" style={{ marginTop: 24 }}>
                  <Space wrap>
                    {project.tech_stack.split(",").map((tech, index) => (
                      <Tag key={index} color="blue">
                        {tech.trim()}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              )}
            </Col>
          </Row>
        </>
      )}
    </Show>
  );
};

