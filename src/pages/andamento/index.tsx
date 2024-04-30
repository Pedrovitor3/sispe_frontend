import React from 'react';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { getEtapa } from '../../hooks/services/axios/etapaService';
import ModalAndamento from '../../components/Modal/ModalAndamento';
import {
  deleteAndamento,
  getAndamento,
} from '../../hooks/services/axios/andamentoService';
import KanbamList from '../../components/Kanbam';
import '../index.css';

type EtapaData = {
  id: string;
  name: string;
  percentualConclusao: string;
  andamento: any;
  acao: any;
};

export default function Andamento() {
  const [etapas, setEtapa] = useState<EtapaData[]>([]);
  const [andamentos, setAndamento] = useState<any[]>([]);
  const [showAndamentoModal, setShowAndamentoModal] = useState<boolean>(false);
  const [recordAndamento, setRecordAndamento] = useState<any>([]);

  useEffect(() => {
    loadingEtapa();
    loadingAndamento();
  }, []);

  const hideModal = () => {
    setShowAndamentoModal(false);

    setRecordAndamento(null);
  };

  const handleOpenAndamentoModal = () => {
    setShowAndamentoModal(true);
  };

  const updateAndamento = (andamento: any) => {
    setEtapa(prevAndamento => [...prevAndamento, andamento]);
    loadingAndamento();
  };

  const updatedData = () => {
    loadingAndamento();
    loadingEtapa();
  };

  const loadingEtapa = async () => {
    const res = await getEtapa('etapa');
    if (res) {
      setEtapa(res.data);
    }
  };

  const loadingAndamento = async () => {
    const res = await getAndamento('andamento');
    if (res) {
      setAndamento(res.data);
    }
  };

  const handleMenuClickAndamento = (e: any) => {
    if (e.key === '1') {
      setShowAndamentoModal(true);
    }
  };

  const clickDeleteAndamento = async (andamento: any) => {
    const andamentoId = andamento?.id;
    await deleteAndamento(andamentoId);
    const newData = [...andamentos];
    newData.splice(andamentoId, -1);
    setAndamento(newData);
    loadingAndamento();
  };

  return (
    <>
      <Button
        className="button-criar"
        type="primary"
        onClick={handleOpenAndamentoModal}
      >
        Novo Andamento
      </Button>
      <KanbamList
        andamentos={andamentos}
        etapas={etapas}
        data="andamento"
        updatedData={updatedData}
      />

      <ModalAndamento
        updatedAndamentoList={updateAndamento}
        id={recordAndamento?.id}
        openModal={showAndamentoModal}
        closeModal={hideModal}
      />
    </>
  );
}
