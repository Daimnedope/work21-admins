import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Row, Col, Card } from "antd";
import { USER_ROLE_LABELS } from "../../utils/constants";

const { TextArea } = Input;

export const UserCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="👤 Основные данные">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Введите email" },
                      { type: "email", message: "Некорректный email" },
                    ]}
                  >
                    <Input placeholder="user@example.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[
                      { required: true, message: "Введите пароль" },
                      { min: 8, message: "Минимум 8 символов" },
                    ]}
                  >
                    <Input.Password placeholder="Минимум 8 символов" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Имя"
                    name="first_name"
                    rules={[{ required: true, message: "Введите имя" }]}
                  >
                    <Input placeholder="Иван" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Фамилия"
                    name="last_name"
                    rules={[{ required: true, message: "Введите фамилию" }]}
                  >
                    <Input placeholder="Иванов" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Роль"
                name="role"
                rules={[{ required: true, message: "Выберите роль" }]}
              >
                <Select
                  placeholder="Выберите роль"
                  options={Object.entries(USER_ROLE_LABELS).map(
                    ([value, label]) => ({
                      value,
                      label,
                    })
                  )}
                />
              </Form.Item>

              <Form.Item label="Биография" name="bio">
                <TextArea
                  rows={4}
                  placeholder="Расскажите о пользователе..."
                />
              </Form.Item>

              <Form.Item
                label="Навыки"
                name="skills"
                extra="Введите навыки через запятую"
              >
                <Input placeholder="Python, JavaScript, React, Docker" />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="⚙️ Настройки">
              <Form.Item
                label="Активен"
                name="is_active"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Да" unCheckedChildren="Нет" />
              </Form.Item>

              <Form.Item
                label="Верифицирован"
                name="is_verified"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="Да" unCheckedChildren="Нет" />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};

