import { getConfig } from '../../../configs/sistemaConfig';
import { APISISPE } from './baseService/baseService';
import { message } from 'antd';

interface Estrategia {
  inputName: any;
}

export async function getEstrategia(url: any) {
  try {
    const response = await APISISPE.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os estrategia, tente novamente mais tarde.',
      );
    } else {
      console.error(
        `Um erro inesperado aconteceu ao tentar pegar a lista de boletins.${error}`,
      );
    }
  }
  return false;
}

export async function postEstrategia(estrategia: Estrategia) {
  try {
    await APISISPE.post('/estrategia', estrategia, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updateEstrategia = async (estrategia: Estrategia, id: any) => {
  try {
    await APISISPE.put(`estrategia/${id}`, estrategia, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os estrategia, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the estrategia list.${error}`,
    );
  }
};

export async function deleteEstrategia(id: any) {
  try {
    await APISISPE.delete(`estrategia/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os estrategia, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the estrategia list .${error}`,
    );
  }
}
