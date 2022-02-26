import React, { useContext, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';

import { AppContext } from '../../utils/context';
import { CURRENT_GAMES_QUERY } from '../../constants/queries';
import { RUSSIAN } from '../../constants/colors';
import Loading from '../../components/loading';

export default function (props) {
  const { playerId } = useContext(AppContext);
  const { data, error, loading, refetch } = useQuery(CURRENT_GAMES_QUERY, {
    variables: {
      playerId
    },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (refetch) {
        refetch();
      }
    });

    return unsubscribe;
  }, [props.navigation]);

  if (loading) {
    return <Loading screen={'Games'} />;
  }
  const isMyTurn = (game) => game.turn === playerId;
  const getTurnText = (game) => {
    if (isMyTurn(game)) {
      return 'My turn';
    }

    return `${game.opponentUsername}'s turn`;
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView>
        <Text style={styles.title}>{'Games'}</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Current Games'}</Text>
          <View style={styles.gamesList}>
            {
              data && data.getGames && data.getGames.length
                ? data.getGames.map((game, i) => <View style={styles.gameItem} key={i}>
                  <View style={styles.opponent}>
                    <Text style={styles.opponentText}>{game.opponentUsername}</Text>
                    <Text style={{ color: isMyTurn(game) ? RUSSIAN.GREEN : RUSSIAN.LIGHT_SKIN }}>{getTurnText(game)}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('BOARD')}
                    style={styles.goToGameButton}
                  >
                    <Feather
                      name={'arrow-right-circle'}
                      size={28}
                      color={RUSSIAN.GREEN}
                    />
                  </TouchableOpacity>
                </View>)
                : <Text style={styles.noGamesText}>{"You currently don't have any games"}</Text>
            }
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: RUSSIAN.DARK,
    paddingHorizontal: 16,
    height: '100%'
  },
  title: {
    color: RUSSIAN.GREEN,
    fontSize: 32,
    marginBottom: 16,
    marginTop: 24
  },
  gamesList: {
    marginTop: 12
  },
  section: {
    marginBottom: 32,
    marginTop: 12,
  },
  sectionTitle: {
    color: RUSSIAN.LIGHT_GRAY,
    fontSize: 18,
    fontWeight: '600'
  },
  gameItem: {
    borderTopColor: RUSSIAN.DARK_GRAY,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  opponent: {
    paddingLeft: 8,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  opponentText: {
    color: RUSSIAN.LIGHT_GRAY,
  },
  goToGameButton: {
    paddingRight: 8
  },
  noGamesText: {
    borderTopColor: RUSSIAN.DARK_GRAY,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: '100',
    color: RUSSIAN.LIGHT_GRAY
  }
});