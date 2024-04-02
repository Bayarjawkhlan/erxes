import React, { useRef, useState } from "react";

import RTG from "react-transition-group";
import Dropdown from "react-bootstrap/Dropdown";

import CollapsibleList from "@erxes/ui/src/components/collapsibleList/CollapsibleList";
import DropdownToggle from "@erxes/ui/src/components/DropdownToggle";
import EmptyState from "@erxes/ui/src/components/EmptyState";
import Spinner from "@erxes/ui/src/components/Spinner";
import Button from "@erxes/ui/src/components/Button";
import Icon from "@erxes/ui/src/components/Icon";
import Tip from "@erxes/ui/src/components/Tip";
import Box from "@erxes/ui/src/components/Box";
import { SidebarList } from "@erxes/ui/src/layout/styles";
import { __ } from "@erxes/ui/src/utils/index";
import { router } from "@erxes/ui/src/utils";

import FormContainer from "../../containers/report/Form";
import SectionList from "../../containers/section/List";
import { RightDrawerContainer } from "../../styles";
import { IReport, ISection } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  queryParams: any;

  reports: IReport[];
  sections: ISection[];
  loading: boolean;

  removeReports: (reportIds: string[]) => void;
};

const ReportSection = (props: Props) => {
  const { queryParams, reports, sections, loading, removeReports } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const wrapperRef = useRef<any>(null);

  const [showDrawer, setShowDrawer] = useState<any>(false);
  const [currentReport, setCurrentReport] = useState<any>({} as any);

  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const extraButtons = (
    <Dropdown drop="down" alignRight={true}>
      <Dropdown.Toggle as={DropdownToggle} id="dropdown-info">
        <Icon icon="ellipsis-h" size={16} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <li>
          <a
            href="#addReport"
            onClick={() => {
              setCurrentReport({} as any);
              setShowDrawer(!showDrawer);
            }}
          >
            <Icon icon="plus-1" />

            {__("Report")}
          </a>
        </li>
      </Dropdown.Menu>
    </Dropdown>
  );

  const renderEditAction = (report: any) => {
    return (
      <Button
        btnStyle="link"
        onClick={() => {
          setCurrentReport(report);
          setShowDrawer(!showDrawer);
        }}
      >
        <Tip text={__("Edit")} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );
  };

  const renderRemoveAction = (report: any) => {
    return (
      <Button btnStyle="link" onClick={() => removeReports([report._id])}>
        <Tip text={__("Remove")} placement="bottom">
          <Icon icon="times-circle" />
        </Tip>
      </Button>
    );
  };

  const handleClick = (reportId) => {
    router.removeParams(navigate, location, ...Object.keys(queryParams));
    router.setParams(navigate, location, { reportId });
  };

  const renderListWithoutSection = () => {
    const items = reports.filter(
      (report) =>
        report.sectionId === null || !report.hasOwnProperty("sectionId")
    );

    if (items.length === 0) {
      return null;
    }

    return (
      <CollapsibleList
        items={items}
        queryParamName="reportId"
        queryParams={queryParams}
        keyCount="chartsCount"
        icon="chart-pie"
        treeView={false}
        onClick={handleClick}
        editAction={renderEditAction}
        removeAction={renderRemoveAction}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner objective={true} />;
    }

    if (sections?.length === 0 && reports?.length === 0) {
      return <EmptyState icon="align-justify" text="No data for report" />;
    }

    return (
      <SidebarList>
        {sections.map((section) => (
          <SectionList
            key={section._id}
            section={section}
            list={reports}
            queryParamName="reportId"
            queryParams={queryParams}
            handleClick={handleClick}
            renderEditAction={renderEditAction}
            renderRemoveAction={renderRemoveAction}
          />
        ))}
        {<div>{renderListWithoutSection()}</div>}
      </SidebarList>
    );
  };

  return (
    <>
      <Box
        title="Report"
        name="report"
        isOpen={
          Object.keys(queryParams).length === 0 ? true : !!queryParams.reportId
        }
        collapsible={false}
        extraButtons={extraButtons}
      >
        {renderContent()}
      </Box>

      <div ref={wrapperRef}>
        <RTG.CSSTransition
          in={showDrawer}
          timeout={300}
          classNames="slide-in-right"
          unmountOnExit={true}
        >
          <RightDrawerContainer>
            {
              <FormContainer
                queryParams={queryParams}
                reportId={currentReport._id}
                closeDrawer={closeDrawer}
              />
            }
          </RightDrawerContainer>
        </RTG.CSSTransition>
      </div>
    </>
  );
};

export default ReportSection;
