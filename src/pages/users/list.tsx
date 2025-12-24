import { useState } from "react";
import {
  List,
  useTable,
  EditButton,
  ShowButton,
  TagField,
  FilterDropdown,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Input,
  Select,
  Button,
  Modal,
  Form,
  message,
  Popconfirm,
  Avatar,
  Typography,
} from "antd";
import {
  SearchOutlined,
  LockOutlined,
  StopOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { IUser, UserRole } from "../../types";
import {
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  formatDate,
} from "../../utils/constants";

const { Text } = Typography;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const UserList: React.FC = () => {
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [form] = Form.useForm();

  const { tableProps, searchFormProps } = useTable<IUser>({
    syncWithLocation: true,
    onSearch: (values) => {
      const filters = values as Record<string, unknown>;
      return [
        {
          field: "search",
          operator: "contains" as const,
          value: filters.search as string,
        },
        { field: "role", operator: "eq" as const, value: filters.role as string },
        {
          field: "is_active",
          operator: "eq" as const,
          value: filters.is_active as boolean,
        },
      ];
    },
  });

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      const values = await form.validateFields();
      setActionLoading(true);

      await axios.post(
        `${API_URL}/admin/users/${selectedUser.id}/reset-password`,
        { new_password: values.password }
      );

      message.success(`Пароль пользователя ${selectedUser.email} изменён`);
      setResetModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Ошибка при сбросе пароля");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBlock = async (user: IUser) => {
    try {
      setActionLoading(true);
      const action = user.is_active ? "block" : "unblock";

      await axios.post(`${API_URL}/admin/users/${user.id}/${action}`);

      message.success(
        user.is_active
          ? `Пользователь ${user.email} заблокирован`
          : `Пользователь ${user.email} разблокирован`
      );

      // Перезагружаем таблицу
      window.location.reload();
    } catch (error) {
      message.error("Ошибка при изменении статуса");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <List>
        {/* Фильтры */}
        <Form
          {...searchFormProps}
          layout="inline"
          style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}
        >
          <Form.Item name="search">
            <Input
              placeholder="Поиск по email, имени..."
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 250 }}
            />
          </Form.Item>
          <Form.Item name="role">
            <Select
              placeholder="Роль"
              allowClear
              style={{ width: 150 }}
              options={[
                { value: UserRole.STUDENT, label: USER_ROLE_LABELS[UserRole.STUDENT] },
                { value: UserRole.CUSTOMER, label: USER_ROLE_LABELS[UserRole.CUSTOMER] },
                { value: UserRole.ADMIN, label: USER_ROLE_LABELS[UserRole.ADMIN] },
              ]}
            />
          </Form.Item>
          <Form.Item name="is_active">
            <Select
              placeholder="Статус"
              allowClear
              style={{ width: 170 }}
              options={[
                { value: true, label: "✅ Активные" },
                { value: false, label: "❌ Заблокированные" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Найти
            </Button>
          </Form.Item>
        </Form>

        <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
          <Table.Column
            dataIndex="id"
            title="ID"
            width={60}
            sorter
          />
          <Table.Column
            title="Пользователь"
            render={(_, record: IUser) => (
              <Space>
                <Avatar
                  src={record.avatar_url}
                  icon={<UserOutlined />}
                  size="small"
                />
                <div>
                  <div>
                    <Text strong>
                      {record.first_name} {record.last_name}
                    </Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {record.email}
                  </Text>
                </div>
              </Space>
            )}
          />
          <Table.Column
            dataIndex="role"
            title="Роль"
            width={140}
            render={(value: UserRole) => (
              <TagField
                color={USER_ROLE_COLORS[value]}
                value={USER_ROLE_LABELS[value]}
              />
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: 150 }}
                  options={Object.entries(USER_ROLE_LABELS).map(([key, label]) => ({
                    value: key,
                    label,
                  }))}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column
            dataIndex="rating_score"
            title="Рейтинг"
            width={100}
            render={(value: number) => (
              <Text>⭐ {value?.toFixed(1) || "0.0"}</Text>
            )}
            sorter
          />
          <Table.Column
            dataIndex="completed_projects"
            title="Проекты"
            width={90}
            render={(value: number) => value || 0}
            sorter
          />
          <Table.Column
            dataIndex="is_active"
            title="Статус"
            width={130}
            render={(value: boolean) =>
              value ? (
                <TagField color="green" value="✅ Активен" />
              ) : (
                <TagField color="red" value="❌ Заблокирован" />
              )
            }
          />
          <Table.Column
            dataIndex="is_verified"
            title="Верифицирован"
            width={120}
            render={(value: boolean) => (value ? "✅" : "❌")}
          />
          <Table.Column
            dataIndex="created_at"
            title="Регистрация"
            width={120}
            render={(value: string) => formatDate(value)}
            sorter
          />
          <Table.Column
            title="Действия"
            fixed="right"
            width={200}
            render={(_, record: IUser) => (
              <Space size="small">
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
                <Button
                  size="small"
                  icon={<LockOutlined />}
                  onClick={() => {
                    setSelectedUser(record);
                    setResetModalVisible(true);
                  }}
                  title="Сбросить пароль"
                />
                <Popconfirm
                  title={
                    record.is_active
                      ? "Заблокировать пользователя?"
                      : "Разблокировать пользователя?"
                  }
                  onConfirm={() => handleToggleBlock(record)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button
                    size="small"
                    danger={record.is_active}
                    icon={
                      record.is_active ? (
                        <StopOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      )
                    }
                    title={record.is_active ? "Заблокировать" : "Разблокировать"}
                  />
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </List>

      {/* Модалка сброса пароля */}
      <Modal
        title={`🔐 Сброс пароля: ${selectedUser?.email}`}
        open={resetModalVisible}
        onOk={handleResetPassword}
        onCancel={() => {
          setResetModalVisible(false);
          form.resetFields();
        }}
        okText="Сбросить пароль"
        cancelText="Отмена"
        confirmLoading={actionLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="password"
            label="Новый пароль"
            rules={[
              { required: true, message: "Введите пароль" },
              { min: 8, message: "Минимум 8 символов" },
            ]}
          >
            <Input.Password placeholder="Введите новый пароль" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Подтвердите пароль"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Подтвердите пароль" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Подтвердите пароль" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

