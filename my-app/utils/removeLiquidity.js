import { Contract, providers, utils, BigNumber } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from "../constants";

export const removeLiquidity = async (signer, removeLPTokensWei) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      signer
    );
    const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
    await tx.wait();
  } catch (error) {
    console.error(error);
  }
};

export const getTokensAfterRemove = async (
  provider,
  removeLPTokensWei,
  _ethBalance,
  cryptoDevTokenReserve
) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
    const _totalSupply = await exchangeContract.totalSupply();

    const _removeEther = _ethBalance.mul(removeLPTokensWei).div(_totalSupply);
    const _removeCD = cryptoDevTokenReserve
      .mul(removeLPTokensWei)
      .div(_totalSupply);
    return {
      _removeEther,
      _removeCD,
    };
  } catch (error) {
    console.error(error);
  }
};
