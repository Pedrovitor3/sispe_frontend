import { getConfig } from '../../../configs/sistemaConfig';
import { APISISPE } from './baseService/baseService';
import { message } from 'antd';

interface Objetivo {
  inputName: any;
}

export async function getObjetivo(url: any) {
  try {
    const response = await APISISPE.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os objetivo, tente novamente mais tarde.',
      );
    } else {
      console.error(
        `Um erro inesperado aconteceu ao tentar pegar a lista de boletins.${error}`,
      );
    }
  }
  return false;
}

export async function postObjetivo(objetivo: Objetivo) {
  try {
    await APISISPE.post('/objetivo', objetivo, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updateObjetivo = async (objetivo: Objetivo, id: any) => {
  try {
    await APISISPE.put(`objetivo/${id}`, objetivo, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os objetivo, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the objetivo list.${error}`,
    );
  }
};

export async function deleteObjetivo(id: any) {
  try {
    await APISISPE.delete(`objetivo/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os objetivo, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the objetivo list .${error}`,
    );
  }
}
