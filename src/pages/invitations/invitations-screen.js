import React from 'react';
import { Text, View } from 'react-native';
import { gql, useQuery } from '@apollo/client';

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

export default function() {
  const { data, error, loading, refetch } = useQuery(INVITATIONS_QUERY);

  console.log(JSON.stringify({data, error, loading}, null, 2));
  return (
    <View><Text>{'Invitations'}</Text></View>
  );
}
