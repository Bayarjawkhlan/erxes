import * as compose from "lodash.flowright";

import {
  ExportHistoriesQueryResponse,
  RemoveMutationResponse,
} from "../../types";
import { router, withProps } from "modules/common/utils";

import { AppConsumer } from "appContext";
import ExportHistories from "../components/Histories";
import React from "react";
import Spinner from "@erxes/ui/src/components/Spinner";
import { generatePaginationParams } from "modules/common/utils/router";
import { gql } from "@apollo/client";
import { graphql } from "@apollo/client/react/hoc";
import { queries } from "../graphql";

type Props = {
  queryParams: any;
  location: any;
  showLoadingBar: (isRemovingImport: boolean) => void;
  closeLoadingBar: () => void;
  isDoneIndicatorAction: boolean;
};

type FinalProps = {
  historiesQuery: ExportHistoriesQueryResponse;
} & Props &
  RemoveMutationResponse;

type State = {
  loading: boolean;
};

class HistoriesContainer extends React.Component<FinalProps, State> {
  constructor(props: FinalProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    const { historiesQuery } = this.props;

    const histories = historiesQuery.exportHistories || {};
    const list = histories.list || [];

    if (historiesQuery.loading) {
      return <Spinner />;
    }

    if (list.length === 0) {
      historiesQuery.stopPolling();
    }

    if (list[0] && list[0].percentage === 100) {
      historiesQuery.stopPolling();
    }

    const currentType = router.getParam(history, "type");

    const updatedProps = {
      ...this.props,
      histories: histories.list || [],
      loading: historiesQuery.loading || this.state.loading,
      totalCount: histories.count || 0,
      currentType,
    };

    return (
      <>
        <ExportHistories {...updatedProps} />
      </>
    );
  }
}

const historiesListParams = (queryParams) => ({
  ...generatePaginationParams(queryParams),
  type: queryParams.type || "customer",
});

const HistoriesWithProps = withProps<Props>(
  compose(
    graphql<Props, ExportHistoriesQueryResponse, { type: string }>(
      gql(queries.exportHistories),
      {
        name: "historiesQuery",
        options: ({ queryParams }) => ({
          fetchPolicy: "network-only",
          variables: historiesListParams(queryParams),
          pollInterval: 3000,
        }),
      }
    )
  )(HistoriesContainer)
);

const WithConsumer = (props) => {
  return (
    <AppConsumer>
      {({ showLoadingBar, closeLoadingBar }) => (
        <HistoriesWithProps
          {...props}
          showLoadingBar={showLoadingBar}
          closeLoadingBar={closeLoadingBar}
        />
      )}
    </AppConsumer>
  );
};

export default WithConsumer;
