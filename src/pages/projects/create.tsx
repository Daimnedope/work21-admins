import { Create, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Card,
} from "antd";
import { PROJECT_STATUS_LABELS } from "../../utils/constants";

const { TextArea } = Input;

export const ProjectCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="📝 Основные данные">
              <Form.Item
                label="Название"
                name="title"
                rules={[{ required: true, message: "Введите название" }]}
              >
                <Input placeholder="Название проекта" />
              </Form.Item>

              <Form.Item
                label="Описание"
                name="description"
                rules={[{ required: true, message: "Введите описание" }]}
              >
                <TextArea rows={4} placeholder="Подробное описание проекта..." />
              </Form.Item>

              <Form.Item label="Требования" name="requirements">
                <TextArea
                  rows={6}
                  placeholder="Технические требования, функциональность..."
                />
              </Form.Item>

              <Form.Item
                label="Технический стек"
                name="tech_stack"
                extra="Введите технологии через запятую"
              >
                <Input placeholder="Python, FastAPI, PostgreSQL, React" />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="⚙️ Настройки">
              <Form.Item
                label="Статус"
                name="status"
                initialValue="DRAFT"
                rules={[{ required: true, message: "Выберите статус" }]}
              >
                <Select
                  options={Object.entries(PROJECT_STATUS_LABELS).map(
                    ([value, label]) => ({
                      value,
                      label,
                    })
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Бюджет (₽)"
                name="budget"
                rules={[{ required: true, message: "Введите бюджет" }]}
              >
                <InputNumber
                  min={0}
                  step={1000}
                  style={{ width: "100%" }}
                  placeholder="50000"
                />
              </Form.Item>

              <Form.Item label="Дедлайн" name="deadline">
                <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
              </Form.Item>
            </Card>

            <Card title="👥 Участники" style={{ marginTop: 24 }}>
              <Form.Item
                label="ID Заказчика"
                name="customer_id"
                rules={[{ required: true, message: "Укажите заказчика" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} placeholder="1" />
              </Form.Item>

              <Form.Item label="ID Исполнителя" name="assignee_id">
                <InputNumber min={1} style={{ width: "100%" }} placeholder="Опционально" />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};

