import React, { useContext } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';

import { AppContext } from '../../utils/context';
import { CURRENT_GAMES_QUERY } from '../../constants/queries';
import { RUSSIAN } from '../../constants/colors';

export default function () {
  const { playerId } = useContext(AppContext);
  const { data, error, loading } = useQuery(CURRENT_GAMES_QUERY, {
    variables: {
      playerId
    }
  });

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

  console.log(JSON.stringify({data}));

  return (
    <View>
      <Text>{'Games'}</Text>
      {
        data && data.getGames && data.getGames.length
          ? data.getGames.map((game, i) => <View key={i}>
            <Text style={{marginBotom: 8, fontSize: 24}}>{`game ${i+1}`}</Text>
            <Text style={{paddingLeft: 8}}>{`playerOne: ${game.playerOne}`}</Text>
            <Text style={{paddingLeft: 8}}>{`playerTwo: ${game.playerTwo}`}</Text>
          </View>)
          : <Text>{"You currently don't have any games"}</Text>
      }
    </View>
  );
}
