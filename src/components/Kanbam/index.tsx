// AndamentoList.js
import { Dropdown, Popconfirm, Space } from 'antd';
import './index.css';
import { deleteEtapa } from '../../hooks/services/axios/etapaService';
import { useState } from 'react';
import { DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ModalEtapa from '../Modal/ModalEtapa';
import { deleteAndamento } from '../../hooks/services/axios/andamentoService';
import ModalAndamento from '../Modal/ModalAndamento';

type Props = {
  andamentos: any;
  etapas: any;
  data: string;
  updatedData: any;
};

type EtapaData = {
  id: string;
  name: string;
  percentualConclusao: string;
  andamento: any;
  acao: any;
};

type AndamentoData = {
  id: string;
  name: string;
};

const KanbamList = ({ andamentos, etapas, data, updatedData }: Props) => {
  const [recordEtapa, setRecordEtapa] = useState<any>({});
  const [showEtapaModal, setShowEtapaModal] = useState<boolean>(false);

  const [recordAndamento, setRecordAndamento] = useState<any>({});
  const [showAndamentoModal, setShowAndamentoModal] = useState<boolean>(false);

  const clickDeleteEtapa = async (etapa: any) => {
    const etapaId = etapa?.id;
    await deleteEtapa(etapaId);
    {
      /*
      const newData = [...etapas];
      newData.splice(etapaId, -1);
      setEtapa(newData);
      */
    }
    // loadingEtapa();
  };

  const clickDeleteAndamento = async (andamento: any) => {
    const andamentoId = andamento?.id;
    await deleteAndamento(andamentoId);

    updatedData();
  };

  const hideModal = () => {
    setShowEtapaModal(false);
    setShowAndamentoModal(false);

    setRecordEtapa(null);
    setRecordAndamento(null);
  };

  const updateEtapa = (etapa: any) => {
    updatedData();
  };

  const handleMenuClickEtapa = (e: any) => {
    if (e.key === '1') {
      setShowEtapaModal(true);
    }
  };

  const handleMenuClickAndamento = (e: any) => {
    if (e.key === '1') {
      setShowAndamentoModal(true);
    }
  };

  const renderMenuEtapa = (record: EtapaData) => {
    return (
      <Space size="middle">
        <Dropdown
          menu={{
            items: [
              {
                label: 'Alterar',
                key: '1',
                onClick: () => {
                  setRecordEtapa(record);
                },
              },
              {
                label: (
                  <Popconfirm
                    title="Tem certeza de que deseja desabilitar este registro?"
                    onConfirm={() => clickDeleteEtapa(record)}
                  >
                    Excluir
                  </Popconfirm>
                ),
                key: '2',
                danger: true,
              },
              {
                label: (
                  <Space style={{ color: ' rgb(0, 21, 42)' }}>
                    <PlusOutlined style={{ color: 'rgb(0, 21, 42)' }} />
                    Objetivo
                  </Space>
                ),
                key: '3',
                onClick: () => {
                  setRecordEtapa(record);
                },
              },
            ],
            onClick: handleMenuClickEtapa,
          }}
        >
          <a onClick={e => e.preventDefault()} className="option">
            <Space>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };

  const renderMenuAndamento = (record: AndamentoData) => {
    return (
      <Space size="middle">
        <Dropdown
          menu={{
            items: [
              {
                label: 'Alterar',
                key: '1',
                onClick: () => {
                  setRecordAndamento(record);
                },
              },
              {
                label: (
                  <Popconfirm
                    title="Tem certeza de que deseja desabilitar este registro?"
                    onConfirm={() => clickDeleteAndamento(record)}
                  >
                    Excluir
                  </Popconfirm>
                ),
                key: '2',
                danger: true,
              },
              {
                label: (
                  <Space style={{ color: ' rgb(0, 21, 42)' }}>
                    <PlusOutlined style={{ color: 'rgb(0, 21, 42)' }} />
                    Objetivo
                  </Space>
                ),
                key: '3',
                onClick: () => {
                  setRecordAndamento(record);
                },
              },
            ],
            onClick: handleMenuClickAndamento,
          }}
        >
          <a onClick={e => e.preventDefault()} className="option">
            <Space>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };

  return (
    <>
      <div className="body-kanbam">
        {andamentos.length > 0 ? (
          andamentos.map((andamento: any) => (
            <div className="andamento-container" key={andamento.id}>
              <div className="andamento-header">
                <p className="andamento-title">
                  {data === 'andamento' && (
                    <span className="icon-wrapper-andamento">
                      {renderMenuAndamento(andamento)}
                    </span>
                  )}
                  {andamento.name}
                </p>
              </div>
              <div>
                {etapas
                  .filter((etapa: any) => etapa.andamento?.id === andamento.id)
                  .map((etapa: any) => (
                    <div className="card-etapa" key={etapa.id}>
                      <Space>
                        <p className="card-title">
                          {data === 'etapa' && (
                            <span className="icon-wrapper-etapa">
                              {renderMenuEtapa(etapa)}
                            </span>
                          )}

                          {etapa.name}
                        </p>
                      </Space>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div>Você não tem nenhum andamento, comece a criar</div>
        )}
      </div>
      <ModalAndamento
        updatedAndamentoList={updateEtapa}
        id={recordAndamento?.id}
        openModal={showAndamentoModal}
        closeModal={hideModal}
      />
      <ModalEtapa
        updatedEtapaList={updateEtapa}
        id={recordEtapa?.id}
        acaoId={''}
        openModal={showEtapaModal}
        closeModal={hideModal}
      />
    </>
  );
};

export default KanbamList;
