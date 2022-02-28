import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors, { RUSSIAN } from '../../constants/colors';
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
  const { status, playerOne, playerTwo, turn } = data.getBoard;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => props.navigation.goBack()}
        >
          <Feather
            name={'x'}
            size={28}
            color={RUSSIAN.GRAY}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{`Game against someone`}</Text>
      </View>
      <View style={styles.gameStatus}>
        <Text style={styles.oponentText}>{`My turn`}</Text>
        {
          status !== 'CHECK' &&
          <View style={styles.gameAlert}>
            <Text style={styles.alertText}>{'Check!'}</Text>
          </View>
        }
      </View>
      {/* <Board />
      <GameActions /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: RUSSIAN.DARK,
    marginBottom: 16,
    height: '100%'
  },
  header: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 28
  },
  title: {
    fontSize: 24,
    color: RUSSIAN.GREEN
  },
  oponentText: {
    color: RUSSIAN.LIGHT_GRAY,
    marginBottom: 16,
    paddingHorizontal: 12
  },
  gameAlert: {
    borderWidth: 2,
    borderColor: colors.DARK_ORANGE,
    backgroundColor: colors.LIGHT_PEACH,
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  alertText: {
    color: colors.DARK_ORANGE,
    fontSize: 20
  }
});

export default Board;
