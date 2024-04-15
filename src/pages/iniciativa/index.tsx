import {
  Button,
  Dropdown,
  MenuProps,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  deleteEstrategia,
  getEstrategia,
} from '../../hooks/services/axios/estrategiaService';
import {
  deleteIniciativa,
  getIniciativa,
} from '../../hooks/services/axios/iniciativaService';
import { getAcao } from '../../hooks/services/axios/acaoService';
import { getMeta } from '../../hooks/services/axios/metaService';
import { ColumnsType } from 'antd/es/table';
import ModalEstrategia from '../../components/Modal/ModalEstrategia';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import ModalIniciativa from '../../components/Modal/ModalIniciativa';
import ModalMeta from '../../components/Modal/ModalMeta';

interface EstrategiaData {
  id: string;
  name: string;
  iniciativa: IniciativasData[];
  objetivo: any;
}

interface IniciativasData {
  id: string;
  name: string;
  item: string;
  percentualExecutado: number;
  status: string;
  estrategia: EstrategiaData;
  meta: MetaData[];
}

interface MetaData {
  id: string;
  name: string;
  iniciativa: IniciativasData;
  acao: AcaoData[];
}

interface AcaoData {
  id: string;
  name: string;
  ano: any;
  percentualExecutado: number;
  status: string;
  departamentoResponsavel: string;
  justificativa: string;
  observacao: string;
  entraves: string;
  meta: MetaData;
}

type Props = {
  setChave: (id: string) => void;
  objetivoId: any;
  onEstrategiaChange: (id: string) => void;
};

