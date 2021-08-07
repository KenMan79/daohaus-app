import Icon from '@chakra-ui/icon';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { Spinner } from '@chakra-ui/spinner';
import React, { useMemo, useState } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { Button } from '@chakra-ui/button';
import { Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/tabs';
import List from '../components/list';
import ListItem from '../components/listItem';
import ListSelector from '../components/ListSelector';

import ListSelectorItem from '../components/ListSelectorItem';
import MainViewLayout from '../components/mainViewLayout';
import PlaylistSelector from '../components/playlistSelector';
import SaveButton from '../components/saveButton';
import TextBox from '../components/TextBox';
import { useMetaData } from '../contexts/MetaDataContext';
import { isLastItem } from '../utils/general';
import { titleMaker } from '../utils/proposalUtils';
import { BOOSTS, allBoosts, categories } from '../data/boosts';

const MarketPlaceV0 = () => {
  // const { injectedProvider, address, injectedChain } = useInjectedProvider();
  // const { openFormModal, closeModal } = useFormModal();
  // const { successToast, errorToast } = useOverlay();

  return (
    <MainViewLayout isDao header='Boosts'>
      <Tabs isLazy>
        <TabList borderBottom='none' mb={6}>
          <Tab
            px={6}
            color='white'
            _selected={{
              color: 'white',
              borderBottom: '2px solid white',
            }}
            _hover={{
              color: 'white',
              borderBottom: '2px solid rgba(255,255,255,0.3)',
            }}
            borderBottom='2px solid transparent'
          >
            Installed
          </Tab>
          <Tab
            px={6}
            color='white'
            _selected={{
              color: 'white',
              borderBottom: '2px solid white',
            }}
            _hover={{
              color: 'white',
              borderBottom: '2px solid rgba(255,255,255,0.4)',
            }}
            borderBottom='2px solid transparent'
          >
            Market
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Installed />
          </TabPanel>
          <TabPanel>
            <Market />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainViewLayout>
  );
};

const Market = () => {
  const { daoBoosts = {} } = useMetaData();
  const [loading, setLoading] = useState(false);
  const [categoryID, setID] = useState('all');
  const selectCategory = id => {
    if (!id) return;
    if (id === categoryID) {
      setID(null);
    } else {
      setID(id);
    }
  };
  return (
    <Flex flexDir='column' w='95%'>
      {daoBoosts ? (
        <Flex>
          <CategorySelector
            categoryID={categoryID}
            selectList={selectCategory}
          />
          <BoostsList categoryID={categoryID} />
        </Flex>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

const Installed = () => {
  const { daoBoosts = {} } = useMetaData();
  const [loading, setLoading] = useState(false);
  const [categoryID, setID] = useState('all');
  const selectCategory = id => {
    if (!id) return;
    if (id === categoryID) {
      setID(null);
    } else {
      setID(id);
    }
  };
  return (
    <Flex flexDir='column' w='95%'>
      {daoBoosts ? (
        <Flex>
          <CategorySelector
            categoryID={categoryID}
            selectList={selectCategory}
            allBoosts={allBoosts}
          />
          <BoostsList categoryID={categoryID} />
        </Flex>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

const CategorySelector = ({ selectList, categoryID, allBoosts }) => {
  return (
    <ListSelector
      topListItem={
        <ListSelectorItem
          listLabel={{
            left: 'All Boosts',
            right: allBoosts?.boosts?.length || 0,
          }}
          isTop
          id='all'
          isSelected={categoryID === 'all'}
          selectList={selectList}
        />
      }
      divider='Categories'
      lists={categories?.map((cat, index) => (
        <ListSelectorItem
          key={cat.id}
          id={cat.id}
          selectList={selectList}
          isSelected={cat.id === categoryID}
          listLabel={{ left: cat.name, right: cat.boosts?.length }}
          isBottom={isLastItem(categories, index)}
        />
      ))}
    />
  );
};

const BoostsList = ({ categoryID }) => {
  const currentCategory = useMemo(() => {
    if (categoryID && categories) {
      if (categoryID === 'all') {
        return allBoosts;
      }
      return categories.find(cat => cat.id === categoryID);
    }
  }, [categoryID, categories]);
  return (
    <List
      headerSection={
        <>
          <InputGroup w='250px' mr={6}>
            <Input placeholder='Search Boosts' />
          </InputGroup>
          <TextBox p={2}>Sort By:</TextBox>
          <Menu isLazy>
            <MenuButton
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              color='secondary.500'
              _hover={{ color: 'secondary.400' }}
              display='inline-block'
            >
              Filter
              <Icon as={RiArrowDropDownFill} color='secondary.500' />
            </MenuButton>
            <MenuList>
              <MenuItem>Title</MenuItem>
            </MenuList>
          </Menu>
        </>
      }
      list={currentCategory?.boosts?.map(boost => (
        <ListItem
          {...BOOSTS[boost]}
          key={boost.id}
          menuSection={
            <Button variant='ghost' p={0}>
              <TextBox>Details</TextBox>
            </Button>
          }
        />
      ))}
    />
  );
};

export default MarketPlaceV0;
