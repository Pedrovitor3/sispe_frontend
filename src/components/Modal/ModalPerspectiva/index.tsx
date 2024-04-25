import { Col, Form, Input, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  getPerspectiva,
  postPerspectiva,
  updatePerspectiva,
} from '../../../hooks/services/axios/perspectivaService';

import '../index.css';

type Props = {
  updatedPerspectivaList: any;
  id: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalPerspectiva = ({
  updatedPerspectivaList,
  id,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();

  const [perspectivas, setPerspectivas] = useState<any>([]);

  const handleOk = (e: any) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue(true);
        if (id) {
          submitUpdate();
        } else {
          const newPosition =
            perspectivas.length > 0
              ? Math.max(...perspectivas.map((p: any) => p.position)) + 1
              : 1;
          formData.position = newPosition;
          submitCreate();
        }
        form.resetFields();
        closeModal(true);
      })
      .catch(errorInfo => message.error('Erro no preenchimento dos campos'));
  };

  useEffect(() => {
    loadingPerspectiva();
    loadingAllPerspectivas();
  }, [id]);

  const loadingPerspectiva = async () => {
    if (id) {
      await getPerspectiva(`perspectiva/${id}`).then(res => {
        if (res) {
          const perspectiva = res.data;
          form.setFieldsValue({
            id: perspectiva.id,
            name: perspectiva.name,
            position: perspectiva.position,
          });
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };
  const loadingAllPerspectivas = async () => {
    await getPerspectiva(`perspectiva`).then(res => {
      if (res) {
        setPerspectivas(res.data);
      } else {
        message.error('Ocorreu um erro inesperado');
      }
    });
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);
    await postPerspectiva(editingData);

    updatedPerspectivaList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);
    if (id) {
      await updatePerspectiva(editingData, id);
      updatedPerspectivaList(editingData);
    }
  };

  return (
    <Modal
      visible={openModal}
      title="Perspectiva"
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

export default ModalPerspectiva;
