/**
 * Função para gerar um EMV PIX Estático
 * @param {number} txId - Identificador da transação
 * @param {number} valorFatura - Valor da fatura
 * @param {string} chavePix - Chave PIX da empresa
 * @param {string} mensagemPadrao - Mensagem padrão
 * @param {string} nomeRecebedor - Nome do recebedor
 * @param {string} cidade - Cidade do recebedor
 * @returns {string} - EMV PIX gerado
 */
export function gerarEMVPixEstatico(
  txId,
  valorFatura,
  chavePix,
  mensagemPadrao,
  nomeRecebedor,
  cidade
) {
  let emv = '';

  // valor fixo
  emv += "00020126";

  // tamanho de todos campos combinados
  let size =
    26 +
    chavePix.length +
    mensagemPadrao.length;
  emv += size.toString().padStart(2, '0');

  // valor fixo
  emv += "0014br.gov.bcb.pix";

  // chave pix
  emv += "01" + chavePix.length.toString().padStart(2, '0') + chavePix;

  // mensagem padrao
  emv += "02" + mensagemPadrao.length.toString().padStart(2, '0') + mensagemPadrao;

  // valor fixo
  emv += "52040000530398654";

  // valor cobrado
  emv += valorFatura.toString().length.toString().padStart(2, '0') + valorFatura;

  // valor fixo
  emv += "5802BR";

  // nome recebedor
  emv += "59" + nomeRecebedor.length.toString().padStart(2, '0') + nomeRecebedor;

  // cidade
  emv += "60" + cidade.length.toString().padStart(2, '0') + cidade;

  // identificador
  size = 4 + txId.length;

  emv += "62" + size.toString().padStart(2, '0') + "05" + txId.length.toString().padStart(2, '0') + txId;

  // valor fixo
  emv += "6304";

  /***
   * CRC (Cyclic Redundancy Check) é um algoritmo de verificação
   * de integridade de dados amplamente utilizado em comunicações
   * e armazenamento de dados. No contexto do EMV Code (ou EMV QR Code),
   *  o CRC é usado para verificar se o conteúdo do código está livre
   * de erros ou adulterações.
   */
  let CRC = getCheckSum(emv);

  emv += CRC;

  return emv;
}

/**
 * Função para calcular o CRC (Cyclic Redundancy Check)
 * @param {string} strVerify - String para verificação
 * @returns {string} - Valor do CRC calculado
 */
export function getCheckSum(strVerify) {
  let chave63 = 0xFFFF;
  let baseHash = 0x1021;
  let listBytes = Buffer.from(strVerify, 'utf8');

  for (let byteIndex = 0; byteIndex < listBytes.length; byteIndex++) {
    let item = listBytes[byteIndex];

    for (let i = 0; i < 8; i++) {
      let bit = ((item >> (7 - i)) & 1) === 1;
      let c15 = ((chave63 >> 15) & 1) === 1;

      chave63 <<= 1;

      if (c15 ^ bit) {
        chave63 ^= baseHash;
      }
    }
  }

  chave63 &= 0xffff;
  return chave63.toString(16).toUpperCase();
}