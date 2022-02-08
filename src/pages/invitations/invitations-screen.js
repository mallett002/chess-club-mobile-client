import { useQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import InvitationForm from '../../components/invitation-form';
import { RUSSIAN } from '../../constants/colors';
import {
  CREATE_INVITATION_MUTATION,
  CREATE_GAME_MUTATION,
  INVITATIONS_QUERY,
} from '../../constants/queries';
import { getInviteCreationError } from '../../utils/errors';

export default function InvitationsScreen() {
  const [invitationError, setInviteError] = useState(null);
  const [showMakeRequest, setShowMakeRequest] = useState(false);
  const { data: getInvitationsData, error: getInviteError, loading: getInviteLoading, refetch } = useQuery(INVITATIONS_QUERY, {
    fetchPolicy: 'cache-and-network'
  });
  const [mutate, { loading: createInviteLoading }] = useMutation(CREATE_INVITATION_MUTATION, {
    onError: (error) => {
      setInviteError(getInviteCreationError(error));
    },
    onCompleted: () => {
      console.log('success!');
      setInviteError(null);
      setShowMakeRequest(false);
      refetch();
    }
  });
  const createInvitation = (username) => mutate({
    variables: {
      inviteeUsername: username
    }
  });
  const [createGameMutate] = useMutation(CREATE_GAME_MUTATION);
  const createGame = (invitationId, inviteeColor) => createGameMutate({
    variables: {
      invitationId,
      inviteeColor
    }
  });

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
        alignItems: 'center'
      }}>
        <Text style={{ marginRight: 6 }}>{'Loading invitations...'}</Text>
        <ActivityIndicator
          color={RUSSIAN.ORANGE}
          size={'small'}
        />
      </View>
    );
  }

  const { getInvitations: { invitations: myRequests } } = getInvitationsData;
  const inboundGameRequests = [
    {
      invitor: 'sam',
      invitationId: 'some-id'
    },
    {
      invitor: 'billy',
      invitationId: 'some-id'
    },
    {
      invitor: 'bobby',
      invitationId: 'some-id'
    }
  ]

  return (
    <KeyboardAwareScrollView
      scrollEnabled={false}
      style={styles.wrapper}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{'My Invitations'}</Text>
        <View style={styles.sectionContent}>
          {
            inboundGameRequests.length
              ? inboundGameRequests.map((request, i) => <View key={i} style={styles.invitationItem}>
                <Text style={{ flex: 1 }}>{request.invitor}</Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  flex: 1
                }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: RUSSIAN.GREEN,
                      borderRadius: 2,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                    }}
                    onPress={() => {
                      createGame(request.invitationId, 'w');
                    }}
                  >
                    <Text style={{ color: RUSSIAN.WHITE, paddingBottom: 4 }}>{'Accept'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    backgroundColor: RUSSIAN.ORANGE,
                    borderRadius: 2,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginLeft: 18
                  }}>
                    <Text style={{ color: RUSSIAN.WHITE, paddingBottom: 4 }}>{'Decline'}</Text>
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
          <TouchableOpacity
            onPress={() => setShowMakeRequest(true)}
            disabled={showMakeRequest}
          >
            <Feather
              name={'plus-circle'}
              size={28}
              color={showMakeRequest ? RUSSIAN.GRAY : RUSSIAN.GREEN}
            />
          </TouchableOpacity>
        </View>
        {
          showMakeRequest
            ? <InvitationForm
              createInvitation={createInvitation}
              invitationError={invitationError}
              loading={createInviteLoading}
              setShowMakeRequest={setShowMakeRequest}
            />
            : null
        }
        <View style={styles.sectionContent}>
          {
            myRequests.length
              ? myRequests.map((request, i) => <View key={i} style={styles.invitationItem}>
                <Text>{request.invitee}</Text>
                <Text>{'Pending'}</Text>
                <TouchableOpacity style={{
                  backgroundColor: RUSSIAN.ORANGE,
                  borderRadius: 2,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginLeft: 18
                }}>
                  <Text style={{ color: RUSSIAN.WHITE, paddingBottom: 4 }}>{'Revoke'}</Text>
                </TouchableOpacity>
              </View>)
              : <Text style={styles.noDataText}>{'You currently have not invited anyone.'}</Text>
          }
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    paddingHorizontal: 16
  },
  section: {
    marginBottom: 32,
    marginTop: 12
  },
  sectionContent: {
    paddingLeft: 8
  },
  requestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '100',
    color: RUSSIAN.DARK_GRAY
  },
  invitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 12
  },
  inviteButtonStyles: {
    width: 80,
    height: 40,
    backgroundColor: RUSSIAN.GREEN,
    color: RUSSIAN.WHITE
  }
});
