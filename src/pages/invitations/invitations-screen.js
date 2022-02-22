import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';

import { RUSSIAN } from '../../constants/colors';
import {
  CREATE_GAME_MUTATION,
  INVITATIONS_QUERY,
  DELETE_INVITATION_MUTATION
} from '../../constants/queries';

export default function InvitationsScreen(props) {
  const { data: getInvitationsData, error: getInviteError, loading: getInviteLoading, refetch } = useQuery(INVITATIONS_QUERY, {
    fetchPolicy: 'cache-and-network'
  });
  const [createGameMutate, { data: createGameData, error: createGameError }] = useMutation(CREATE_GAME_MUTATION);
  const [deleteInvitation, { data: deleteInviteData, error: deleteInviteError }] = useMutation(DELETE_INVITATION_MUTATION);

  useEffect(() => {
    if (props.route && props.route.params && props.route.params.updated
       || createGameData && createGameData.createGame
       || deleteInviteData && deleteInviteData.deleteInvitation) {
      refetch();
    }
  }, [props.route.params, createGameData, deleteInviteData]);

  if (getInviteError || !getInviteLoading && !getInvitationsData || !getInviteLoading && !getInvitationsData.getInvitations) {
    return (
      <View style={{ marginTop: 20, marginHorizontal: 5 }}>
        <Text>{'There was an error fetching invitations.'}</Text>
      </View>
    );
  }

  if (getInviteLoading) {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: RUSSIAN.DARK,
        height: '100%'
      }}>
        <Text
          style={{
            marginRight: 16,
            color: RUSSIAN.LIGHT_GRAY,
            fontSize: 24
          }}
        >
          {'Loading invitations'}
        </Text>
        <ActivityIndicator
          color={RUSSIAN.GREEN}
          size={'large'}
        />
      </View>
    );
  }

  const { getInvitations: { invitations: myRequests, inboundGameRequests } } = getInvitationsData;

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView>
        <Text style={styles.title}>{'Invitations'}</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'My Invitations'}</Text>
          <View style={styles.sectionContent}>
            {
              inboundGameRequests.length
                ? inboundGameRequests.map((request, i) => <View key={i} style={styles.invitationItem}>
                  <Text style={styles.person}>{request.invitor}</Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.baseButton, { backgroundColor: RUSSIAN.GREEN }]}
                      onPress={() => {
                        createGameMutate({ variables: { invitationId: request.invitationId } })
                      }}
                    >
                      <Text style={styles.buttonInnerds}>{'Accept'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.baseButton, { backgroundColor: RUSSIAN.ORANGE, marginLeft: 18 }]}>
                      <Text style={styles.buttonInnerds}>{'Decline'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                : <Text style={styles.noDataText}>{"You currently don't have any requests to play."}</Text>
            }
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.requestsHeader}>
            <Text style={styles.sectionTitle}>{'My Sent Invitations'}</Text>
            <View style={[styles.buttonGroup, { alignItems: 'center' }]}>
              <Text style={{ color: RUSSIAN.GREEN }}>{'Create'}</Text>
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => props.navigation.navigate('INVITATION_FORM')}
              >
                <Feather
                  name={'arrow-right-circle'}
                  size={28}
                  color={RUSSIAN.GREEN}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sectionContent}>
            {
              myRequests.length
                ? myRequests.map((request, i) => <View key={i} style={styles.invitationItem}>
                  <Text style={styles.person}>{request.invitee}</Text>
                  <Text style={{ color: RUSSIAN.LIGHT_SKIN }}>{'Pending'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      deleteInvitation({ variables: { invitationId: request.invitationId } });
                    }}
                    style={[styles.baseButton, { backgroundColor: RUSSIAN.ORANGE, marginLeft: 18 }]}
                  >
                    <Text style={styles.buttonInnerds}>{'Revoke'}</Text>
                  </TouchableOpacity>
                </View>)
                : <Text style={styles.noDataText}>{'You have no pending invitations.'}</Text>
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
  section: {
    marginBottom: 32,
    marginTop: 12
  },
  sectionContent: {
    paddingHorizontal: 8,
    marginTop: 12
  },
  person: {
    flex: 1,
    color: RUSSIAN.LIGHT_GRAY
  },
  requestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8
  },
  sectionTitle: {
    color: RUSSIAN.LIGHT_GRAY,
    fontSize: 18,
    fontWeight: '600'
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '100',
    color: RUSSIAN.LIGHT_GRAY,
    marginTop: 12
  },
  invitationItem: {
    borderTopColor: RUSSIAN.DARK_GRAY,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1
  },
  baseButton: {
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonInnerds: {
    color: RUSSIAN.WHITE,
    paddingBottom: 4
  }
});
