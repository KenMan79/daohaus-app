import { utils } from 'web3';
import { createContract } from './contract';
import { LOCAL_ABI } from './abi';

export const initMemberWallet = async ({
  memberAddress,
  daoAddress,
  chainID,
  depositToken,
}) => {
  // TODO handle tokens with different decimals

  const tokenContract = createContract({
    address: depositToken.tokenAddress,
    abi: LOCAL_ABI.ERC_20,
    chainID,
  });

  const tokenBalance = utils.fromWei(
    await tokenContract.methods.balanceOf(memberAddress).call(),
  );

  const allowance = utils.fromWei(
    await tokenContract.methods.allowance(memberAddress, daoAddress).call(),
  );

  return {
    depositTokenBalance: tokenBalance,
    allowance,
  };
};
