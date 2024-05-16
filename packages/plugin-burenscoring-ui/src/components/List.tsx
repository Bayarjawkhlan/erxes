import Row from './Row';
import { __, Pagination } from '@erxes/ui/src';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Table from '@erxes/ui/src/components/table';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';

type Props = {
  burenCustomerScorings: any;
  totalCount: number;
  loading: boolean
};

function List({
  burenCustomerScorings,
  loading,
  totalCount
}: Props) {
  const content = (
    <Table $whiteSpace="nowrap" $bordered={true} $hover={true} $striped>
      <thead>
        <tr>
          <th>{__('score')}</th>
          <th>{__('firstname')}</th>
          <th>{__('registerno')}</th>
          <th>{__('Type')}</th>
          <th>{__('active normal loans')}</th>
          <th>{__('active bad loans')}</th>
          <th>{__('closed loans')}</th>
        </tr>
      </thead>
      <tbody id={'BurenscoringsShowing'}>
        {burenCustomerScorings.map(burenScoring => {
          return (
            <Row
              key={burenScoring._id}
              burenScoring={burenScoring}
            />
          );
        })}
      </tbody>
    </Table>
  );
  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Burenscorings'), link: '/burenscorings' }
  ];

  return (
    <Wrapper
      header={<Wrapper.Header title={__('Burenscorings')} breadcrumb={breadcrumb} />}
      footer={<Pagination count={totalCount || 0} />}
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={burenCustomerScorings.length}
          emptyText={__('Theres no burenscoring')}
          emptyImage="/images/actions/8.svg"
        />
      }
      hasBorder
    />
  );
}

export default List;
