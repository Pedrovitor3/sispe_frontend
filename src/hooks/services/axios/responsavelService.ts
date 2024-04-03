import { getConfig } from '../../../configs/sistemaConfig';
import { APISISPE } from './baseService/baseService';
import { message } from 'antd';

interface Responsavel {
  inputName: any;
}

export async function getResponsavel(url: any) {
  try {
    const response = await APISISPE.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os responsavel, tente novamente mais tarde.',
      );
    } else {
      console.error(
        `Um erro inesperado aconteceu ao tentar pegar a lista de boletins.${error}`,
      );
    }
  }
  return false;
}

export async function postResponsavel(responsavel: Responsavel) {
  try {
    await APISISPE.post('/responsavel', responsavel, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updateResponsavel = async (responsavel: Responsavel, id: any) => {
  try {
    await APISISPE.put(`responsavel/${id}`, responsavel, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os responsavel, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the responsavel list.${error}`,
    );
  }
};

export async function deleteResponsavel(id: any) {
  try {
    await APISISPE.delete(`responsavel/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os responsavel, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the responsavel list .${error}`,
    );
  }
}
