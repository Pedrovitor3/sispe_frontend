import { Modal, Form, Input, Col, message } from 'antd';
import { useEffect } from 'react';
import {
  getResponsavel,
  postResponsavel,
  updateResponsavel,
} from '../../../hooks/services/axios/responsavelService';

type Props = {
  id: string;
  openModal: boolean;
  updateResponsaveisList: any;
  closeModal: (refresh: boolean) => void;
};
// ModalResponsveis
const ModalResponsveis = ({
  id,
  openModal,
  closeModal,
  updateResponsaveisList,
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
  //Listagem, se tiver id set no formulário
  useEffect(() => {
    loadingResponsaveis();
  }, [openModal]);

  async function loadingResponsaveis() {
    if (id) {
      await getResponsavel(`responsavel/${id}`).then(response => {
        if (response !== false) {
          const respData = response.data;
          console.log('respData', respData);
          form.setFieldsValue({
            id: respData.id,
            name: respData.name,
            cargo: respData.cargo,
          });
        } else {
          message.error('Ocorreu um erro inesperado ao obter os responsaveis.');
        }
      });
    }
  }
  // CRIAÇÃO DE deputados
  const submitCreate = async () => {
    const editingGrantor = form.getFieldsValue(true);
    await postResponsavel(editingGrantor);
    updateResponsaveisList(editingGrantor); // Chama a função updateGAuthorList com o novo axle
  };

  //ATUALIZAÇÃO DE eixos************
  const submitUpdate = async () => {
    const editingGrantor = form.getFieldsValue(true);
    await updateResponsavel(editingGrantor, id);
    updateResponsaveisList(editingGrantor); // Chama a função updateGAuthorList com o novo axle
  };

  return (
    <>
      <Modal
        open={openModal}
        title="Responsavel"
        okText="Salvar"
        onCancel={() => {
          form.resetFields();
          closeModal(false);
        }}
        onOk={handleOk}
      >
        <Form layout="vertical" form={form}>
          <Col offset={1} span={22}>
            <Form.Item
              name="name"
              label="Nome"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira um nome',
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
          </Col>
          <Col offset={1} span={22}>
            <Form.Item
              name="cargo"
              label="Cargo"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira um cargo',
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  );
};
export default ModalResponsveis;
