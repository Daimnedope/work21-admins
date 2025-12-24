import { List, useTable, TagField } from "@refinedev/antd";
import { Table, Space, Select, Button, Form, Typography, Popconfirm, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { IApplication, ApplicationStatus } from "../../types";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  formatCurrency,
  formatDate,
} from "../../utils/constants";

const { Text } = Typography;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const ApplicationList: React.FC = () => {
  const { tableProps, searchFormProps } = useTable<IApplication>({
    syncWithLocation: true,
    onSearch: (values) => {
      const filters = values as Record<string, unknown>;
      return [
        { field: "status", operator: "eq" as const, value: filters.status as string },
      ];
    },
  });

  const handleUpdateStatus = async (id: number, status: ApplicationStatus) => {
    try {
      await axios.patch(`${API_URL}/admin/applications/${id}`, { status });
      message.success("Статус заявки обновлён");
      window.location.reload();
    } catch (error) {
      message.error("Ошибка при обновлении статуса");
    }
  };

  return (
    <List>
      {/* Фильтры */}
      <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}
      >
        <Form.Item name="status">
          <Select
            placeholder="Статус"
            allowClear
            style={{ width: 180 }}
            options={Object.entries(APPLICATION_STATUS_LABELS).map(
              ([value, label]) => ({
                value,
                label,
              })
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Фильтровать
          </Button>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id" scroll={{ x: 900 }}>
        <Table.Column dataIndex="id" title="ID" width={60} sorter />
        <Table.Column
          dataIndex="project_id"
          title="Проект ID"
          width={100}
        />
        <Table.Column
          dataIndex="student_id"
          title="Студент ID"
          width={100}
        />
        <Table.Column
          dataIndex="proposed_rate"
          title="Предложенная ставка"
          width={150}
          render={(value: number | null) =>
            value ? (
              <Text type="success">{formatCurrency(value)}</Text>
            ) : (
              "-"
            )
          }
        />
        <Table.Column
          dataIndex="status"
          title="Статус"
          width={140}
          render={(value: ApplicationStatus) => (
            <TagField
              color={APPLICATION_STATUS_COLORS[value]}
              value={APPLICATION_STATUS_LABELS[value]}
            />
          )}
        />
        <Table.Column
          dataIndex="cover_letter"
          title="Сопр. письмо"
          ellipsis
          render={(value: string | null) => value || "-"}
        />
        <Table.Column
          dataIndex="created_at"
          title="Дата"
          width={110}
          render={(value: string) => formatDate(value)}
          sorter
        />
        <Table.Column
          title="Действия"
          fixed="right"
          width={150}
          render={(_, record: IApplication) => (
            <Space size="small">
              {record.status === ApplicationStatus.PENDING && (
                <>
                  <Popconfirm
                    title="Принять заявку?"
                    onConfirm={() =>
                      handleUpdateStatus(record.id, ApplicationStatus.ACCEPTED)
                    }
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button
                      size="small"
                      type="primary"
                      icon={<CheckOutlined />}
                      title="Принять"
                    />
                  </Popconfirm>
                  <Popconfirm
                    title="Отклонить заявку?"
                    onConfirm={() =>
                      handleUpdateStatus(record.id, ApplicationStatus.REJECTED)
                    }
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button
                      size="small"
                      danger
                      icon={<CloseOutlined />}
                      title="Отклонить"
                    />
                  </Popconfirm>
                </>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

