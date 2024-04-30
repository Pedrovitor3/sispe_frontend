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
