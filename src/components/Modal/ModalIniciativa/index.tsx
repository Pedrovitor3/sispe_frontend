import { Col, Form, Input, Modal, Row, message } from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getIniciativa,
  postIniciativa,
  updateIniciativa,
} from '../../../hooks/services/axios/iniciativaService';
import PercentageInput from '../../Input/InputPorcentage';
import { set } from 'lodash';

type Props = {
  updatedIniciativaList: any;
  id: string;
  estrategiaId: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalIniciativa = ({
  updatedIniciativaList,
  id,
  estrategiaId,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();
  const [iniciativas, setIniciativas] = useState<any>([]);
  const [porcentagem, setPorcentagem] = useState<any>(0);

  console.log('estrategias Id', estrategiaId);

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
            iniciativas.length > 0
              ? Math.max(...iniciativas.map((p: any) => p.item)) + 1
              : 1;
          formData.item = newPosition;
          submitCreate();
        }
        form.resetFields();
        closeModal(true);
      })
      .catch(errorInfo => message.error('Erro no preenchimento dos campos'));
  };

  useEffect(() => {
    loadingIniciativa();
    loadingAllIniciativas();
  }, [id && openModal]);

  useEffect(() => {
    form.setFieldsValue({ estrategia: estrategiaId });
  }, [estrategiaId]);

  const loadingIniciativa = async () => {
    if (id) {
      await getIniciativa(`iniciativa/${id}`).then((res: any) => {
        if (res) {
          const iniciativa = res.data;
          form.setFieldsValue({
            id: iniciativa.id,
            name: iniciativa.name,
            item: iniciativa.item,
            status: iniciativa.status,
            percentualExecutado: iniciativa.percentualExecutado,
            objetivo: iniciativas.objetivo ? iniciativas.objetivo.id : null,
          });
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };
  const loadingAllIniciativas = async () => {
    await getIniciativa(`iniciativa`).then(res => {
      if (res) {
        const filterObj = res.data.filter((obj: any) => {
          return obj.perspectiva === estrategiaId;
        });
        setIniciativas(filterObj);
      } else {
        message.error('Ocorreu um erro inesperado');
      }
    });
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);
    console.log('iniciativas', editingData);
    await postIniciativa(editingData);

    updatedIniciativaList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);

    await updateIniciativa(editingData, id);
    updatedIniciativaList(editingData);
  };

  const handleSetPorcentagem = (value: string) => {
    if (value) {
      setPorcentagem(value);

      form.setFieldsValue({ percentualExecutado: value });
    }
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
        <Row>
          <Col offset={1} span={10}>
            <Form.Item name="status" label="Status">
              <Input />
            </Form.Item>
          </Col>
          <Col offset={2} span={8}>
            <Form.Item
              name="percentualExecutado"
              label="Percentual Executado"
              initialValue={0}
            >
              <PercentageInput />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalIniciativa;
