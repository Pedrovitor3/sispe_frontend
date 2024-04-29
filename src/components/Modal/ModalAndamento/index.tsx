import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getAndamento,
  postAndamento,
  updateAndamento,
} from '../../../hooks/services/axios/andamentoService';

type Props = {
  updatedAndamentoList: any;
  id: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalAndamento = ({
  id,
  updatedAndamentoList,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();

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
  }, [openModal]);

  const loadingMeta = async () => {
    if (id) {
      await getAndamento(`andamento/${id}`).then((res: any) => {
        if (res) {
          const etapa = res.data;
          form.setFieldsValue({
            id: etapa.id,
            name: etapa.name,
          });
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);
    await postAndamento(editingData);
    updatedAndamentoList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);

    await updateAndamento(editingData, id);
    updatedAndamentoList(editingData);
  };

  return (
    <Modal
      visible={openModal}
      title="Andamento"
      okText="Salvar"
      onCancel={() => {
        form.resetFields();
        closeModal(true);
      }}
      onOk={handleOk}
      width={600}
    >
      <Form layout="vertical" form={form}>
        <Col offset={1} span={20}>
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
      </Form>
    </Modal>
  );
};

export default ModalAndamento;
