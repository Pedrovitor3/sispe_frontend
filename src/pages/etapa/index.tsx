import React from 'react';
import {
  Button,
  Card,
  Col,
  Dropdown,
  List,
  Popconfirm,
  Row,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';
import { deleteEtapa, getEtapa } from '../../hooks/services/axios/etapaService';
import ModalEtapa from '../../components/Modal/ModalEtapa';
import { DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ModalAndamento from '../../components/Modal/ModalAndamento';
import {
  deleteAndamento,
  getAndamento,
} from '../../hooks/services/axios/andamentoService';
import AndamentoList from '../../components/Kanbam';
import KanbamList from '../../components/Kanbam';

type Props = {
  setChave: (id: string) => void;
  acaoId: any;
};

type EtapaData = {
  id: string;
  name: string;
  percentualConclusao: string;
  andamento: any;
  acao: any;
};

export default function Etapa({ setChave, acaoId }: Props) {
  const [etapas, setEtapa] = useState<EtapaData[]>([]);
  const [recordEtapa, setRecordEtapa] = useState<any>({});
  const [showEtapaModal, setShowEtapaModal] = useState<boolean>(false);

  const [andamentos, setAndamento] = useState<any[]>([]);

  useEffect(() => {
    loadingEtapa();
    loadingAndamento();
  }, [acaoId]);

  const handleVoltarPage = () => {
    setChave('3');
  };

  const hideModal = () => {
    setShowEtapaModal(false);

    setRecordEtapa(null);
  };

  const handleOpenEtapaModal = () => {
    setShowEtapaModal(true);
  };

  const updateEtapa = (etapa: any) => {
    setEtapa(prevEtapa => [...prevEtapa, etapa]);
    loadingEtapa();
  };

  const updatedData = () => {
    loadingAndamento();
    loadingEtapa();
  };

  const loadingEtapa = async () => {
    const res = await getEtapa('etapa');
    if (res) {
      const filteredEtapa = res.data.filter((et: any) => {
        return et.acao && et.acao.id === acaoId;
      });
      setEtapa(filteredEtapa);
    }
  };

  const loadingAndamento = async () => {
    const res = await getAndamento('andamento');
    if (res) {
      setAndamento(res.data);
    }
  };

  const handleMenuClickEtapa = (e: any) => {
    if (e.key === '1') {
      setShowEtapaModal(true);
    }
  };

  const clickDeleteEtapa = async (etapa: any) => {
    const etapaId = etapa?.id;
    await deleteEtapa(etapaId);
    const newData = [...etapas];
    newData.splice(etapaId, -1);
    setEtapa(newData);
    loadingEtapa();
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
              <EditOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };

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
        onClick={handleOpenEtapaModal}
      >
        Nova Etapa
      </Button>

      <KanbamList
        andamentos={andamentos}
        etapas={etapas}
        data="etapa"
        updatedData={updatedData}
      />

      <ModalEtapa
        updatedEtapaList={updateEtapa}
        id={recordEtapa?.id}
        openModal={showEtapaModal}
        closeModal={hideModal}
        acaoId={acaoId}
      />
    </>
  );
}
