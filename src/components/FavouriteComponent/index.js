import React from 'react';
import {Searchbar} from 'react-native-paper';
import themes from '../../themes';
import heartPic from '../../assets/heart.png';
import heartFilledPic from '../../assets/heartFilled.png';
import {View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
const FavouriteComponent = (props) => {
  const [selected, setSelected] = React.useState(false);

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <TouchableOpacity onPress={() => setSelected(!selected)}>
      {selected ? (
        <Image source={heartFilledPic} style={{width: 30, height: 30}} />
      ) : (
        <Image source={heartPic} style={{width: 30, height: 30}} />
      )}
      {/* <Image source={heartPic} style={{width: 30, height: 30}} /> */}
    </TouchableOpacity>
  );
};

export default FavouriteComponent;
