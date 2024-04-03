import { getConfig } from '../../../configs/sistemaConfig';
import { APISISPE } from './baseService/baseService';
import { message } from 'antd';

interface Etapa {
  inputName: any;
}

export async function getEtapa(url: any) {
  try {
    const response = await APISISPE.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os etapa, tente novamente mais tarde.',
      );
    } else {
      console.error(
        `Um erro inesperado aconteceu ao tentar pegar a lista de boletins.${error}`,
      );
    }
  }
  return false;
}

export async function postEtapa(etapa: Etapa) {
  try {
    await APISISPE.post('/etapa', etapa, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updateEtapa = async (etapa: Etapa, id: any) => {
  try {
    await APISISPE.put(`etapa/${id}`, etapa, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os etapa, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the etapa list.${error}`,
    );
  }
};

export async function deleteEtapa(id: any) {
  try {
    await APISISPE.delete(`etapa/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os etapa, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the etapa list .${error}`,
    );
  }
}
