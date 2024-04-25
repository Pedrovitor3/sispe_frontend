import { Col, Form, Input, Modal, message } from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getEstrategia,
  postEstrategia,
  updateEstrategia,
} from '../../../hooks/services/axios/estrategiaService';

type Props = {
  updatedEstrategiaList: any;
  id: string;
  objetivoId: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalEstrategia = ({
  updatedEstrategiaList,
  id,
  objetivoId,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();
  const [estrategia, setEstrategias] = useState<any>([]);

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
            estrategia.length > 0
              ? Math.max(...estrategia.map((p: any) => p.position)) + 1
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
    loadingEstrategia();
    loadingAllEstrategias();
  }, [id && openModal]);

  useEffect(() => {
    form.setFieldsValue({ objetivo: objetivoId });
  }, [objetivoId]);

  const loadingEstrategia = async () => {
    if (id) {
      await getEstrategia(`estrategia/${id}`).then((res: any) => {
        if (res) {
          const estrategia = res.data;
          form.setFieldsValue({
            id: estrategia.id,
            name: estrategia.name,
            position: estrategia.position,
            objetivo: estrategia.objetivo ? estrategia.objetivo.id : null,
          });
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };
  const loadingAllEstrategias = async () => {
    await getEstrategia(`estrategia`).then(res => {
      if (res) {
        const filterObj = res.data.filter((obj: any) => {
          return obj.perspectiva === objetivoId;
        });
        setEstrategias(filterObj);
      } else {
        message.error('Ocorreu um erro inesperado');
      }
    });
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);
    await postEstrategia(editingData);

    updatedEstrategiaList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);

    await updateEstrategia(editingData, id);
    updatedEstrategiaList(editingData);
  };

  return (
    <Modal
      visible={openModal}
      title="Estrategia"
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
        <Form.Item name="objetivo" initialValue={objetivoId} hidden />
      </Form>
    </Modal>
  );
};

export default ModalEstrategia;
