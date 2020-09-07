import dotenv from 'dotenv';
import { Api, JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

global.fetch = fetch;
dotenv.config();

const EOS_ACCOUNT_NAME = process.env.EOS_ACCOUNT_NAME;
const EOS_PRIVATE_KEY = process.env.EOS_PRIVATE_KEY;

const privateKeys = [EOS_PRIVATE_KEY];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('https://eos.greymass.com/');
const api = new Api({ rpc, signatureProvider });

const claimTokenAction = {
  account: 'mine1.defi',
  name: 'claim',
  authorization: [
    {
      actor: EOS_ACCOUNT_NAME,
      permission: 'active',
    },
  ],
  data: {
    owner: EOS_ACCOUNT_NAME,
  },
};
// 约等于
// 1365000 = 0.65 *21.07 * 10000 * 0.997
const swapTokenAction = {
  account: 'token.defi',
  name: 'transfer',
  authorization: [
    {
      actor: EOS_ACCOUNT_NAME,
      permission: 'active',
    },
  ],
  data: {
    from: EOS_ACCOUNT_NAME,
    to: 'swap.defi',
    memo: 'swap,136000,194-12',
    quantity: '0.650000 BOX',
  },
};
async function main() {
  try {
    const res = await api.transact(
      {
        actions: [claimTokenAction, swapTokenAction],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );
    console.log(JSON.stringify(res));
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}

main();
