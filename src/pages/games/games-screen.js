import React, { useContext, useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';

import { AppContext } from '../../utils/context';
import { CURRENT_GAMES_QUERY } from '../../constants/queries';
import { RUSSIAN } from '../../constants/colors';

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
    return (
      <View>
        <ActivityIndicator
          color={RUSSIAN.ORANGE}
          size={'large'}
        />
      </View>
    );
  }

  return (
    <View>
      <Text>{'Games'}</Text>
      {
        data && data.getGames && data.getGames.length
          ? data.getGames.map((game, i) => <View key={i}>
            <Text style={{marginBottom: 8, fontSize: 24}}>{`game ${i+1}`}</Text>
            <Text style={{paddingLeft: 8}}>{`playerOne: ${game.playerOne}`}</Text>
            <Text style={{paddingLeft: 8}}>{`playerTwo: ${game.playerTwo}`}</Text>
          </View>)
          : <Text>{"You currently don't have any games"}</Text>
      }
    </View>
  );
}
