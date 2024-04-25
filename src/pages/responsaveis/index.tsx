import { useEffect, useState } from 'react';
import {
  deleteResponsavel,
  getResponsavel,
} from '../../hooks/services/axios/responsavelService';
import KanbamList from '../../components/Kanbam';
import { getAcao } from '../../hooks/services/axios/acaoService';
import { Dropdown, MenuProps, Popconfirm, Space, Table } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import ModalResponsveis from '../../components/Modal/ModalResponsaveis';

export default function Responsaveis() {
  const [responsaveis, setResponsaveis] = useState<any>([]);
  const [acoes, setAcoes] = useState<any>([]);

  const [recordResponsavel, setRecordResponsavel] = useState<any>({});
  const [showResponsavelModal, setShowResponsavelModal] =
    useState<boolean>(false);

  useEffect(() => {
    loadingResponsaveis();
    loadingAcoes();
  }, []);

  const loadingResponsaveis = async () => {
    await getResponsavel('responsavel/').then((res: any) => {
      if (res) {
        setResponsaveis(res.data);
      }
    });
  };

  const loadingAcoes = async () => {
    await getAcao('acao/').then((res: any) => {
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
    if (e.key === '2') {
      setShowResponsavelModal(true);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Responável',
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
                    label: (
                      <Popconfirm
                        title="Tem certeza de que deseja desabilitar este registro?"
                        onConfirm={() => clickDeleteResponsavel(record.id)}
                      >
                        Excluir
                      </Popconfirm>
                    ),
                    key: '1',
                    danger: true,
                  },
                  {
                    label: 'Alterar',
                    key: '2',
                    onClick: () => {
                      setRecordResponsavel(record);
                    },
                  },
                  {
                    label: (
                      <Space style={{ color: ' rgb(0, 21, 42)' }}>
                        <PlusOutlined style={{ color: 'rgb(0, 21, 42)' }} />
                        Iniciativa
                      </Space>
                    ),
                    key: '3',
                    onClick: () => {
                      setRecordResponsavel(record);
                    },
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

  const updateResponsaveisList = (resp: any) => {
    setResponsaveis((prevResp: any) => [...prevResp, resp]);
    loadingResponsaveis();
  };

  const hideModal = () => {
    setShowResponsavelModal(false);

    setRecordResponsavel(null);
  };

  return (
    <>
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
