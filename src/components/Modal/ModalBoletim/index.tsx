import { Modal, Form, Input, Col, message, Row } from 'antd';
import { useEffect } from 'react';

import ReactInputMask from 'react-input-mask';
import moment from 'moment';

require('../index.css');

type Props = {
  updateBoletimList: any;
  id: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalBoletim = ({
  updateBoletimList,
  id,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();

  const handleOk = (e: any) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        if (id) {
          submitUpdate();
        } else {
          submitCreate();
        }
        form.resetFields();
        closeModal(true);
      })
      .catch(errorInfo => message.error('Erro no preenchimento dos campos.'));
  };

  const submitUpdate = async () => {
    const editingBoletim = form.getFieldsValue(true);
    ///await updateBoletim(editingBoletim, id);
    updateBoletimList(editingBoletim);
  };

  const submitCreate = async () => {
    const editingBoletim = form.getFieldsValue(true);
    // await postBoletim(editingBoletim);
    updateBoletimList(editingBoletim); // Chama a função updateAxleList com o novo axle
  };

  const isDateValid = (value: any) => {
    return moment(value, 'DD/MM/YYYY', true).isValid();
  };

  return (
    <>
      <Modal
        visible={openModal}
        title="Boletim Geral"
        okText="Salvar"
        onCancel={() => {
          form.resetFields();
          closeModal(false);
        }}
        onOk={handleOk}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Col offset={2} span={20}>
            <Form.Item
              style={{ marginTop: '20px' }}
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
          <Col offset={2} span={20}>
            <Form.Item
              name="description"
              label="Descrição"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira a descrição',
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 6 }}
                style={{ height: '70px' }}
              />
            </Form.Item>
          </Col>
        </Form>
        <Form layout="vertical" form={form}>
          <Row gutter={15} style={{ height: '120px' }}>
            <Col offset={2} span={8}>
              <Form.Item
                name="numero"
                label="Número do boletim"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira o numero',
                  },
                ]}
              >
                <Input className="numBoletim" />
              </Form.Item>
            </Col>
            <Col offset={4} span={8}>
              <Form.Item
                name={['data']}
                label="Data do boletim"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira a data',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || isDateValid(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        'Por favor, insira uma data válida',
                      );
                    },
                  }),
                ]}
              >
                <ReactInputMask
                  className="input-mask-date"
                  placeholder="00/00/0000"
                  maskChar={null}
                  mask="99/99/9999"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalBoletim;
