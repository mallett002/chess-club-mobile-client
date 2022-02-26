import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { RUSSIAN } from '../../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GET_BOARD_QUERY } from '../../constants/queries';
import Loading from '../../components/loading';

// import { AppContext } from '../../utils/context';
// import { removeTokenFromStorage } from '../../utils/token-utils';
// import Loading from '../../components/loading';

function Board(props) {
  const [moves, setMoves] = useState(null);
  const [validMoves, setValidMoves] = useState(null);
  const [selectedCell, select] = useState(null);
  const { gameId } = props.route.params;
  const { data, error, loading: loadingBoard } = useQuery(GET_BOARD_QUERY, { variables: { gameId } });

  if (loadingBoard) {
    return <Loading screen={'Board'} />
  }

  console.log(data);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: RUSSIAN.ORANGE }]}
        onPress={() => props.navigation.goBack()}
      >
        <Text style={{ color: RUSSIAN.WHITE }}>{'go back'}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{'Board'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: RUSSIAN.LIGHT_GRAY
  }
});

export default Board;
