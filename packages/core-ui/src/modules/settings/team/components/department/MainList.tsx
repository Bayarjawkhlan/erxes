import {
  DepartmentsMainQueryResponse,
  IDepartment
} from '@erxes/ui/src/team/types';
import {
  FilterContainer,
  InputBar,
  FlexItem,
  Title,
  LeftActionBar
} from '@erxes/ui-settings/src/styles';
import { __, router } from '@erxes/ui/src/utils';

import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import { BarItems } from 'modules/layout/styles';
import Button from 'modules/common/components/Button';
import DataWithLoader from 'modules/common/components/DataWithLoader';
import Form from '../../containers/common/BlockForm';
import FormControl from 'modules/common/components/form/Control';
import Icon from '@erxes/ui/src/components/Icon';
import LeftSidebar from '@erxes/ui/src/layout/components/Sidebar';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import Pagination from 'modules/common/components/pagination/Pagination';
import React from 'react';
import SettingsSideBar from '../../containers/common/SettingSideBar';
import SidebarHeader from '@erxes/ui-settings/src/common/components/SidebarHeader';
import Table from 'modules/common/components/table';
import Tip from '@erxes/ui/src/components/Tip';
import Wrapper from 'modules/layout/components/Wrapper';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import { generateTree } from '../../utils';
import { gql } from '@apollo/client';
import { queries } from '@erxes/ui/src/team/graphql';

type Props = {
  listQuery: DepartmentsMainQueryResponse;
  queryParams: any;
  history: any;
  deleteDepartments: (ids: string[], callback: () => void) => void;
  departments: IDepartment[];
  loading: boolean;
  totalCount: number;
};

type State = {
  selectedItems: string[];
  searchValue: string;
};

class MainList extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      searchValue: props.queryParams.searchValue || ''
    };
  }

  refetchQueries = () => [
    {
      query: gql(queries.departmentsMain),
      variables: {
        withoutUserFilter: true,
        searchValue: undefined,
        ...generatePaginationParams(this.props.queryParams || {})
      }
    }
  ];

  remove = (_id?: string) => {
    if (_id) {
      this.props.deleteDepartments([_id], () =>
        this.setState({ selectedItems: [] })
      );
    } else {
      this.props.deleteDepartments(this.state.selectedItems, () =>
        this.setState({ selectedItems: [] })
      );
    }
  };

  renderForm() {
    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Add Department')}
      </Button>
    );

    const content = ({ closeModal }) => (
      <Form
        closeModal={closeModal}
        queryType="departments"
        additionalRefetchQueries={this.refetchQueries()}
      />
    );

    return (
      <ModalTrigger
        title="Add Department"
        content={content}
        trigger={trigger}
      />
    );
  }

  renderSearch() {
    const search = e => {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      const { history } = this.props;
      const searchValue = e.target.value;

      this.setState({ searchValue });

      this.timer = setTimeout(() => {
        router.removeParams(history, 'page');
        router.setParams(history, { searchValue });
      }, 500);
    };

    const moveCursorAtTheEnd = e => {
      const tmpValue = e.target.value;

      e.target.value = '';
      e.target.value = tmpValue;
    };

    return (
      <FilterContainer marginRight={true}>
        <InputBar type="searchBar">
          <Icon icon="search-1" size={20} />
          <FlexItem>
            <FormControl
              type="text"
              placeholder={__('Type to search')}
              onChange={search}
              value={this.state.searchValue}
              autoFocus={true}
              onFocus={moveCursorAtTheEnd}
            />
          </FlexItem>
        </InputBar>
      </FilterContainer>
    );
  }

  renderRow(department: IDepartment, level) {
    const { selectedItems } = this.state;

    const handleSelect = () => {
      if (selectedItems.includes(department._id)) {
        const removedSelectedItems = selectedItems.filter(
          selectItem => selectItem !== department._id
        );
        return this.setState({ selectedItems: removedSelectedItems });
      }
      this.setState({ selectedItems: [...selectedItems, department._id] });
    };

    const onclick = e => {
      e.stopPropagation();
    };

    const trigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="top">
          <Icon icon="edit-3" />
        </Tip>
      </Button>
    );

    return (
      <tr key={department._id}>
        <td onClick={onclick}>
          <FormControl
            componentClass="checkbox"
            checked={selectedItems.includes(department._id)}
            onClick={handleSelect}
          />
        </td>
        <td>{__(`${'\u00A0 \u00A0 '.repeat(level)}  ${department.code}`)}</td>
        <td>{__(department.title)}</td>
        <td>{department?.parent?.title || ''}</td>
        <td>{__(department?.supervisor?.email || '-')}</td>
        <td>{department.userCount}</td>
        <td>
          <ActionButtons>
            <ModalTrigger
              key={department._id}
              title="Edit Department"
              content={({ closeModal }) => (
                <Form
                  item={department}
                  queryType="departments"
                  additionalRefetchQueries={this.refetchQueries()}
                  closeModal={closeModal}
                />
              )}
              trigger={trigger}
            />
          </ActionButtons>
        </td>
      </tr>
    );
  }

  renderContent() {
    const { departments } = this.props;
    const { selectedItems } = this.state;

    const handleSelectAll = () => {
      if (!selectedItems.length) {
        const departmentIds = departments.map(department => department._id);
        return this.setState({ selectedItems: departmentIds });
      }

      this.setState({ selectedItems: [] });
    };

    return (
      <Table>
        <thead>
          <tr>
            <th>
              <FormControl
                componentClass="checkbox"
                checked={departments?.length === selectedItems.length}
                onClick={handleSelectAll}
              />
            </th>
            <th>{__('Code')}</th>
            <th>{__('Title')}</th>
            <th>{__('Parent')}</th>
            <th>{__('Supervisor')}</th>
            <th>{__('Team member count')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {generateTree(departments, null, (department, level) => {
            return this.renderRow(department, level);
          })}
          {generateTree(departments, '', (department, level) => {
            return this.renderRow(department, level);
          })}
        </tbody>
      </Table>
    );
  }

  renderButtons = () => {
    const { selectedItems } = this.state;

    if (selectedItems.length > 0) {
      return (
        <Button
          btnStyle="danger"
          icon="times-circle"
          onClick={() => this.remove()}
        >
          Remove
        </Button>
      );
    }

    return this.renderForm();
  };

  renderActionBar = () => {
    const { totalCount } = this.props;

    const rightActionBar = (
      <BarItems>
        {this.renderSearch()}
        {this.renderButtons()}
      </BarItems>
    );

    const leftActionBar = (
      <LeftActionBar>
        <Title>{`Departments (${totalCount})`}</Title>
      </LeftActionBar>
    );

    return <Wrapper.ActionBar right={rightActionBar} left={leftActionBar} />;
  };

  render() {
    const { totalCount, loading } = this.props;

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title="Departments"
            breadcrumb={[
              { title: __('Settings'), link: '/settings' },
              { title: __('Departments') }
            ]}
          />
        }
        actionBar={this.renderActionBar()}
        content={
          <DataWithLoader
            loading={loading}
            count={totalCount || 0}
            data={this.renderContent()}
            emptyImage="/images/actions/5.svg"
            emptyText="No Branches"
          />
        }
        leftSidebar={
          <LeftSidebar header={<SidebarHeader />} hasBorder={true}>
            <SettingsSideBar />
          </LeftSidebar>
        }
        footer={<Pagination count={totalCount || 0} />}
        hasBorder={true}
      />
    );
  }
}

export default MainList;
