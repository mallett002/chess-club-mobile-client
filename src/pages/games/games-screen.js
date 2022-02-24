import React, { useContext, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';

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

  const getOpponentUsername = (playerOneId, playerTwoId) => {
    const opponentId = playerOneId === playerId ? playerTwoId : playerOneId;

    return opponentId;
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
                  <Text style={{ color: 'white' }}>{`game ${i + 1}`}</Text>
                  <Text style={{ paddingLeft: 8, color: 'white' }}>{`opponentPlayerId: ${getOpponentUsername(game.playerOne, game.playerTwo)}`}</Text>
                </View>)
                : <Text>{"You currently don't have any games"}</Text>
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
    paddingHorizontal: 8,
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
    paddingVertical: 8
  }
});