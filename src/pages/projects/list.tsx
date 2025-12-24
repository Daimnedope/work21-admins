import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  TagField,
} from "@refinedev/antd";
import { Table, Space, Input, Select, Button, Form, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { IProject, ProjectStatus } from "../../types";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  formatCurrency,
  formatDate,
} from "../../utils/constants";

const { Text } = Typography;

export const ProjectList: React.FC = () => {
  const { tableProps, searchFormProps } = useTable<IProject>({
    syncWithLocation: true,
    onSearch: (values) => {
      const filters = values as Record<string, unknown>;
      return [
        {
          field: "search",
          operator: "contains" as const,
          value: filters.search as string,
        },
        { field: "status", operator: "eq" as const, value: filters.status as string },
      ];
    },
  });

  return (
    <List>
      {/* Фильтры */}
      <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}
      >
        <Form.Item name="search">
          <Input
            placeholder="Поиск по названию..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 250 }}
          />
        </Form.Item>
        <Form.Item name="status">
          <Select
            placeholder="Статус"
            allowClear
            style={{ width: 180 }}
            options={Object.entries(PROJECT_STATUS_LABELS).map(
              ([value, label]) => ({
                value,
                label,
              })
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Найти
          </Button>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id" scroll={{ x: 1100 }}>
        <Table.Column dataIndex="id" title="ID" width={60} sorter />
        <Table.Column
          dataIndex="title"
          title="Название"
          ellipsis
          render={(value: string) => <Text strong>{value}</Text>}
        />
        <Table.Column
          dataIndex="budget"
          title="Бюджет"
          width={120}
          render={(value: number) => (
            <Text type="success">{formatCurrency(value)}</Text>
          )}
          sorter
        />
        <Table.Column
          dataIndex="status"
          title="Статус"
          width={150}
          render={(value: ProjectStatus) => (
            <TagField
              color={PROJECT_STATUS_COLORS[value]}
              value={PROJECT_STATUS_LABELS[value]}
            />
          )}
        />
        <Table.Column
          dataIndex="customer_id"
          title="Заказчик ID"
          width={100}
        />
        <Table.Column
          dataIndex="assignee_id"
          title="Исполнитель ID"
          width={110}
          render={(value: number | null) => value || "-"}
        />
        <Table.Column
          dataIndex="deadline"
          title="Дедлайн"
          width={110}
          render={(value: string | null) => (value ? formatDate(value) : "-")}
          sorter
        />
        <Table.Column
          dataIndex="created_at"
          title="Создан"
          width={110}
          render={(value: string) => formatDate(value)}
          sorter
        />
        <Table.Column
          title="Действия"
          fixed="right"
          width={150}
          render={(_, record: IProject) => (
            <Space size="small">
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

