import React from 'react';
import {Searchbar} from 'react-native-paper';
import themes from '../../themes';

const CustomSearchBar = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={(val) => props.onValueChange(val)}
      value={props.value}
      style={{
        margin: 5,
        borderRadius: 25,
        borderColor: themes.GREEN_BLUE,
        borderWidth: 2,
        flex: 1,
      }}
    />
  );
};

export default CustomSearchBar;
