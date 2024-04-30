import { useEffect, useState } from 'react';
import {
  deleteResponsavel,
  getResponsavel,
} from '../../hooks/services/axios/responsavelService';
import { getAcao } from '../../hooks/services/axios/acaoService';
import { Button, Dropdown, MenuProps, Popconfirm, Space, Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import ModalResponsveis from '../../components/Modal/ModalResponsaveis';

type ResponsavelData = {
  id: string;
  name: string;
  cargo: string;
  acao: any;
};
export default function Responsaveis() {
  const [responsaveis, setResponsaveis] = useState<ResponsavelData[]>([]);
  const [recordResponsavel, setRecordResponsavel] = useState<any>({});
  const [showResponsavelModal, setShowResponsavelModal] =
    useState<boolean>(false);

  const [acoes, setAcoes] = useState<any>([]);

  useEffect(() => {
    loadingResponsaveis();
    loadingAcoes();
  }, []);

  const updateResponsaveisList = (newResp: any) => {
    loadingResponsaveis();
  };

  const hideModal = () => {
    setShowResponsavelModal(false);
    setRecordResponsavel(null);
  };

  const loadingResponsaveis = async () => {
    const resData = await getResponsavel('responsavel');
    if (resData) {
      const responsavelData = resData.data;
      setResponsaveis(responsavelData);
    }
  };

  const loadingAcoes = async () => {
    await getAcao('acao').then((res: any) => {
      if (res) {
        setAcoes(res.data);
      }
    });
  };

  const clickDeleteResponsavel = async (respId: any) => {
    await deleteResponsavel(respId);
    const newData = [...responsaveis];
    newData.splice(respId, -1);
    setResponsaveis(newData);
    loadingResponsaveis();
  };

  const handleOpenPerspectivaModal = async () => {
    setShowResponsavelModal(true);
  };

  const expandedRowRender = (record: any) => {
    //adicionar uma chave única para cada objetos do recurso usando o índice
    const acaoWithKeys = acoes.map((acao: any, index: any) => ({
      ...acao,
      key: `acao${index}`,
    }));
    // filtra os objetos vinculado com uma meta
    const filterAcao = acaoWithKeys.filter((acao: any) =>
      acao?.responsaveis.find((resp: any) => resp.id === record.id),
    );

    const columns: ColumnsType<any> = [
      {
        title: 'Ação',
        dataIndex: 'name',
        width: '40%',
      },
      {
        title: 'Porcentagem Executada',
        dataIndex: 'percentualExecutado',
        render: (value: number) => `${value} %`,
      },
    ];

    return (
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={filterAcao}
        pagination={false}
        rowClassName={() => 'custom-table-destiny'}
        className="custom-table"
      />
    );
  };
  const handleMenuClickResponsavel: MenuProps['onClick'] = e => {
    if (e.key === '1') {
      setShowResponsavelModal(true);
    }
  };

  const columns: ColumnsType<ResponsavelData> = [
    {
      title: 'Responsavel',
      dataIndex: 'name',
    },
    {
      title: 'Ação',
      key: 'operation',
      width: '20%',
      render: (record: any) => {
        return (
          <Space size="middle">
            <Dropdown
              menu={{
                items: [
                  {
                    label: 'Alterar',
                    key: '1',
                    onClick: () => {
                      setRecordResponsavel(record);
                    },
                  },
                  {
                    label: (
                      <Popconfirm
                        title="Tem certeza de que deseja desabilitar este registro?"
                        onConfirm={() => clickDeleteResponsavel(record.id)}
                      >
                        Excluir
                      </Popconfirm>
                    ),
                    key: '2',
                    danger: true,
                  },
                ],
                onClick: handleMenuClickResponsavel,
              }}
            >
              <a onClick={e => e.preventDefault()} className="option">
                <Space>
                  Mais
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Button
        className="button-criar"
        type="primary"
        onClick={handleOpenPerspectivaModal}
      >
        Nova Perspectiva
      </Button>
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={responsaveis}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ['0'],
        }}
        pagination={false}
        rowClassName={() => 'custom-table-row'}
        className="custom-table"
      />

      <ModalResponsveis
        id={recordResponsavel?.id}
        openModal={showResponsavelModal}
        updateResponsaveisList={updateResponsaveisList}
        closeModal={hideModal}
      />
    </>
  );
}
