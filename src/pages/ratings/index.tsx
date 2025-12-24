import { List, useTable, DeleteButton } from "@refinedev/antd";
import { Table, Rate, Typography, Space } from "antd";
import { IRating } from "../../types";
import { formatDate } from "../../utils/constants";

const { Text, Paragraph } = Typography;

export const RatingList: React.FC = () => {
  const { tableProps } = useTable<IRating>({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id" scroll={{ x: 900 }}>
        <Table.Column dataIndex="id" title="ID" width={60} sorter />
        <Table.Column dataIndex="project_id" title="Проект ID" width={100} />
        <Table.Column dataIndex="reviewer_id" title="Автор ID" width={100} />
        <Table.Column dataIndex="reviewee_id" title="Получатель ID" width={120} />
        <Table.Column
          dataIndex="score"
          title="Оценка"
          width={150}
          render={(value: number) => (
            <Space>
              <Rate disabled defaultValue={value} />
              <Text strong>{value}/5</Text>
            </Space>
          )}
          sorter
        />
        <Table.Column
          dataIndex="comment"
          title="Комментарий"
          ellipsis
          render={(value: string | null) =>
            value ? (
              <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                {value}
              </Paragraph>
            ) : (
              <Text type="secondary">—</Text>
            )
          }
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
          width={80}
          render={(_, record: IRating) => (
            <DeleteButton hideText size="small" recordItemId={record.id} />
          )}
        />
      </Table>
    </List>
  );
};

