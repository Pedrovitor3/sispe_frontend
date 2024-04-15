import { Col, Form, Input, Modal, message } from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getMeta,
  postMeta,
  updateMeta,
} from '../../../hooks/services/axios/metaService';

type Props = {
  updatedMetaList: any;
  id: string;
  iniciativaId: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalMeta = ({
  updatedMetaList,
  id,
  iniciativaId,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();

  console.log('estrategias Id', iniciativaId);

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
  }, [id && openModal]);

  useEffect(() => {
    form.setFieldsValue({ iniciativa: iniciativaId });
  }, [iniciativaId]);

  const loadingMeta = async () => {
    if (id) {
      await getMeta(`meta/${id}`).then((res: any) => {
        if (res) {
          const meta = res.data;
          form.setFieldsValue({
            id: meta.id,
            name: meta.name,
            iniciativa: meta.iniciativa ? meta.iniciativa.id : null,
          });
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);
    console.log('iniciativas', editingData);
    await postMeta(editingData);

    updatedMetaList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);

    await updateMeta(editingData, id);
    updatedMetaList(editingData);
  };

  return (
    <Modal
      visible={openModal}
      title="Iniciativa"
      okText="Salvar"
      onCancel={() => {
        form.resetFields();
        closeModal(true);
      }}
      onOk={handleOk}
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

export default ModalMeta;
