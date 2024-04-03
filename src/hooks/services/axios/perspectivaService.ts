import { getConfig } from '../../../configs/sistemaConfig';
import { APISISPE } from './baseService/baseService';
import { message } from 'antd';

interface Perspectiva {
  inputName: any;
}

export async function getPerspectiva(url: any) {
  try {
    const response = await APISISPE.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os perspectiva, tente novamente mais tarde.',
      );
    } else {
      console.error(
        `Um erro inesperado aconteceu ao tentar pegar a lista de boletins.${error}`,
      );
    }
  }
  return false;
}

export async function postPerspectiva(perspectiva: Perspectiva) {
  try {
    await APISISPE.post('/perspectiva', perspectiva, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updatePerspectiva = async (perspectiva: Perspectiva, id: any) => {
  try {
    await APISISPE.put(`perspectiva/${id}`, perspectiva, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os perspectiva, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the perspectiva list.${error}`,
    );
  }
};

export async function deletePerspectiva(id: any) {
  try {
    await APISISPE.delete(`perspectiva/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os perspectiva, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the perspectiva list .${error}`,
    );
  }
}
