import {
  Alert,
  Button,
  confirm,
  DropdownToggle,
  Icon,
  MainStyleInfoWrapper as InfoWrapper,
  ModalTrigger,
  Sidebar,
} from "@erxes/ui/src";
import { __ } from "coreui/utils";
import React, { useState } from "react";
import Dropdown from "@erxes/ui/src/components/Dropdown";

import ContractForm from "../../containers/ContractForm";
import CloseForm from "../../containers/detail/CloseForm";
import { Action, Name } from "../../styles";
import { IContract } from "../../types";
import DetailInfo from "./DetailInfo";
import { getEnv } from "@erxes/ui/src/utils";
import client from "@erxes/ui/src/apolloClient";
import { gql } from "@apollo/client";
import { queries } from "../../graphql";
import { can, isEnabled } from "@erxes/ui/src/utils/core";
import withConsumer from "../../../withConsumer";
import { IUser } from "@erxes/ui/src/auth/types";
import ExpandForm from "../../containers/detail/ExpandForm";

type Props = {
  contract: IContract;
  currentUser: IUser;
  remove: () => void;
};

const BasicInfoSection = (props: Props) => {
  const [documents, setDocuments] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const { remove, contract, currentUser } = props;

  const renderAction = () => {
    const onDelete = () =>
      confirm()
        .then(() => remove())
        .catch((error) => {
          Alert.error(error.message);
        });

    const onOpen = () => {
      if (!isEnabled("documents")) return;
      setLoading(true);
      client
        .mutate({
          mutation: gql(queries.documents),
          variables: { contentType: "savings" },
        })
        .then(({ data }) => {
          setDocuments(data.documents);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    };

    const onPrint = (mur) => {
      window.open(
        `${getEnv().REACT_APP_API_URL}/pl:documents/print?_id=${
          mur._id
        }&contractId=${contract?._id}`
      );
    };

    const closeForm = (props) => <CloseForm {...props} contract={contract} />;

    const expandForm = (props) => <ExpandForm {...props} contract={contract} />;

    const contractForm = (props) => (
      <ContractForm change {...props} contract={contract} />
    );

    return (
      <Action>
        <Dropdown
          // onToggle={(isShown) => isShown && onOpen()}
          as={DropdownToggle}
          toggleComponent={
            <Button btnStyle="simple" size="medium">
              {__("Action")}
              <Icon icon="angle-down" />
            </Button>
          }
        >
          {documents?.map((mur) => {
            return (
              <li key={mur._id}>
                <a href="#print" onClick={() => onPrint(mur)}>
                  {__("Print") + " " + mur.name}
                </a>
              </li>
            );
          })}
          {can("contractsClose", currentUser) && (
            <li>
              <ModalTrigger
                title={__("To Close Contract")}
                trigger={<a href="#toClose">{__("To Close Contract")}</a>}
                size="lg"
                content={closeForm}
              />
            </li>
          )}
          <li>
            <ModalTrigger
              title={__("Expand Contract")}
              trigger={<a href="#toClose">{__("Expand Contract")}</a>}
              size="lg"
              content={expandForm}
            />
          </li>
          <li>
            <ModalTrigger
              title={__("Change Contract")}
              trigger={<a href="#toClose">{__("Change Contract")}</a>}
              size="lg"
              content={contractForm}
            />
          </li>

          {can("contractsRemove", currentUser) && (
            <li>
              <a href="#delete" onClick={onDelete}>
                {__("Delete")}
              </a>
            </li>
          )}
        </Dropdown>
      </Action>
    );
  };

  const { Section } = Sidebar;

  const contractForm = (props) => (
    <ContractForm {...props} contract={contract} />
  );

  return (
    <Sidebar.Section>
      <InfoWrapper>
        <Name>{contract.number}</Name>
        {can("contractsEdit", currentUser) && (
          <ModalTrigger
            title={__("Edit basic info")}
            trigger={<Icon icon="edit" />}
            size="xl"
            content={contractForm}
          />
        )}
      </InfoWrapper>

      {renderAction()}

      <Section>
        <DetailInfo contract={contract} />
      </Section>
    </Sidebar.Section>
  );
};

export default withConsumer(BasicInfoSection);
