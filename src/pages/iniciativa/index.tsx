import { Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { getEstrategia } from '../../hooks/services/axios/estrategiaService';
import { getIniciativa } from '../../hooks/services/axios/iniciativaService';
import { getAcao } from '../../hooks/services/axios/acaoService';
import { getMeta } from '../../hooks/services/axios/metaService';
import { ColumnsType } from 'antd/es/table';
require('../index.css');

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
  objetivo: any;
  onEstrategiaChange: (id: string) => void;
};

export default function Iniciativa({
  objetivo,
  setChave,
  onEstrategiaChange,
}: Props) {
  const [estrategias, setEstrategia] = useState<EstrategiaData[]>([]);
  const [iniciativas, setIniciativas] = useState<IniciativasData[]>([]);
  const [meta, setMeta] = useState<MetaData[]>([]);
  const [acoes, setAcoes] = useState<AcaoData[]>([]);

  useEffect(() => {
    loadingEstrategia();
    loadingIniciativa();
    loadingAcao();
    loadingMeta();
  }, []);

  const loadingEstrategia = async () => {
    const response = await getEstrategia('estrategia');
    if (response) {
      const estrategia = response.data;
      const filterEstrategia = estrategia.filter((e: EstrategiaData) => {
        return e.objetivo?.id === objetivo;
      });
      setEstrategia(filterEstrategia);
    }
  };

  const loadingIniciativa = async () => {
    const response = await getIniciativa('iniciativa');
    if (response) {
      const iniciativa = response.data;
      setIniciativas(iniciativa);
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

  const expandedRowRender = (record: any) => {
    //adicionar uma chave única para cada objetos do recurso usando o índice
    const iniciativaWithKeys = meta.map((ini, index) => ({
      ...ini,
      key: `ini${index}`,
    }));
    // filtra os objetos vinculado com uma meta
    const filterMetaResource = iniciativaWithKeys.filter(
      m => m?.iniciativa?.id === record.id,
    );

    const columns: ColumnsType<MetaData> = [
      {
        title: 'Meta',
        dataIndex: 'name',
      },
    ];

    return (
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={filterMetaResource}
        pagination={false}
        expandable={{
          expandedRowRender: expandedRowRenderAcao,
        }}
        rowClassName={() => 'custom-table-destiny'}
        className="custom-table"
      />
    );
  };

  const expandedRowRenderAcao = (record: any) => {
    //adicionar uma chave única para cada entrega usando o índice
    const acaoWithKeys = acoes.map((acao, index) => ({
      ...acao,
      key: `acao${index}`,
    }));
    // filtra as entregas vinculados com fundo a funso
    const filteredAcao = acaoWithKeys.filter(
      acao => acao.meta?.id === record.id,
    );

    const columns: TableColumnsType<AcaoData> = [
      {
        title: 'Ano',
        dataIndex: 'ano',
        key: 'ano',
      },
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
      },
    ];

    return (
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={filteredAcao}
        pagination={false}
        rowClassName={() => 'custom-table-destiny'}
        className="custom-table"
      />
    );
  };

  const columns: ColumnsType<IniciativasData> = [
    {
      title: 'Item',
      dataIndex: 'item',
    },
    {
      title: 'Iniciativas',
      dataIndex: 'name',
      width: '10%',
      render: (text: any, record: IniciativasData) => {
        return <a>{text}</a>;
      },
    },
    {
      title: 'Metas',
      dataIndex: 'meta',
    },
    {
      title: 'Ações',
      dataIndex: 'meta',
      render: (meta: any) => {
        return (
          <ul>
            {meta &&
              meta.map(
                (m: MetaData) =>
                  m.acao &&
                  m.acao.map((a: AcaoData) => <li key={a.id}>{a.name}</li>),
              )}
          </ul>
        );
      },
    },
  ];
  return (
    <>
      {estrategias.map((estrategia: EstrategiaData) => {
        const filteredIniciativas = iniciativas.filter(
          (ini: IniciativasData) => {
            return ini.estrategia?.id === estrategia.id;
          },
        );

        return (
          <div key={estrategia?.id}>
            <p>{estrategia?.name}</p>
            {filteredIniciativas.map((ini: IniciativasData) => (
              <div key={ini?.id}></div>
            ))}
            <Table
              rowKey={record => record.id}
              columns={columns}
              dataSource={filteredIniciativas}
              pagination={false}
              expandable={{
                expandedRowRender,
                defaultExpandedRowKeys: ['0'],
              }}
              rowClassName={() => 'custom-table-row'}
              className="custom-table"
            />
          </div>
        );
      })}
    </>
  );
}
