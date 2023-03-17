import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";

export const getAmountOfTokensReceivedFromSwap = async (
  _swapAmoutWei,
  provider,
  ethSelected,
  ethBalance,
  reservedCD
) => {
  const excahangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    provider
  );
  let amountOfTokens;

  if (ethSelected) {
    amountOfTokens = await excahangeContract.getAmountOfTokens(
      _swapAmoutWei,
      ethBalance,
      reservedCD
    );
  } else {
    amountOfTokens = await excahangeContract.getAmountOfTokens(
      _swapAmoutWei,
      reservedCD,
      ethBalance
    );
  }
  return amountOfTokens;
};

export const swapTokens = async (
  signer,
  swapAmoutWei,
  tokenToBeReceivedAfterSwap,
  ethSelected
) => {
  const excahangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
  );
  const tokenContract = new Contract(
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    signer
  );
  let tx;

  if (ethSelected) {
    tx = await excahangeContract.ethToCryptoDevToken(
      tokenToBeReceivedAfterSwap,
      { value: swapAmoutWei }
    );
  } else {
    tx = await tokenContract.approve(
      EXCHANGE_CONTRACT_ADDRESS,
      swapAmoutWei.toString()
    );
    await tx.wait();
    tx = await excahangeContract.cryptoDevTokensToEth(
      swapAmoutWei,
      tokenToBeReceivedAfterSwap
    );
  }
  await tx.wait();
};
