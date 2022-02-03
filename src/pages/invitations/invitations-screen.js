import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { TextInput, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import InvitationForm from '../../components/invitation-form';
import colors, { RUSSIAN } from '../../constants/colors';

const INVITATIONS_QUERY = gql`
  query GetInvitations {
    getInvitations {
      invitations {
        invitationId
        invitee
      }
      inboundGameRequests {
        invitationId
        invitor
      }
    }
  }
`;

export default function InvitationsScreen() {
  const { data, error, loading, refetch } = useQuery(INVITATIONS_QUERY);
  const [showMakeRequest, setShowMakeRequest] = useState(false);

  if (error || !loading && !data || !loading && !data.getInvitations) {
    return (
      <View><Text>{'Something went wrong.'}</Text></View>
    );
  }

  if (loading) {
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

  const { getInvitations: { invitations: myRequests, inboundGameRequests } } = data;
  const fakeInvitations = [{ invitor: 'jeffreyDSerb' }, { invitor: 'bmallYourPal' }, { invitor: 'dickTracy' }];
  const fakeRequests = [{ invitee: 'tStark' }, { invitee: 'snoozYaLoose' }, { invitee: 'tomHafferty' }];

  return (
    <KeyboardAwareScrollView
      scrollEnabled={false}
      style={styles.wrapper}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{'My Invitations'}</Text>
        <View style={styles.sectionContent}>
          {
            fakeInvitations.length
              ? fakeInvitations.map((request, i) => <View key={i} style={styles.invitationItem}>
                <Text>{request.invitor}</Text>
                <TouchableOpacity style={{
                  backgroundColor: RUSSIAN.GREEN,
                  borderRadius: 2,
                  paddingVertical: 2,
                  paddingHorizontal: 8
                }}>
                  <Text style={{ color: RUSSIAN.WHITE, paddingBottom: 2 }}>{'Accept'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: RUSSIAN.ORANGE,
                  borderRadius: 2,
                  paddingVertical: 2,
                  paddingHorizontal: 8
                }}>
                  <Text style={{ color: RUSSIAN.WHITE, paddingBottom: 2 }}>{'Decline'}</Text>
                </TouchableOpacity>
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
              color={showMakeRequest ? RUSSIAN.DARK_GRAY : RUSSIAN.GREEN}
            />
          </TouchableOpacity>
        </View>
        {
          showMakeRequest
            ? <InvitationForm setShowMakeRequest={setShowMakeRequest} />
            : null
        }
        <View style={styles.sectionContent}>
          {
            fakeRequests.length
              ? fakeRequests.map((request, i) => <View key={i} style={styles.invitationItem}>
                <Text>{request.invitee}</Text>
                <Text style={{ color: colors.LIGHT_CELL, fontSize: 12 }}>{'Pending'}</Text>
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
    marginBottom: 16
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
    width: '70%',
    marginVertical: 4
  },
  inviteButtonStyles: {
    width: 80,
    height: 40,
    backgroundColor: RUSSIAN.GREEN,
    color: RUSSIAN.WHITE
  }
});
