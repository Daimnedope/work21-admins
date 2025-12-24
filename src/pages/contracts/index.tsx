import { List, useTable, TagField } from "@refinedev/antd";
import { Table, Select, Button, Form, Typography } from "antd";
import { IContract, ContractStatus } from "../../types";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_STATUS_COLORS,
  formatCurrency,
  formatDate,
} from "../../utils/constants";

const { Text } = Typography;

export const ContractList: React.FC = () => {
  const { tableProps, searchFormProps } = useTable<IContract>({
    syncWithLocation: true,
    onSearch: (values) => {
      const filters = values as Record<string, unknown>;
      return [
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
        <Form.Item name="status">
          <Select
            placeholder="Статус"
            allowClear
            style={{ width: 180 }}
            options={Object.entries(CONTRACT_STATUS_LABELS).map(
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
        <Table.Column dataIndex="project_id" title="Проект ID" width={100} />
        <Table.Column dataIndex="customer_id" title="Заказчик ID" width={110} />
        <Table.Column dataIndex="student_id" title="Студент ID" width={100} />
        <Table.Column
          dataIndex="total_amount"
          title="Сумма"
          width={130}
          render={(value: number) => (
            <Text type="success" strong>
              {formatCurrency(value)}
            </Text>
          )}
          sorter
        />
        <Table.Column
          dataIndex="status"
          title="Статус"
          width={140}
          render={(value: ContractStatus) => (
            <TagField
              color={CONTRACT_STATUS_COLORS[value]}
              value={CONTRACT_STATUS_LABELS[value]}
            />
          )}
        />
        <Table.Column
          dataIndex="signed_at"
          title="Подписан"
          width={110}
          render={(value: string | null) => (value ? formatDate(value) : "-")}
        />
        <Table.Column
          dataIndex="completed_at"
          title="Завершён"
          width={110}
          render={(value: string | null) => (value ? formatDate(value) : "-")}
        />
        <Table.Column
          dataIndex="created_at"
          title="Создан"
          width={110}
          render={(value: string) => formatDate(value)}
          sorter
        />
      </Table>
    </List>
  );
};

