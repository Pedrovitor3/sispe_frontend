import { getConfig } from '../../../configs/sistemaConfig';
import { APISISPE } from './baseService/baseService';
import { message } from 'antd';

interface Meta {
  inputName: any;
}

export async function getMeta(url: any) {
  try {
    const response = await APISISPE.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os meta, tente novamente mais tarde.',
      );
    } else {
      console.error(
        `Um erro inesperado aconteceu ao tentar pegar a lista de boletins.${error}`,
      );
    }
  }
  return false;
}

export async function postMeta(meta: Meta) {
  try {
    await APISISPE.post('/meta', meta, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updateMeta = async (meta: Meta, id: any) => {
  try {
    await APISISPE.put(`meta/${id}`, meta, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os meta, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the meta list.${error}`,
    );
  }
};

export async function deleteMeta(id: any) {
  try {
    await APISISPE.delete(`meta/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os meta, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the meta list .${error}`,
    );
  }
}
