import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { getEstrategia } from '../../hooks/services/axios/estrategiaService';
import { getIniciativa } from '../../hooks/services/axios/iniciativaService';
import { getAcao } from '../../hooks/services/axios/acaoService';
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
  const [acoes, setAcoes] = useState<AcaoData[]>([]);

  useEffect(() => {
    loadingEstrategia();
    loadingIniciativa();
    loadingAcao();
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

  const loadingAcao = async () => {
    const response = await getAcao('acao');
    if (response) {
      const acao = response.data;
      setAcoes(acao);
    }
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      width: '1px',
    },
    {
      title: 'Iniciativas',
      dataIndex: 'name',
      width: '10%',
      render: (iniciativa: string, record: IniciativasData) => {
        return <p>{iniciativa}</p>;
      },
    },

    {
      title: 'Metas',
      dataIndex: 'meta',
      width: '10%',
      render: (meta: MetaData[], record: IniciativasData, index: number) => {
        return (
          <ul>
            {meta.map((m: MetaData) => (
              <li key={m.id} style={{ marginTop: '20px' }}>
                {m.name}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      title: 'Ações',
      dataIndex: 'meta',
      width: '10%',
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
    {
      /*{
      title: 'Home phone',
      colSpan: 2,
      dataIndex: 'tel',
      render: (tel: string, record: EstrategiaData, index: number) => {
        if (index === 3) {
          return { children: tel, rowSpan: 2 };
        }
        if (index === 4) {
          return null;
        }
        return tel;
      },
    },
  ,*/
    },
  ];
  return (
    <>
      {estrategias.map((estrategia: EstrategiaData) => {
        const filteredIniciativas = iniciativas.filter(
          (ini: IniciativasData) => {
            return ini.estrategia.id === estrategia.id;
          },
        );

        return (
          <div key={estrategia?.id}>
            <p>{estrategia?.name}</p>
            {filteredIniciativas.map((ini: IniciativasData) => (
              <div key={ini.id}></div>
            ))}
            <Table
              columns={columns}
              dataSource={filteredIniciativas}
              pagination={false}
            />
          </div>
        );
      })}
    </>
  );
}
