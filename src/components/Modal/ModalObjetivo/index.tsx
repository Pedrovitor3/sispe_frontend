import { Col, Form, Input, Modal, message } from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getObjetivo,
  postObjetivo,
  updateObjetivo,
} from '../../../hooks/services/axios/objetivoService';

type Props = {
  updatedObjetivoList: any;
  id: string;
  perspectivaId: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalObjetivo = ({
  updatedObjetivoList,
  id,
  perspectivaId,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();
  const [objetivo, setObjetivos] = useState<any>([]);

  console.log('pers Id', perspectivaId);

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
            objetivo.length > 0
              ? Math.max(...objetivo.map((p: any) => p.position)) + 1
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
    loadingObjetivo();
    loadingAllObjetivos();
  }, [id && openModal]);

  useEffect(() => {
    form.setFieldsValue({ perspectiva: perspectivaId });
  }, [perspectivaId]);

  const loadingObjetivo = async () => {
    if (id) {
      await getObjetivo(`objetivo/${id}`).then((res: any) => {
        if (res) {
          const objetivo = res.data;
          form.setFieldsValue({
            id: objetivo.id,
            name: objetivo.name,
            position: objetivo.position,
            perspectiva: objetivo.perspectiva ? objetivo.perspectiva.id : null,
          });
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };
  const loadingAllObjetivos = async () => {
    await getObjetivo(`objetivo`).then(res => {
      if (res) {
        const filterObj = res.data.filter((obj: any) => {
          return obj.perspectiva === perspectivaId;
        });
        setObjetivos(filterObj);
      } else {
        message.error('Ocorreu um erro inesperado');
      }
    });
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);
    console.log('objetivo', editingData);
    await postObjetivo(editingData);

    updatedObjetivoList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);

    await updateObjetivo(editingData, id);
    updatedObjetivoList(editingData);
  };

  return (
    <Modal
      visible={openModal}
      title="Objetivo"
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

export default ModalObjetivo;
