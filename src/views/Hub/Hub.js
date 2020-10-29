import React, { useState } from 'react';
import { Box, Text, Grid } from '@chakra-ui/core';

import { useUser, useTheme } from '../../contexts/PokemolContext';
import { HUB_MEMBERSHIPS } from '../../utils/apollo/hub-queries';
import GraphFetch from '../../components/Shared/GraphFetch';
import MemberDaoList from '../../components/Hub/MemberDaoList';
import HubSignedOut from '../../components/Hub/HubSignedOut';
import HubProfileCard from '../../components/Hub/HubProfileCard';
import HubActivityFeed from '../../components/Hub/HubActivityFeed';

const Hub = () => {
  const [user] = useUser();
  const [theme] = useTheme();
  const [memberDaos, setMemberDaos] = useState();

  return (
    <Box>
      {user ? (
        <>
          <Grid gap={6} templateColumns='repeat(2, 1fr)'>
            <Box>
              <HubProfileCard />
              <Box
                rounded='lg'
                bg='blackAlpha.600'
                borderWidth='1px'
                borderColor='whiteAlpha.200'
                p={6}
                m={6}
                w='100%'
              >
                {memberDaos ? (
                  <MemberDaoList
                    daos={memberDaos.members.map((member) => member.moloch)}
                  />
                ) : null}
              </Box>
            </Box>

            <Box>
              <Text
                fontSize='md'
                ml={6}
                fontFamily={theme.fonts.heading}
                textTransform='uppercase'
                fontWeight={700}
              >
                Recent Activity
              </Text>
              {memberDaos ? (
                <HubActivityFeed
                  daos={memberDaos.members.map((member) => member.moloch)}
                />
              ) : null}
            </Box>
          </Grid>

          <GraphFetch
            query={HUB_MEMBERSHIPS}
            setRecords={setMemberDaos}
            entity='members'
            variables={{ memberAddress: user.username }}
          />
        </>
      ) : (
        <HubSignedOut />
      )}
    </Box>
  );
};

export default Hub;
