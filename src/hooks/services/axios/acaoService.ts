import { getConfig } from '../../../configs/sistemaConfig';
import { APISISPE } from './baseService/baseService';
import { message } from 'antd';

interface Acao {
  inputName: any;
}

export async function getAcao(url: any) {
  try {
    const response = await APISISPE.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os acao, tente novamente mais tarde.',
      );
    } else {
      console.error(
        `Um erro inesperado aconteceu ao tentar pegar a lista de boletins.${error}`,
      );
    }
  }
  return false;
}

export async function postAcao(acao: Acao) {
  try {
    await APISISPE.post('/acao', acao, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updateAcao = async (acao: Acao, id: any) => {
  try {
    await APISISPE.put(`acao/${id}`, acao, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os acao, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the acao list.${error}`,
    );
  }
};

export async function deleteAcao(id: any) {
  try {
    await APISISPE.delete(`acao/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os acao, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the acao list .${error}`,
    );
  }
}
