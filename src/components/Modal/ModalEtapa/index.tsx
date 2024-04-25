import { Button, Col, Form, Input, Modal, Row, Select, message } from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getEtapa,
  postEtapa,
  updateEtapa,
} from '../../../hooks/services/axios/etapaService';
import PercentageInput from '../../Input/InputPorcentage';
import ModalAndamento from '../ModalAndamento';
import { PlusOutlined } from '@ant-design/icons';
import { getAndamento } from '../../../hooks/services/axios/andamentoService';

type Props = {
  updatedEtapaList: any;
  id: string;
  acaoId: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalEtapa = ({
  updatedEtapaList,
  id,
  acaoId,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();

  const [andamentos, setAndamentos] = useState<any[]>([]);
  const [selectAndamentoId, setSelectedAndamentoId] = useState<string>('');
  const [showAndamentoModal, setShowAndamentoModal] = useState<boolean>(false);
  const [recordAndamento, setRecordAndamento] = useState<any>([]);

  const handleOk = (e: any) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue(true);
        if (id) {
          submitUpdate();
        } else {
          submitCreate();
        }
        form.resetFields();
        closeModal(true);
      })
      .catch(errorInfo => message.error('Erro no preenchimento dos campos'));
  };

  useEffect(() => {
    loadingMeta();
    loadingAndamento();
  }, [id && openModal]);

  const loadingMeta = async () => {
    if (id) {
      await getEtapa(`etapa/${id}`).then((res: any) => {
        if (res) {
          const etapa = res.data;
          form.setFieldsValue({
            id: etapa.id,
            name: etapa.name,
            percentualConclusao: etapa.percentualConclusao,
            andamento: etapa.andamento ? etapa.andamento.id : null,

            acao: etapa.acao ? etapa.acao.id : null,
          });

          setSelectedAndamentoId(etapa.anadamento?.id);
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };

  const loadingAndamento = async () => {
    await getAndamento('andamento').then((res: any) => {
      if (res) {
        setAndamentos(res.data);
      }
    });
  };

  const hideModal = () => {
    setShowAndamentoModal(false);

    setRecordAndamento(null);
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);
    await postEtapa(editingData);

    updatedEtapaList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);

    await updateEtapa(editingData, id);
    updatedEtapaList(editingData);
  };

  const handleSelectAndamento = (value: any) => {
    setSelectedAndamentoId(value);
  };

  const updateAndamento = (andamento: any) => {
    setAndamentos(prevAndamento => [...prevAndamento, andamento]);
    loadingAndamento();
  };

  return (
    <>
      <Modal
        visible={openModal}
        title="Etapa"
        okText="Salvar"
        onCancel={() => {
          form.resetFields();
          closeModal(true);
        }}
        onOk={handleOk}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Row>
            <Col offset={1} span={12}>
              <Form.Item
                name="name"
                label="Nome"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira o nome',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col offset={1} span={7}>
              <Form.Item
                name="percentualConclusao"
                label="Percentual de conclusão"
              >
                <PercentageInput />
              </Form.Item>
              <Form.Item name="acao" initialValue={acaoId} hidden />
            </Col>
          </Row>

          <Row gutter={10}>
            <Col offset={1} span={16}>
              <Form.Item name="andamento" label="Andamento">
                <Select
                  showSearch
                  placeholder={'Selecione Andamento'}
                  value={selectAndamentoId}
                  onChange={value => handleSelectAndamento(value)}
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={andamentos.map(resp => ({
                    label: resp.name,
                    value: resp.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button
                style={{
                  marginTop: '29px',
                }}
                onClick={() => {
                  setShowAndamentoModal(true);
                }}
                title="Adicionar Responsável" // Adicione o tooltip aqui
              >
                <PlusOutlined />
                Novo
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <ModalAndamento
        updatedAndamentoList={updateAndamento}
        id={recordAndamento?.id}
        openModal={showAndamentoModal}
        closeModal={hideModal}
      />
    </>
  );
};

export default ModalEtapa;