export default function Iniciativa({
  objetivoId,
  setChave,
  onEstrategiaChange,
}: Props) {
  const [estrategias, setEstrategia] = useState<EstrategiaData[]>([]);
  const [iniciativas, setIniciativas] = useState<IniciativasData[]>([]);
  const [metas, setMeta] = useState<MetaData[]>([]);
  const [acoes, setAcoes] = useState<AcaoData[]>([]);

  const [recordEstrategia, setRecordEstrategia] = useState<any>({});
  const [recordIniciativa, setRecordIniciativa] = useState<any>({});
  const [recordMeta, setRecordMeta] = useState<any>({});

  const [showMetaModal, setShowMetaModal] = useState<boolean>(false);
  const [showIniciativaModal, setShowIniciativaModal] =
    useState<boolean>(false);

  const [showEstrategiaModal, setShowEstrategiaModal] =
    useState<boolean>(false);

  useEffect(() => {
    loadingEstrategia();
    loadingAcao();
    loadingMeta();
  }, []);

  const loadingEstrategia = async () => {
    const response = await getEstrategia('estrategia');
    if (response) {
      const estrategia = response.data;
      const filterEstrategia = estrategia.filter((e: EstrategiaData) => {
        return e.objetivo?.id === objetivoId;
      });

      const sortedEstrategia = filterEstrategia.sort((a: any, b: any) => {
        // Convertendo as datas para objetos Date para que possam ser comparadas
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        // Comparando as datas
        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
      });

      setEstrategia(sortedEstrategia);
      loadingIniciativa(sortedEstrategia);
    }
  };

  const loadingIniciativa = async (estrategiaData: EstrategiaData[]) => {
    const response = await getIniciativa('iniciativa');
    if (response) {
      const iniciativa = response.data;
      const filteredIniciativas = iniciativa.filter((ini: IniciativasData) => {
        return estrategiaData.some(est => ini.estrategia?.id === est.id);
      });

      setIniciativas(filteredIniciativas);
    }
  };

  const loadingMeta = async () => {
    const response = await getMeta('meta');
    if (response) {
      const meta = response.data;
      setMeta(meta);
    }
  };

  const loadingAcao = async () => {
    const response = await getAcao('acao');
    if (response) {
      const acao = response.data;
      setAcoes(acao);
    }
  };

  const hideModal = () => {
    setShowEstrategiaModal(false);
    setShowIniciativaModal(false);
    setShowMetaModal(false);

    setRecordEstrategia(null);
    setRecordIniciativa(null);
    setRecordMeta(null);
  };

  const handleOpenEstrategiaModal = () => {
    setShowEstrategiaModal(true);
  };
  const handleVoltarPage = () => {
    setChave('2');
  };

  const updateEstrategia = (estrategia: any) => {
    setEstrategia(prevEstrategia => [...prevEstrategia, estrategia]);
    loadingEstrategia();
  };

  const updateIniciativa = (ini: any) => {
    setEstrategia(prevIni => [...prevIni, ini]);
    loadingEstrategia();
  };

  const updateMeta = (meta: any) => {
    setMeta(prevMeta => [...prevMeta, meta]);
    loadingEstrategia();
  };

  const clickDeleteEstrategia = async (estrategiaId: any) => {
    await deleteEstrategia(estrategiaId);
    const newData = [...estrategias];
    newData.splice(estrategiaId, -1);
    setEstrategia(newData);
    loadingEstrategia();
  };

  const clickDeleteIniciativa = async (iniciativaId: any) => {
    await deleteIniciativa(iniciativaId);
    const newData = [...iniciativas];
    newData.splice(iniciativaId, -1);
    setIniciativas(newData);
    loadingEstrategia();
  };

  const clickDeleteMeta = async (metaId: any) => {
    await deleteEstrategia(metaId);
    const newData = [...metas];
    newData.splice(metaId, -1);
    setMeta(newData);
    loadingEstrategia();
  };

  const handleMenuClickEstrategia: MenuProps['onClick'] = e => {
    if (e.key === '2') {
      setShowEstrategiaModal(true);
    } else if (e.key === '3') {
      setShowIniciativaModal(true);
    }
  };

  const handleMenuClickIniciativa: MenuProps['onClick'] = e => {
    if (e.key === '2') {
      setShowIniciativaModal(true);
    } else if (e.key === '3') {
      setShowMetaModal(true);
    }
  };

  const handleMenuClickMeta: MenuProps['onClick'] = e => {
    if (e.key === '2') {
      setShowMetaModal(true);
    } else if (e.key === '3') {
      setShowMetaModal(true);
    }
  };

  const expandedRowRender = (record: any) => {
    //adicionar uma chave única para cada objetos do recurso usando o índice
    const iniciativaWithKeys = iniciativas.map((ini, index) => ({
      ...ini,
      key: `ini${index}`,
    }));
    // filtra os objetos vinculado com uma meta
    const filterIniciativa = iniciativaWithKeys.filter(
      ini => ini?.estrategia?.id === record.id,
    );

    const columns: ColumnsType<IniciativasData> = [
      {
        title: 'Item',
        dataIndex: 'item',
      },
      {
        title: 'Iniciativas',
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: 'Porcentagem Executada',
        dataIndex: 'percentualExecutado',
        width: '20%',
      },
      {
        title: 'Ação',
        key: 'operation',
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
                          onConfirm={() => clickDeleteIniciativa(record.id)}
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
                        setRecordIniciativa(record);
                      },
                    },
                    {
                      label: (
                        <Space style={{ color: ' rgb(0, 21, 42)' }}>
                          <PlusOutlined style={{ color: 'rgb(0, 21, 42)' }} />
                          Meta
                        </Space>
                      ),
                      key: '3',
                      onClick: () => {
                        setRecordIniciativa(record);
                      },
                    },
                  ],
                  onClick: handleMenuClickIniciativa,
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
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={filterIniciativa}
        pagination={false}
        expandable={{
          expandedRowRender: expandedRowRenderMeta,
        }}
        rowClassName={() => 'custom-table'}
        className="custom-table"
      />
    );
  };

  const expandedRowRenderMeta = (record: any) => {
    //adicionar uma chave única para cada entrega usando o índice
    const metaWithKeys = metas.map((acao, index) => ({
      ...acao,
      key: `acao${index}`,
    }));
    // filtra as entregas vinculados com fundo a funso
    const filteredMeta = metaWithKeys.filter(
      meta => meta.iniciativa?.id === record.id,
    );

    console.log('aaa', record);
    const sortedMeta = filteredMeta.sort((a: any, b: any) => {
      return parseInt(a.ano, 10) - parseInt(b.ano, 10);
    });

    const columns: TableColumnsType<MetaData> = [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Ação',
        key: 'operation',
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
                          onConfirm={() => clickDeleteMeta(record.id)}
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
                        setRecordMeta(record);
                      },
                    },
                    {
                      label: (
                        <Space style={{ color: ' rgb(0, 21, 42)' }}>
                          <PlusOutlined style={{ color: 'rgb(0, 21, 42)' }} />
                          Meta
                        </Space>
                      ),
                      key: '3',
                      onClick: () => {
                        setRecordMeta(record);
                      },
                    },
                  ],
                  onClick: handleMenuClickMeta,
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
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={sortedMeta}
        pagination={false}
        rowClassName={() => 'custom-table'}
        className="custom-table"
      />
    );
  };

  const columns: ColumnsType<EstrategiaData> = [
    {
      title: 'Estrategia',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: 'Ação',
      key: 'operation',
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
                        onConfirm={() => clickDeleteEstrategia(record.id)}
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
                      setRecordEstrategia(record);
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
                      setRecordEstrategia(record);
                    },
                  },
                ],
                onClick: handleMenuClickEstrategia,
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
        onClick={handleVoltarPage}
      >
        Voltar
      </Button>
      <Button
        className="button-criar"
        type="primary"
        onClick={handleOpenEstrategiaModal}
      >
        Nova Estrategia
      </Button>

      <div>
        <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={estrategias}
          pagination={false}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys: ['0'],
          }}
          rowClassName={() => 'custom-table-row'}
          className="custom-table"
        />
      </div>

      <ModalEstrategia
        updatedEstrategiaList={updateEstrategia}
        id={recordEstrategia?.id}
        objetivoId={objetivoId}
        openModal={showEstrategiaModal}
        closeModal={hideModal}
      />
      <ModalIniciativa
        updatedIniciativaList={updateIniciativa}
        id={recordIniciativa?.id}
        estrategiaId={recordEstrategia?.id}
        openModal={showIniciativaModal}
        closeModal={hideModal}
      />
      <ModalMeta
        updatedMetaList={updateMeta}
        id={recordMeta?.id}
        iniciativaId={recordIniciativa?.id}
        openModal={showMetaModal}
        closeModal={hideModal}
      />
    </>
  );
}
