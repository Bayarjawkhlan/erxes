import * as compose from 'lodash.flowright';

import { Alert, router, withProps } from '@erxes/ui/src/utils';
import { Bulk, Spinner } from '@erxes/ui/src/components';
import {
  MainQueryResponse,
  RemoveMutationResponse,
  RemoveMutationVariables,
} from '../types';
import { mutations, queries } from '../graphql';

import List from '../components/List';
import React from 'react';
import { VoucherCampaignDetailQueryResponse } from '../../../configs/voucherCampaign/types';
import { queries as campaignQueries } from '../../../configs/voucherCampaign/graphql';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

type Props = {
  queryParams: any;
};

type FinalProps = {
  vouchersMainQuery: MainQueryResponse;
  voucherCampaignDetailQuery: VoucherCampaignDetailQueryResponse;
} & Props &
  RemoveMutationResponse;

type State = {
  loading: boolean;
};

class VoucherListContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    const {
      vouchersMainQuery,
      voucherCampaignDetailQuery,
      vouchersRemove,
    } = this.props;

    if (
      vouchersMainQuery.loading ||
      (voucherCampaignDetailQuery && voucherCampaignDetailQuery.loading)
    ) {
      return <Spinner />;
    }

    const removeVouchers = ({ voucherIds }, emptyBulk) => {
      vouchersRemove({
        variables: { _ids: voucherIds },
      })
        .then(() => {
          emptyBulk();
          Alert.success('You successfully deleted a voucher');
        })
        .catch((e) => {
          Alert.error(e.message);
        });
    };

    const searchValue = this.props.queryParams.searchValue || '';
    const { list = [], totalCount = 0 } = vouchersMainQuery.vouchersMain || {};
    const currentCampaign =
      voucherCampaignDetailQuery &&
      voucherCampaignDetailQuery.voucherCampaignDetail;

    const updatedProps = {
      ...this.props,
      totalCount,
      searchValue,
      vouchers: list,
      currentCampaign,
      removeVouchers,
    };

    const vouchersList = (props) => {
      return <List {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.vouchersMainQuery.refetch();
    };

    return <Bulk content={vouchersList} refetch={refetch} />;
  }
}

const generateParams = ({ queryParams }) => ({
  ...router.generatePaginationParams(queryParams || {}),
  ids: queryParams.ids,
  campaignId: queryParams.campaignId,
  status: queryParams.status,
  ownerId: queryParams.ownerId,
  ownerType: queryParams.ownerType,
  searchValue: queryParams.searchValue,
  sortField: queryParams.sortField,
  sortDirection: Number(queryParams.sortDirection) || undefined,
});

const generateOptions = () => ({
  refetchQueries: [
    'vouchersMain',
    'voucherCounts',
    'voucherCategories',
    'voucherCategoriesTotalCount',
  ],
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, MainQueryResponse>(
      gql(queries.vouchersMain),
      {
        name: 'vouchersMainQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only',
        }),
      },
    ),
    graphql<Props, VoucherCampaignDetailQueryResponse>(
      gql(campaignQueries.voucherCampaignDetail),
      {
        name: 'voucherCampaignDetailQuery',
        options: ({ queryParams }) => ({
          variables: {
            id: queryParams.campaignId,
          },
        }),
        skip: ({ queryParams }) => !queryParams.campaignId,
      },
    ),
    // mutations
    graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.vouchersRemove),
      {
        name: 'vouchersRemove',
        options: generateOptions,
      },
    ),
  )(VoucherListContainer),
);
