import React, { useState } from 'react';
import { Button, Flex, Icon, Spinner, Tooltip } from '@chakra-ui/react';

import { useDao, useTxProcessor, useUser } from '../../contexts/PokemolContext';
import { RiQuestionLine } from 'react-icons/ri';

const SyncToken = ({ tokenBalance, setOptimisticSync }) => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();

  const txCallBack = (txHash, details) => {
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false, false);
      txProcessor.forceCheckTx = true;
      updateTxProcessor({ ...txProcessor });
      setLoading(false);
      setOptimisticSync(true);
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);

    try {
      dao.daoService.moloch.collectTokens(
        tokenBalance.token.tokenAddress,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Flex>
          <Button onClick={handleSync}>Sync Token Balance</Button>
          <Tooltip
            hasArrow
            shouldWrapChildren
            placement='bottom'
            label='Looks like some funds were sent directly to the DAO. Sync to update
            the balance.'
          >
            <Icon as={RiQuestionLine} />
          </Tooltip>
        </Flex>
      )}
    </>
  );
};

export default SyncToken;
